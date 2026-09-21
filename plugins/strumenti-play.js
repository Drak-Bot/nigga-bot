import yts from 'yt-search'

const MAX_FILE_SIZE = 100 * 1024 * 1024
const SEARCH_TIMEOUT = 15000
const PROVIDER_TIMEOUT = 30000
const DOWNLOAD_TIMEOUT = 45000
const RETRIES = 2
const RETRY_DELAY = 700

const clean = value =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

function timeoutSignal(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)

  return {
    controller,
    clear: () => clearTimeout(timer)
  }
}

function isYoutubeUrl(value) {
  try {
    const url = new URL(value)

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    ) && (
      url.hostname === 'youtube.com' ||
      url.hostname === 'www.youtube.com' ||
      url.hostname === 'm.youtube.com' ||
      url.hostname === 'music.youtube.com' ||
      url.hostname === 'youtu.be' ||
      url.hostname === 'www.youtu.be'
    )
  } catch {
    return false
  }
}

function getVideoId(value) {
  try {
    const url = new URL(value)

    if (
      url.hostname === 'youtu.be' ||
      url.hostname === 'www.youtu.be'
    ) {
      return url.pathname
        .split('/')
        .filter(Boolean)[0] || null
    }

    if (
      url.pathname === '/watch' ||
      url.pathname === '/shorts/' ||
      url.pathname === '/embed/'
    ) {
      const queryId = url.searchParams.get('v')

      if (queryId) {
        return queryId
      }

      const parts = url.pathname
        .split('/')
        .filter(Boolean)

      if (parts.length >= 2) {
        return parts[1]
      }
    }

    return null
  } catch {
    return null
  }
}

function normalizeYoutubeUrl(value) {
  const id = getVideoId(value)

  if (!id) {
    return value
  }

  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`
}

function safeFileName(value, extension) {
  const name = clean(value)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/[. ]+$/g, '')
    .slice(0, 120)

  return `${name || 'youtube-download'}.${extension}`
}

function looksLikeMediaUrl(value, type) {
  if (
    typeof value !== 'string' ||
    !/^https?:\/\//i.test(value)
  ) {
    return false
  }

  const lower = value.toLowerCase()

  if (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be')
  ) {
    return false
  }

  if (type === 'audio') {
    return (
      lower.includes('.mp3') ||
      lower.includes('.m4a') ||
      lower.includes('.aac') ||
      lower.includes('.ogg') ||
      lower.includes('.opus') ||
      lower.includes('audio') ||
      lower.includes('download')
    )
  }

  return (
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mkv') ||
    lower.includes('video') ||
    lower.includes('download')
  )
}

function findMediaUrl(value, type, depth = 0) {
  if (!value || depth > 8) {
    return null
  }

  if (typeof value === 'string') {
    return looksLikeMediaUrl(value, type)
      ? value
      : null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findMediaUrl(
        item,
        type,
        depth + 1
      )

      if (found) {
        return found
      }
    }

    return null
  }

  if (typeof value !== 'object') {
    return null
  }

  const audioKeys = [
    'audioUrl',
    'audio_url',
    'audio',
    'mp3',
    'mp3Url',
    'mp3_url',
    'm4a',
    'downloadUrl',
    'download_url',
    'url',
    'link'
  ]

  const videoKeys = [
    'videoUrl',
    'video_url',
    'video',
    'mp4',
    'mp4Url',
    'mp4_url',
    'downloadUrl',
    'download_url',
    'url',
    'link'
  ]

  const keys = type === 'audio'
    ? audioKeys
    : videoKeys

  for (const key of keys) {
    if (!value[key]) {
      continue
    }

    const found = findMediaUrl(
      value[key],
      type,
      depth + 1
    )

    if (found) {
      return found
    }
  }

  for (const key of Object.keys(value)) {
    const found = findMediaUrl(
      value[key],
      type,
      depth + 1
    )

    if (found) {
      return found
    }
  }

  return null
}

async function requestJson(
  url,
  options = {},
  timeout = PROVIDER_TIMEOUT
) {
  const signal = timeoutSignal(timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: signal.controller.signal,
      redirect: 'follow',
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        ...(options.headers || {})
      }
    })

    const text = await response.text()

    let data = null

    try {
      data = JSON.parse(text)
    } catch {}

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}${text
          ? `: ${text.slice(0, 250)}`
          : ''}`
      )
    }

    return {
      response,
      text,
      data
    }
  } finally {
    signal.clear()
  }
}

