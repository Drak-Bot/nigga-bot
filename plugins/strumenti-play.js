import yts from 'yt-search'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const execFileAsync = promisify(execFile)

const MAX_FILE_SIZE = 100 * 1024 * 1024
const TIMEOUT = 25000

const clean = value =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()

const isYoutubeUrl = value =>
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(value)

const safeFileName = (value, extension) => {
  const name = clean(value)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/[. ]+$/g, '')
    .slice(0, 120)

  return `${name || 'youtube'}.${extension}`
}

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

async function fileSize(file) {
  const stat = await fs.stat(file)
  return stat.size
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

  if (!value) {
    throw new Error('Inserisci una ricerca o un link YouTube')
  }

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

async function runYtDlp(args) {
  try {
    return await execFileAsync(
      'yt-dlp',
      args,
      {
        timeout: TIMEOUT,
        maxBuffer: 10 * 1024 * 1024
      }
    )
  } catch (error) {
    const stderr = clean(error?.stderr)
    const stdout = clean(error?.stdout)

    throw new Error(
      stderr ||
      stdout ||
      error?.message ||
      'yt-dlp ha restituito un errore'
    )
  }
}

async function downloadAudio(url, outputDir) {
  const outputTemplate =
    path.join(outputDir, 'audio.%(ext)s')

  /*
   * Estrae l'audio senza appoggiarsi a servizi esterni.
   *
   * Richiede ffmpeg per convertire in MP3.
   */
  await runYtDlp([
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '--extract-audio',
    '--audio-format',
    'mp3',
    '--audio-quality',
    '128K',
    '-o',
    outputTemplate,
    url
  ])

  const files = await fs.readdir(outputDir)

  const audioFile = files.find(file =>
    /^audio\.(mp3|m4a|opus|webm|aac)$/i.test(file)
  )

  if (!audioFile) {
    throw new Error('yt-dlp non ha prodotto un file audio')
  }

  const filePath = path.join(outputDir, audioFile)
  const size = await fileSize(filePath)

  if (size > MAX_FILE_SIZE) {
    throw new Error('File audio troppo grande')
  }

  return {
    filePath,
    size
  }
}

async function downloadVideo(url, outputDir) {
  const outputTemplate =
    path.join(outputDir, 'video.%(ext)s')

  /*
   * Cerca un formato compatibile con WhatsApp.
   * Se possibile prende video + audio e li unisce in MP4.
   */
  await runYtDlp([
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '-f',
    'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best',
    '--merge-output-format',
    'mp4',
    '-o',
    outputTemplate,
    url
  ])

  const files = await fs.readdir(outputDir)

  const videoFile = files.find(file =>
    /^video\.mp4$/i.test(file)
  )

  if (!videoFile) {
    throw new Error('yt-dlp non ha prodotto un file MP4')
  }

  const filePath = path.join(outputDir, videoFile)
  const size = await fileSize(filePath)

  if (size > MAX_FILE_SIZE) {
    throw new Error(
      `Video troppo grande: ${(size / 1024 / 1024).toFixed(1)} MB`
    )
  }

  return {
    filePath,
    size
  }
}

async function sendMenu(conn, m, data, usedPrefix) {
  const caption =
    `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
    `┃\n` +
    `┃ 🎵 *${data.title}*\n` +
    `┃\n` +
    `┃ 👤 ${data.author || 'Sconosciuto'}\n` +
    `┃ ⏱️ ${data.duration || 'Sconosciuta'}\n` +
    `┃ 👁️ ${
      data.views
        ? Number(data.views).toLocaleString('it-IT')
        : 'N/D'
    }\n` +
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
        footer: 'YouTube Downloader',
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
      footer: 'YouTube Downloader',
      buttons,
      headerType: 1
    },
    {
      quoted: m
    }
  )
}

async function sendAudio(conn, m, data) {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'yt-audio-')
  )

  try {
    const result = await downloadAudio(
      data.url,
      tempDir
    )

    const fileName =
      safeFileName(data.title, 'mp3')

    await conn.sendMessage(
      m.chat,
      {
        audio: {
          url: result.filePath
        },
        mimetype: 'audio/mpeg',
        fileName,
        ptt: false
      },
      {
        quoted: m
      }
    )
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true
    })
  }
}

async function sendVideo(conn, m, data) {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'yt-video-')
  )

  try {
    const result = await downloadVideo(
      data.url,
      tempDir
    )

    const fileName =
      safeFileName(data.title, 'mp4')

    await conn.sendMessage(
      m.chat,
      {
        video: {
          url: result.filePath
        },
        mimetype: 'video/mp4',
        fileName,
        caption:
          `╭━━━〔 🎬 𝑩𝑶𝑻 〕━━━╮\n` +
          `┃\n` +
          `┃ ✅ *Download completato*\n` +
          `┃\n` +
          `┃ 🎵 ${data.title}\n` +
          `┃ ⏱️ ${data.duration || 'N/D'}\n` +
          `┃ 📦 ${(result.size / 1024 / 1024).toFixed(1)} MB\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━━╯`
      },
      {
        quoted: m
      }
    )
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true
    })
  }
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
  const cmd = clean(command).toLowerCase()

  if (!text) {
    return m.reply(
      `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ❌ Inserisci una canzone o un link YouTube.\n` +
      `┃\n` +
      `┃ 💡 ${usedPrefix}play nome canzone\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  try {
    /*
     * Per playaud/playvid accettiamo anche direttamente
     * una query, quindi:
     *
     * .playaud nome canzone
     * .playvid nome canzone
     *
     * funzionano senza passare prima da .play.
     */
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
      await sendAudio(
        conn,
        m,
        data
      )
    } else if (cmd === 'playvid') {
      await sendVideo(
        conn,
        m,
        data
      )
    } else {
      throw new Error(
        'Comando non supportato'
      )
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
      '[PLAY ERROR]',
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
      `╭━━━〔 ❌ 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚠️ *Download fallito*\n` +
      `┃\n` +
      `┃ ${clean(
        error?.message ||
        'Errore sconosciuto'
      )}\n` +
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