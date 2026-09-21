import yts from 'yt-search'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const TIMEOUT = 25000

const clean = value =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

function isYoutubeUrl(value) {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(value)
}

function getVideoId(url) {
  try {
    const u = new URL(url)

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '').trim()
    }

    return u.searchParams.get('v') || null
  } catch {
    return null
  }
}

function safeFileName(value, extension) {
  const name = clean(value)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/[. ]+$/g, '')
    .slice(0, 120)

  return `${name || 'NIGGA-BOT'}.${extension}`
}

async function fetchJson(url, options = {}, timeout = TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'User-Agent': 'Mozilla/5.0',
        ...(options.headers || {})
      }
    })

    const text = await response.text()

    let data = null

    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}${text ? `: ${text.slice(0, 300)}` : ''}`
      )
    }

    return {
      response,
      data,
      text
    }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchBuffer(url, timeout = TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: '*/*',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const contentLength = Number(
      response.headers.get('content-length') || 0
    )

    if (contentLength > MAX_FILE_SIZE) {
      throw new Error('File troppo grande')
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!buffer.length) {
      throw new Error('File vuoto')
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('File troppo grande')
    }

    return {
      buffer,
      contentType:
        response.headers.get('content-type') ||
        'application/octet-stream'
    }
  } finally {
    clearTimeout(timer)
  }
}

function findUrlDeep(value, wanted = 'video') {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    if (!/^https?:\/\//i.test(value)) {
      return null
    }

    const lower = value.toLowerCase()

    if (
      wanted === 'audio' &&
      (
        lower.includes('.mp3') ||
        lower.includes('.m4a') ||
        lower.includes('.aac') ||
        lower.includes('.ogg') ||
        lower.includes('audio')
      )
    ) {
      return value
    }

    if (
      wanted === 'video' &&
      (
        lower.includes('.mp4') ||
        lower.includes('.webm') ||
        lower.includes('.mkv') ||
        lower.includes('video')
      )
    ) {
      return value
    }

    return null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findUrlDeep(item, wanted)

      if (result) {
        return result
      }
    }

    return null
  }

  if (typeof value === 'object') {
    const priority = wanted === 'audio'
      ? [
          'audioUrl',
          'audio_url',
          'mp3',
          'mp3Url',
          'downloadUrl',
          'download_url',
          'url'
        ]
      : [
          'videoUrl',
          'video_url',
          'mp4',
          'mp4Url',
          'downloadUrl',
          'download_url',
          'url'
        ]

    for (const key of priority) {
      if (value[key]) {
        const result = findUrlDeep(value[key], wanted)

        if (result) {
          return result
        }
      }
    }

    for (const key of Object.keys(value)) {
      const result = findUrlDeep(value[key], wanted)

      if (result) {
        return result
      }
    }
  }

  return null
}

async function providerAllDl(url, type) {
  const endpoint =
    `https://ahm7xmakki.com/api/alldl?url=${encodeURIComponent(url)}`

  const result = await fetchJson(endpoint)

  if (!result.data) {
    throw new Error('Risposta non JSON')
  }

  const wanted = type === 'audio'
    ? 'audio'
    : 'video'

  const downloadUrl = findUrlDeep(result.data, wanted)

  if (!downloadUrl) {
    throw new Error('Nessun link multimediale')
  }

  return {
    url: downloadUrl,
    provider: 'AllDL'
  }
}

async function providerOldYoutubeApi(url, type) {
  const base =
    'https://youtube-download-api.matheusishiyama.repl.co'

  const endpoint =
    `${base}/${type === 'audio' ? 'mp3' : 'mp4'}/?url=${encodeURIComponent(url)}`

  const response = await fetch(endpoint, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const contentType =
    response.headers.get('content-type') || ''

  if (
    contentType.includes('audio') ||
    contentType.includes('video') ||
    contentType.includes('octet-stream')
  ) {
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!buffer.length) {
      throw new Error('File vuoto')
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('File troppo grande')
    }

    return {
      buffer,
      contentType,
      provider: 'YouTube Download API'
    }
  }

  const text = await response.text()

  let data = null

  try {
    data = JSON.parse(text)
  } catch {}

  const downloadUrl =
    findUrlDeep(data, type === 'audio' ? 'audio' : 'video') ||
    (
      /^https?:\/\//i.test(text.trim())
        ? text.trim()
        : null
    )

  if (!downloadUrl) {
    throw new Error('Nessun download disponibile')
  }

  return {
    url: downloadUrl,
    provider: 'YouTube Download API'
  }
}