async function requestBuffer(
  url,
  timeout = DOWNLOAD_TIMEOUT
) {
  const signal = timeoutSignal(timeout)

  try {
    const response = await fetch(url, {
      signal: signal.controller.signal,
      redirect: 'follow',
      headers: {
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const contentType =
      response.headers.get('content-type') || ''

    const contentLength = Number(
      response.headers.get('content-length') || 0
    )

    if (
      contentLength &&
      contentLength > MAX_FILE_SIZE
    ) {
      throw new Error(
        'File superiore a 100 MB'
      )
    }

    const arrayBuffer =
      await response.arrayBuffer()

    const buffer =
      Buffer.from(arrayBuffer)

    if (!buffer.length) {
      throw new Error(
        'Il provider ha restituito un file vuoto'
      )
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(
        'File superiore a 100 MB'
      )
    }

    return {
      buffer,
      contentType:
        contentType || 'application/octet-stream'
    }
  } finally {
    signal.clear()
  }
}

async function retry(fn, attempts = RETRIES) {
  let lastError = null

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (i < attempts - 1) {
        await sleep(
          RETRY_DELAY * (i + 1)
        )
      }
    }
  }

  throw lastError ||
    new Error('Operazione fallita')
}

async function searchYoutube(query) {
  const result = await Promise.race([
    yts(query),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(
          new Error(
            'Ricerca YouTube scaduta'
          )
        ),
        SEARCH_TIMEOUT
      )
    )
  ])

  const videos =
    Array.isArray(result?.videos)
      ? result.videos
      : []

  if (!videos.length) {
    throw new Error(
      'Nessun risultato YouTube trovato'
    )
  }

  const video = videos.find(
    item => item?.url
  )

  if (!video) {
    throw new Error(
      'Risultato YouTube non valido'
    )
  }

  return {
    url: normalizeYoutubeUrl(video.url),
    title: clean(
      video.title || 'YouTube'
    ),
    duration: clean(
      video.timestamp || ''
    ),
    thumbnail:
      video.thumbnail || null,
    author: clean(
      video.author?.name || ''
    ),
    views: Number(video.views || 0)
  }
}

async function getYoutubeMetadata(url) {
  try {
    const result = await retry(
      () => yts(url),
      1
    )

    const videos =
      Array.isArray(result?.videos)
        ? result.videos
        : []

    const id = getVideoId(url)

    const video =
      videos.find(
        item =>
          id &&
          getVideoId(item.url) === id
      ) ||
      videos[0]

    if (!video) {
      return {
        url: normalizeYoutubeUrl(url),
        title: 'YouTube',
        duration: '',
        thumbnail: null,
        author: '',
        views: 0
      }
    }

    return {
      url: normalizeYoutubeUrl(url),
      title: clean(
        video.title || 'YouTube'
      ),
      duration: clean(
        video.timestamp || ''
      ),
      thumbnail:
        video.thumbnail || null,
      author: clean(
        video.author?.name || ''
      ),
      views: Number(video.views || 0)
    }
  } catch {
    return {
      url: normalizeYoutubeUrl(url),
      title: 'YouTube',
      duration: '',
      thumbnail: null,
      author: '',
      views: 0
    }
  }
}

async function resolveInput(input) {
  const value = clean(input)

  if (!value) {
    throw new Error(
      'Inserisci un nome o un link YouTube'
    )
  }

  if (isYoutubeUrl(value)) {
    return getYoutubeMetadata(value)
  }

  return searchYoutube(value)
}

