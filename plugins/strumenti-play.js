import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const PROVIDERS = [
  {
    url: 'https://api.cobalt.tools',
    endpoint: '/',
    version: 'modern'
  },
  {
    url: 'https://api.cobalt.tools',
    endpoint: '/api/json',
    version: 'legacy'
  }
]

const TIMEOUT = 30000
const DOWNLOAD_TIMEOUT = 120000
const MAX_VIDEO = 200 * 1024 * 1024
const MAX_AUDIO = 50 * 1024 * 1024

const clean = value =>
  String(value || '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const request = async (url, options = {}, timeout = TIMEOUT) => {
  const controller = new AbortController()
  const timer = setTimeout(
    () => controller.abort(),
    timeout
  )

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        Accept: '*/*',
        ...(options.headers || {})
      }
    })
  } finally {
    clearTimeout(timer)
  }
}

const searchYoutube = async query => {
  if (/^https?:\/\//i.test(query)) {
    try {
      const result = await yts(query)

      const video =
        result.videos?.find(
          x => x.url === query
        ) ||
        result.videos?.[0]

      if (video) {
        return {
          url: video.url,
          title: video.title || 'YouTube',
          duration: video.timestamp || '',
          thumbnail: video.thumbnail || null,
          author:
            video.author?.name ||
            'YouTube'
        }
      }
    } catch {}

    return {
      url: query,
      title: 'YouTube',
      duration: '',
      thumbnail: null,
      author: 'YouTube'
    }
  }

  const result = await yts(query)

  if (!result?.videos?.length) {
    throw new Error(
      'Nessun risultato trovato su YouTube.'
    )
  }

  const video = result.videos[0]

  return {
    url: video.url,
    title: video.title || 'YouTube',
    duration: video.timestamp || '',
    thumbnail: video.thumbnail || null,
    author:
      video.author?.name ||
      'YouTube'
  }
}

const parseResponse = async response => {
  const raw = await response.text()

  let data = null

  try {
    data = JSON.parse(raw)
  } catch {}

  if (!response.ok) {
    const message =
      data?.text ||
      data?.message ||
      data?.error?.message ||
      data?.error ||
      raw ||
      `HTTP ${response.status}`

    throw new Error(
      `HTTP ${response.status}: ${message}`
    )
  }

  if (!data) {
    throw new Error(
      'Il provider ha restituito una risposta non JSON.'
    )
  }

  if (
    data.status === 'error' ||
    data.status === 'rate-limit'
  ) {
    throw new Error(
      data.text ||
      data.message ||
      data.error?.message ||
      `Provider ${data.status}`
    )
  }

  const url =
    data.url ||
    data.audio ||
    data.downloadUrl ||
    data.download?.url ||
    data.result?.url ||
    data.result?.downloadUrl

  if (!url) {
    throw new Error(
      'Il provider non ha restituito un URL di download.'
    )
  }

  return {
    url,
    filename:
      data.filename ||
      data.download?.filename ||
      null,
    status:
      data.status ||
      'success'
  }
}

const cobalt = async (
  provider,
  youtubeUrl,
  mode
) => {
  const endpoint =
    provider.url.replace(/\/$/, '') +
    provider.endpoint

  let body

  if (provider.version === 'modern') {
    body = {
      url: youtubeUrl,
      downloadMode:
        mode === 'audio'
          ? 'audio'
          : 'auto',
      audioFormat: 'mp3',
      audioBitrate: '128',
      videoQuality: '720',
      youtubeVideoCodec: 'h264',
      filenameStyle: 'pretty',
      disableMetadata: false
    }
  } else {
    body = {
      url: youtubeUrl,
      vCodec: 'h264',
      vQuality: '720',
      aFormat: 'mp3',
      isAudioOnly: mode === 'audio',
      filenamePattern: 'pretty',
      disableMetadata: false
    }
  }

  const response = await request(
    endpoint,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify(body)
    },
    TIMEOUT
  )

  return parseResponse(response)
}

const getDownload = async (
  youtubeUrl,
  mode
) => {
  const errors = []

  const providers = [
    ...PROVIDERS
  ]

  for (const provider of providers) {
    try {
      const result = await cobalt(
        provider,
        youtubeUrl,
        mode
      )

      if (result?.url) {
        return result
      }
    } catch (error) {
      errors.push(
        `${provider.url}${provider.endpoint}: ${
          error?.message || 'errore'
        }`
      )
    }
  }

  throw new Error(
    `Nessun provider disponibile.\n${errors.join(
      '\n'
    )}`
  )
}

const downloadBuffer = async url => {
  const response = await request(
    url,
    {
      method: 'GET'
    },
    DOWNLOAD_TIMEOUT
  )

  if (!response.ok) {
    throw new Error(
      `Download HTTP ${response.status}`
    )
  }

  const contentLength = Number(
    response.headers.get(
      'content-length'
    ) || 0
  )

  if (
    contentLength &&
    contentLength > MAX_VIDEO
  ) {
    throw new Error(
      'Il file supera il limite massimo.'
    )
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  )

  if (!buffer.length) {
    throw new Error(
      'Il file scaricato è vuoto.'
    )
  }

  if (buffer.length > MAX_VIDEO) {
    throw new Error(
      'Il file supera il limite massimo.'
    )
  }

  return buffer
}

