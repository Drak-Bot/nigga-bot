import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const COBALT_APIS = [
  'https://api.cobalt.tools',
  'https://cobalt-api.kwiatekmiki.com',
  'https://cobalt-api.meowing.de',
  'https://cobalt-backend.canine.tools',
  'https://cobalt-api.2ez4u.dev'
]

const MAX_VIDEO_SIZE = 200 * 1024 * 1024
const MAX_AUDIO_SIZE = 50 * 1024 * 1024
const REQUEST_TIMEOUT = 25000

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const clean = text =>
  String(text || '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const request = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: '*/*',
        ...(options.headers || {})
      }
    })

    return response
  } finally {
    clearTimeout(timer)
  }
}

const getYoutube = async query => {
  if (/^https?:\/\//i.test(query)) {
    try {
      const result = await yts(query)
      const video =
        result.videos?.find(x => x.url === query) ||
        result.videos?.[0]

      if (video) {
        return {
          url: video.url,
          title: video.title || 'YouTube',
          duration: video.timestamp || '',
          thumbnail: video.thumbnail || null,
          author: video.author?.name || ''
        }
      }
    } catch {}

    return {
      url: query,
      title: 'YouTube',
      duration: '',
      thumbnail: null,
      author: ''
    }
  }

  const result = await yts(query)
  const video = result.videos?.[0]

  if (!video) {
    throw new Error('Nessun risultato YouTube trovato.')
  }

  return {
    url: video.url,
    title: video.title || 'YouTube',
    duration: video.timestamp || '',
    thumbnail: video.thumbnail || null,
    author: video.author?.name || ''
  }
}

const cobaltRequest = async (api, youtubeUrl, mode) => {
  const endpoint = `${api.replace(/\/$/, '')}/`

  const body = {
    url: youtubeUrl,
    downloadMode: mode === 'audio' ? 'audio' : 'auto',
    audioFormat: 'mp3',
    videoQuality: '720',
    filenameStyle: 'pretty',
    disableMetadata: false
  }

  const response = await request(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  })

  const raw = await response.text()

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  let data

  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Risposta provider non valida.')
  }

  if (!data) {
    throw new Error('Risposta vuota.')
  }

  if (data.status === 'error') {
    throw new Error(
      data.error?.code ||
      data.error?.message ||
      'Provider download non disponibile.'
    )
  }

  if (data.status === 'redirect' && data.url) {
    return {
      type: 'url',
      url: data.url,
      filename: data.filename || null
    }
  }

  if (data.status === 'tunnel' && data.url) {
    return {
      type: 'url',
      url: data.url,
      filename: data.filename || null
    }
  }

  if (data.status === 'stream' && data.url) {
    return {
      type: 'url',
      url: data.url,
      filename: data.filename || null
    }
  }

  throw new Error('Il provider non ha restituito un file.')
}

const getDownload = async (youtubeUrl, mode) => {
  let lastError = null

  const shuffled = [...COBALT_APIS].sort(() => Math.random() - 0.5)

  for (const api of shuffled) {
    try {
      const result = await cobaltRequest(api, youtubeUrl, mode)

      if (result?.url) {
        return {
          ...result,
          provider: api
        }
      }
    } catch (error) {
      lastError = error
    }

    await sleep(250)
  }

  throw new Error(
    lastError?.message ||
    'Nessun provider pubblico disponibile.'
  )
}

const downloadBuffer = async url => {
  const response = await request(url, {
    method: 'GET'
  }, 60000)

  if (!response.ok) {
    throw new Error(`Download HTTP ${response.status}`)
  }

  const contentLength =
    Number(response.headers.get('content-length') || 0)

  if (contentLength > MAX_VIDEO_SIZE) {
    throw new Error('Il file supera il limite massimo consentito.')
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  if (!buffer.length) {
    throw new Error('File scaricato vuoto.')
  }

  if (buffer.length > MAX_VIDEO_SIZE) {
    throw new Error('Il file supera il limite massimo consentito.')
  }

  return buffer
}

const convertToMp3 = async (input, output) => {
  await execFileAsync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      input,
      '-vn',
      '-map',
      '0:a:0',
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '128k',
      '-ar',
      '44100',
      '-ac',
      '2',
      output
    ],
    {
      timeout: 120000
    }
  )

  if (!fs.existsSync(output)) {
    throw new Error('FFmpeg non ha prodotto il file MP3.')
  }

  const stat = fs.statSync(output)

  if (!stat.size) {
    throw new Error('MP3 generato vuoto.')
  }

  if (stat.size > MAX_AUDIO_SIZE) {
    throw new Error('MP3 troppo grande per essere inviato.')
  }

  return fs.readFileSync(output)
}

const sendMenu = async (
  m,
  conn,
  video,
  usedPrefix
) => {
  const caption =
    `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
    `┃\n` +
    `┃ 🎵 *${video.title}*\n` +
    `┃ ⏱️ ${video.duration || 'Sconosciuta'}\n` +
    `┃ 👤 ${video.author || 'YouTube'}\n` +
    `┃\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `🎛️ *Seleziona il formato:*`

  const buttons = [
    {
      buttonId: `${usedPrefix}playaud ${video.url}`,
      buttonText: {
        displayText: '🎵 𝗔𝗨𝗗𝗜𝗢 𝗠𝗣𝟯'
      },
      type: 1
    },
    {
      buttonId: `${usedPrefix}playvid ${video.url}`,
      buttonText: {
        displayText: '🎬 𝗩𝗜𝗗𝗘𝗢 𝗠𝗣𝟰'
      },
      type: 1
    }
  ]

  if (video.thumbnail) {
    return conn.sendMessage(
      m.chat,
      {
        image: {
          url: video.thumbnail
        },
        caption,
        footer: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
        buttons,
        headerType: 4
      },
      {
        quoted: m
      }
    )
  }

  return conn.sendMessage(
    m.chat,
    {
      text: caption,
      footer: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
      buttons,
      headerType: 1
    },
    {
      quoted: m
    }
  )
}

const sendReact = async (conn, m, emoji) => {
  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: m.key
      }
    })
  } catch {}
}

const handler = async (
  m,
  {
    conn,
    text,
    usedPrefix,
    command
  }
) => {
  const cmd = String(command || '').toLowerCase()
  const query = String(text || '').trim()

  if (!query) {
    return m.reply(
      `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚡ *Uso:*\n` +
      `┃ ${usedPrefix}play nome canzone\n` +
      `┃\n` +
      `┃ 🎵 ${usedPrefix}playaud nome canzone\n` +
      `┃ 🎬 ${usedPrefix}playvid nome canzone\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  let tempInput = null
  let tempOutput = null

  try {
    const video = await getYoutube(query)

    if (cmd === 'play') {
      return sendMenu(
        m,
        conn,
        video,
        usedPrefix
      )
    }

    await sendReact(conn, m, '📥')

    const mode =
      cmd === 'playaud'
        ? 'audio'
        : 'video'

    const download = await getDownload(
      video.url,
      mode
    )

    if (!download?.url) {
      throw new Error(
        'Nessun URL di download disponibile.'
      )
    }

    console.log(
      `[NIGGA-BOT] Provider: ${download.provider}`
    )

    console.log(
      `[NIGGA-BOT] Download: ${download.url}`
    )

    const buffer = await downloadBuffer(
      download.url
    )

    if (cmd === 'playvid') {
      if (buffer.length > MAX_VIDEO_SIZE) {
        throw new Error(
          'Il video è troppo grande.'
        )
      }

      await conn.sendMessage(
        m.chat,
        {
          video: buffer,
          mimetype: 'video/mp4',
          fileName: `${clean(video.title)}.mp4`,
          caption:
            `╭━━━〔 🎬 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
            `┃\n` +
            `┃ 🎵 *${video.title}*\n` +
            `┃ ⏱️ ${video.duration || 'N/D'}\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        },
        {
          quoted: m
        }
      )

      await sendReact(conn, m, '✅')

      return
    }

    tempInput = path.join(
      os.tmpdir(),
      `niggabot-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.bin`
    )

    tempOutput = path.join(
      os.tmpdir(),
      `niggabot-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.mp3`
    )

    fs.writeFileSync(
      tempInput,
      buffer
    )

    const audio = await convertToMp3(
      tempInput,
      tempOutput
    )

    await conn.sendMessage(
      m.chat,
      {
        audio,
        mimetype: 'audio/mpeg',
        fileName: `${clean(video.title)}.mp3`,
        ptt: false
      },
      {
        quoted: m
      }
    )

    await sendReact(conn, m, '✅')
  } catch (error) {
    console.error(
      '[NIGGA-BOT PLAY ERROR]',
      error
    )

    await sendReact(conn, m, '❌')

    return m.reply(
      `╭━━━〔 ❌ 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚠️ *Download fallito*\n` +
      `┃\n` +
      `┃ ${error?.message || 'Errore sconosciuto'}\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  } finally {
    try {
      if (
        tempInput &&
        fs.existsSync(tempInput)
      ) {
        fs.unlinkSync(tempInput)
      }
    } catch {}

    try {
      if (
        tempOutput &&
        fs.existsSync(tempOutput)
      ) {
        fs.unlinkSync(tempOutput)
      }
    } catch {}
  }
}

handler.help = [
  'play',
  'playaud',
  'playvid'
]

handler.tags = [
  'downloader'
]

handler.command =
  /^(play|playaud|playvid)$/i

handler.group = true

export default handler