async function providerAllDl(url, type) {
  const endpoint =
    `https://ahm7xmakki.com/api/alldl?url=${encodeURIComponent(
      url
    )}`

  const result = await requestJson(
    endpoint
  )

  if (!result.data) {
    throw new Error(
      'Risposta provider non valida'
    )
  }

  const mediaUrl =
    findMediaUrl(
      result.data,
      type
    )

  if (!mediaUrl) {
    throw new Error(
      'Nessun file multimediale trovato'
    )
  }

  return {
    url: mediaUrl,
    provider: 'AllDL'
  }
}

async function providerNajemi(url, type) {
  const endpoint =
    `https://najemi.cz/ytdl/handler.php?url=${encodeURIComponent(
      url
    )}`

  const result = await requestJson(
    endpoint
  )

  const mediaUrl =
    findMediaUrl(
      result.data,
      type
    ) ||
    findMediaUrl(
      result.text,
      type
    )

  if (!mediaUrl) {
    throw new Error(
      'Nessun file trovato'
    )
  }

  return {
    url: mediaUrl,
    provider: 'Najemi'
  }
}

async function providerLoader(url, type) {
  const endpoint =
    `https://loader.to/api/button/?url=${encodeURIComponent(
      url
    )}&f=${
      type === 'audio'
        ? 'mp3'
        : 'mp4'
    }`

  const result = await requestJson(
    endpoint
  )

  const mediaUrl =
    findMediaUrl(
      result.data,
      type
    )

  if (!mediaUrl) {
    throw new Error(
      'Loader non ha restituito un download'
    )
  }

  return {
    url: mediaUrl,
    provider: 'Loader'
  }
}