const convertMp3 = async (
  input,
  output
) => {
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
      timeout:
        DOWNLOAD_TIMEOUT
    }
  )

  if (
    !fs.existsSync(output)
  ) {
    throw new Error(
      'FFmpeg non ha creato il file MP3.'
    )
  }

  const stat =
    fs.statSync(output)

  if (!stat.size) {
    throw new Error(
      'Il file MP3 è vuoto.'
    )
  }

  if (
    stat.size > MAX_AUDIO
  ) {
    throw new Error(
      'Il file MP3 è troppo grande.'
    )
  }

  return fs.readFileSync(output)
}

const react = async (
  conn,
  m,
  emoji
) => {
  try {
    await conn.sendMessage(
      m.chat,
      {
        react: {
          text: emoji,
          key: m.key
        }
      }
    )
  } catch {}
}

const sendMenu = async (
  conn,
  m,
  video,
  usedPrefix
) => {
  const caption =
    `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
    `┃\n` +
    `┃ 🎵 *${video.title}*\n` +
    `┃ ⏱️ *${video.duration || 'N/D'}*\n` +
    `┃ 👤 *${video.author || 'YouTube'}*\n` +
    `┃\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
    `🎛️ *Scegli il formato:*`

  const buttons = [
    {
      buttonId:
        `${usedPrefix}playaud ${video.url}`,
      buttonText: {
        displayText:
          '🎵 𝗔𝗨𝗗𝗜𝗢 𝗠𝗣𝟯'
      },
      type: 1
    },
    {
      buttonId:
        `${usedPrefix}playvid ${video.url}`,
      buttonText: {
        displayText:
          '🎬 𝗩𝗜𝗗𝗘𝗢 𝗠𝗣𝟰'
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
        footer:
          '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
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
      footer:
        '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
      buttons,
      headerType: 1
    },
    {
      quoted: m
    }
  )
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
  const cmd =
    String(command || '')
      .toLowerCase()

  const query =
    String(text || '').trim()

  if (!query) {
    return m.reply(
      `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚡ *Usa:*\n` +
      `┃ ${usedPrefix}play nome canzone\n` +
      `┃\n` +
      `┃ 🎵 ${usedPrefix}playaud nome canzone\n` +
      `┃ 🎬 ${usedPrefix}playvid nome canzone\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  let inputFile = null
  let outputFile = null

  try {
    const video =
      await searchYoutube(query)

    if (cmd === 'play') {
      return sendMenu(
        conn,
        m,
        video,
        usedPrefix
      )
    }

    await react(
      conn,
      m,
      '📥'
    )

    const mode =
      cmd === 'playaud'
        ? 'audio'
        : 'video'

    const result =
      await getDownload(
        video.url,
        mode
      )

    const buffer =
      await downloadBuffer(
        result.url
      )

    if (cmd === 'playvid') {
      if (
        buffer.length >
        MAX_VIDEO
      ) {
        throw new Error(
          'Video troppo grande.'
        )
      }

      await conn.sendMessage(
        m.chat,
        {
          video: buffer,
          mimetype:
            'video/mp4',
          fileName:
            `${clean(video.title)}.mp4`,
          caption:
            `╭━━━〔 🎬 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
            `┃\n` +
            `┃ 🎵 *${video.title}*\n` +
            `┃ ⏱️ *${video.duration || 'N/D'}*\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        },
        {
          quoted: m
        }
      )

      await react(
        conn,
        m,
        '✅'
      )

      return
    }

    inputFile = path.join(
      os.tmpdir(),
      `niggabot-${Date.now()}-input`
    )

    outputFile = path.join(
      os.tmpdir(),
      `niggabot-${Date.now()}-output.mp3`
    )

    fs.writeFileSync(
      inputFile,
      buffer
    )

    const audio =
      await convertMp3(
        inputFile,
        outputFile
      )

    await conn.sendMessage(
      m.chat,
      {
        audio,
        mimetype:
          'audio/mpeg',
        fileName:
          `${clean(video.title)}.mp3`,
        ptt: false
      },
      {
        quoted: m
      }
    )

    await react(
      conn,
      m,
      '✅'
    )
  } catch (error) {
    console.error(
      '[NIGGA-BOT PLAY]',
      error
    )

    await react(
      conn,
      m,
      '❌'
    )

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
        inputFile &&
        fs.existsSync(inputFile)
      ) {
        fs.unlinkSync(
          inputFile
        )
      }
    } catch {}

    try {
      if (
        outputFile &&
        fs.existsSync(outputFile)
      ) {
        fs.unlinkSync(
          outputFile
        )
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