async function providerNajemi(url, type) {
  const endpoint =
    `https://najemi.cz/ytdl/handler.php?url=${encodeURIComponent(url)}`

  const response = await fetch(endpoint, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const contentType =
    response.headers.get('content-type') || ''

  if (
    contentType.includes('audio') ||
    contentType.includes('video') ||
    contentType.includes('octet-stream')
  ) {
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (!buffer.length) {
      throw new Error('File vuoto')
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('File troppo grande')
    }

    return {
      buffer,
      contentType,
      provider: 'Najemi'
    }
  }

  const text = await response.text()

  let data = null

  try {
    data = JSON.parse(text)
  } catch {}

  const downloadUrl =
    findUrlDeep(data, type === 'audio' ? 'audio' : 'video') ||
    (
      /^https?:\/\//i.test(text.trim())
        ? text.trim()
        : null
    )

  if (!downloadUrl) {
    throw new Error('Link non trovato')
  }

  return {
    url: downloadUrl,
    provider: 'Najemi'
  }
}

async function resolveProvider(url, type) {
  const providers = [
    {
      name: 'AllDL',
      run: () => providerAllDl(url, type)
    },
    {
      name: 'YouTube Download API',
      run: () => providerOldYoutubeApi(url, type)
    },
    {
      name: 'Najemi',
      run: () => providerNajemi(url, type)
    }
  ]

  const errors = []

  for (const provider of providers) {
    try {
      const result = await provider.run()

      if (result?.url || result?.buffer) {
        return result
      }
    } catch (error) {
      errors.push(
        `${provider.name}: ${error?.message || 'errore'}`
      )
    }

    await sleep(250)
  }

  throw new Error(
    `Nessun provider disponibile.\n${errors.join('\n')}`
  )
}

async function materializeDownload(result) {
  if (result.buffer) {
    return result
  }

  if (!result.url) {
    throw new Error('Download URL mancante')
  }

  return {
    ...(await fetchBuffer(result.url)),
    provider: result.provider
  }
}

async function searchYoutube(query) {
  const search = await yts(query)
  const video = search.videos?.[0]

  if (!video) {
    throw new Error('Nessun risultato YouTube trovato')
  }

  return {
    url: video.url,
    title: clean(video.title || 'YouTube'),
    duration: clean(video.timestamp || ''),
    thumbnail: video.thumbnail || null,
    author: clean(video.author?.name || ''),
    views: video.views || 0
  }
}

async function resolveInput(text) {
  const value = clean(text)

  if (isYoutubeUrl(value)) {
    let metadata = {
      url: value,
      title: 'YouTube',
      duration: '',
      thumbnail: null,
      author: '',
      views: 0
    }

    try {
      const search = await yts(value)

      const video =
        search.videos?.find(item => item.url === value) ||
        search.videos?.[0]

      if (video) {
        metadata = {
          url: value,
          title: clean(video.title || 'YouTube'),
          duration: clean(video.timestamp || ''),
          thumbnail: video.thumbnail || null,
          author: clean(video.author?.name || ''),
          views: video.views || 0
        }
      }
    } catch {}

    return metadata
  }

  return searchYoutube(value)
}

async function sendMenu(conn, m, data, usedPrefix) {
  const caption =
    `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
    `┃\n` +
    `┃ 🎵 *${data.title}*\n` +
    `┃\n` +
    `┃ 👤 ${data.author || 'Sconosciuto'}\n` +
    `┃ ⏱️ ${data.duration || 'Sconosciuta'}\n` +
    `┃ 👁️ ${data.views ? Number(data.views).toLocaleString('it-IT') : 'N/D'}\n` +
    `┃\n` +
    `┃ 🎧 *Scegli il formato:*\n` +
    `┃\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`

  const buttons = [
    {
      buttonId: `${usedPrefix}playaud ${data.url}`,
      buttonText: {
        displayText: '🎵 MP3 AUDIO'
      },
      type: 1
    },
    {
      buttonId: `${usedPrefix}playvid ${data.url}`,
      buttonText: {
        displayText: '🎬 MP4 VIDEO'
      },
      type: 1
    }
  ]

  if (data.thumbnail) {
    return conn.sendMessage(
      m.chat,
      {
        image: {
          url: data.thumbnail
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

async function sendDownload(conn, m, data, type) {
  const result = await resolveProvider(data.url, type)
  const media = await materializeDownload(result)

  if (type === 'audio') {
    return conn.sendMessage(
      m.chat,
      {
        audio: media.buffer,
        mimetype: 'audio/mpeg',
        fileName: safeFileName(data.title, 'mp3'),
        ptt: false
      },
      {
        quoted: m
      }
    )
  }

  return conn.sendMessage(
    m.chat,
    {
      video: media.buffer,
      mimetype: 'video/mp4',
      fileName: safeFileName(data.title, 'mp4'),
      caption:
        `╭━━━〔 🎬 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
        `┃\n` +
        `┃ ✅ *Download completato*\n` +
        `┃\n` +
        `┃ 🎵 ${data.title}\n` +
        `┃ ⏱️ ${data.duration || 'N/D'}\n` +
        `┃ 🌐 ${media.provider || 'Provider'}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    },
    {
      quoted: m
    }
  )
}

const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  const cmd = clean(command).toLowerCase()

  if (!text) {
    return m.reply(
      `╭━━━〔 🎧 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ❌ Inserisci una canzone o un link YouTube.\n` +
      `┃\n` +
      `┃ 💡 ${usedPrefix}play nome canzone\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  try {
    const data = await resolveInput(text)

    if (cmd === 'play') {
      return sendMenu(
        conn,
        m,
        data,
        usedPrefix
      )
    }

    await conn.sendMessage(
      m.chat,
      {
        react: {
          text: '📥',
          key: m.key
        }
      }
    )

    if (cmd === 'playaud') {
      await sendDownload(
        conn,
        m,
        data,
        'audio'
      )
    } else if (cmd === 'playvid') {
      await sendDownload(
        conn,
        m,
        data,
        'video'
      )
    } else {
      throw new Error('Comando non supportato')
    }

    await conn.sendMessage(
      m.chat,
      {
        react: {
          text: '✅',
          key: m.key
        }
      }
    )
  } catch (error) {
    console.error(
      '[NIGGA-BOT PLAY]',
      error?.stack || error
    )

    await conn.sendMessage(
      m.chat,
      {
        react: {
          text: '❌',
          key: m.key
        }
      }
    )

    return m.reply(
      `╭━━━〔 ❌ 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚠️ *Download fallito*\n` +
      `┃\n` +
      `┃ ${clean(error?.message || 'Errore sconosciuto')}\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
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