async function providerCobalt(url, type) {
  const endpoints = [
    'https://api.cobalt.tools/',
    'https://cobalt-api.kwiatekmiki.com/'
  ]

  let lastError = null

  for (const endpoint of endpoints) {
    try {
      const payload = {
        url,
        downloadMode:
          type === 'audio'
            ? 'audio'
            : 'auto',
        audioFormat: 'mp3',
        filenameStyle: 'pretty'
      }

      const result =
        await requestJson(
          endpoint,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify(payload)
          }
        )

      const mediaUrl =
        findMediaUrl(
          result.data,
          type
        )

      if (!mediaUrl) {
        throw new Error(
          'Cobalt non ha restituito un URL'
        )
      }

      return {
        url: mediaUrl,
        provider: 'Cobalt'
      }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ||
    new Error(
      'Cobalt non disponibile'
    )
}

const providers = [
  {
    name: 'Cobalt',
    run: providerCobalt
  },
  {
    name: 'AllDL',
    run: providerAllDl
  },
  {
    name: 'Najemi',
    run: providerNajemi
  },
  {
    name: 'Loader',
    run: providerLoader
  }
]

async function resolveProvider(
  youtubeUrl,
  type
) {
  const errors = []

  for (const provider of providers) {
    try {
      const result =
        await provider.run(
          youtubeUrl,
          type
        )

      if (!result?.url) {
        throw new Error(
          'URL download mancante'
        )
      }

      const media =
        await retry(
          () =>
            requestBuffer(
              result.url
            ),
          2
        )

      if (
        !media?.buffer ||
        !media.buffer.length
      ) {
        throw new Error(
          'File non valido'
        )
      }

      return {
        ...media,
        provider:
          result.provider ||
          provider.name
      }
    } catch (error) {
      errors.push(
        `${provider.name}: ${
          clean(
            error?.message ||
            'errore sconosciuto'
          )
        }`
      )

      await sleep(400)
    }
  }

  throw new Error(
    [
      'Nessun provider disponibile.',
      ...errors
    ].join('\n')
  )
}

function isAudioContentType(type) {
  const value =
    String(type || '').toLowerCase()

  return (
    value.includes('audio/') ||
    value.includes('mpeg') ||
    value.includes('mp4')
  )
}

function isVideoContentType(type) {
  const value =
    String(type || '').toLowerCase()

  return (
    value.includes('video/') ||
    value.includes('mp4') ||
    value.includes('webm')
  )
}

async function sendAudio(
  conn,
  m,
  data,
  media
) {
  return conn.sendMessage(
    m.chat,
    {
      audio: media.buffer,
      mimetype:
        isAudioContentType(
          media.contentType
        )
          ? media.contentType
          : 'audio/mpeg',
      fileName:
        safeFileName(
          data.title,
          'mp3'
        ),
      ptt: false
    },
    {
      quoted: m
    }
  )
}

async function sendVideo(
  conn,
  m,
  data,
  media
) {
  return conn.sendMessage(
    m.chat,
    {
      video: media.buffer,
      mimetype:
        isVideoContentType(
          media.contentType
        )
          ? media.contentType
          : 'video/mp4',
      fileName:
        safeFileName(
          data.title,
          'mp4'
        ),
      caption:
        `╭━━━〔 🎬 𝑩𝑶𝑻 〕━━━╮\n` +
        `┃\n` +
        `┃ ✅ *Download completato*\n` +
        `┃\n` +
        `┃ 🎵 ${data.title}\n` +
        `┃ ⏱️ ${data.duration || 'N/D'}\n` +
        `┃ 👤 ${data.author || 'N/D'}\n` +
        `┃ 🌐 ${media.provider || 'Provider'}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    },
    {
      quoted: m
    }
  )
}

async function sendMenu(
  conn,
  m,
  data,
  usedPrefix
) {
  const caption =
    `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
    `┃\n` +
    `┃ 🎵 *${data.title}*\n` +
    `┃\n` +
    `┃ 👤 ${data.author || 'Sconosciuto'}\n` +
    `┃ ⏱️ ${data.duration || 'Sconosciuta'}\n` +
    `┃ 👁️ ${
      data.views
        ? Number(
            data.views
          ).toLocaleString(
            'it-IT'
          )
        : 'N/D'
    }\n` +
    `┃\n` +
    `┃ 🎧 *Scegli il formato:*\n` +
    `┃\n` +
    `╰━━━━━━━━━━━━━━━━━━━━━━╯`

  const buttons = [
    {
      buttonId:
        `${usedPrefix}playaud ${data.url}`,
      buttonText: {
        displayText:
          '🎵 MP3 AUDIO'
      },
      type: 1
    },
    {
      buttonId:
        `${usedPrefix}playvid ${data.url}`,
      buttonText: {
        displayText:
          '🎬 MP4 VIDEO'
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
        footer: '𝑩𝑶𝑻',
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
      footer: '𝑩𝑶𝑻',
      buttons,
      headerType: 1
    },
    {
      quoted: m
    }
  )
}

async function sendProgress(
  conn,
  m,
  emoji
) {
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

async function downloadMedia(
  conn,
  m,
  data,
  type
) {
  await sendProgress(
    conn,
    m,
    '📥'
  )

  const media =
    await resolveProvider(
      data.url,
      type
    )

  if (type === 'audio') {
    await sendAudio(
      conn,
      m,
      data,
      media
    )
  } else {
    await sendVideo(
      conn,
      m,
      data,
      media
    )
  }

  await sendProgress(
    conn,
    m,
    '✅'
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
    clean(command).toLowerCase()

  if (!text) {
    return m.reply(
      `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ❌ Inserisci una canzone\n` +
      `┃    o un link YouTube.\n` +
      `┃\n` +
      `┃ 💡 ${usedPrefix}play nome canzone\n` +
      `┃\n` +
      `┃ 🔗 ${usedPrefix}play https://youtu.be/...\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  try {
    const data =
      await resolveInput(text)

    if (cmd === 'play') {
      return sendMenu(
        conn,
        m,
        data,
        usedPrefix
      )
    }

    if (
      cmd !== 'playaud' &&
      cmd !== 'playvid'
    ) {
      throw new Error(
        'Comando non supportato'
      )
    }

    const type =
      cmd === 'playaud'
        ? 'audio'
        : 'video'

    await downloadMedia(
      conn,
      m,
      data,
      type
    )
  } catch (error) {
    console.error(
      '[PLAY]',
      error?.stack || error
    )

    await sendProgress(
      conn,
      m,
      '❌'
    )

    const message =
      clean(
        error?.message ||
        'Errore sconosciuto'
      )

    return m.reply(
      `╭━━━〔 ❌ 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚠️ *Download fallito*\n` +
      `┃\n` +
      `┃ ${message}\n` +
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

