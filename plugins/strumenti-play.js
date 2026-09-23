const clean = value => String(value || '').replace(/\s+/g, ' ').trim()

function isYoutubeUrl(value) {
  try {
    const url = new URL(value)
    return [
      'youtube.com', 'www.youtube.com', 'm.youtube.com', 
      'music.youtube.com', 'youtu.be', 'www.youtu.be'
    ].includes(url.hostname)
  } catch {
    return false
  }
}

async function searchYouTube(query) {
  const apis = [
    async () => {
      const res = await fetch(`https://delirius-api-oficial.vercel.app/search/youtube?q=${encodeURIComponent(query)}`)
      const json = await res.json()
      if (json?.status && json?.data?.length > 0) {
        const v = json.data[0]
        return {
          url: v.url,
          title: clean(v.title || 'YouTube'),
          duration: clean(v.timestamp || v.duration || 'N/D'),
          thumbnail: v.image || v.thumbnail || null,
          author: clean(v.author?.name || v.author || 'N/D'),
          views: v.views || 0
        }
      }
      throw new Error()
    },
    async () => {
      const res = await fetch(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`)
      const json = await res.json()
      if (json?.data?.length > 0) {
        const v = json.data[0]
        return {
          url: v.url,
          title: clean(v.title || 'YouTube'),
          duration: clean(v.duration || 'N/D'),
          thumbnail: v.thumbnail || null,
          author: clean(v.author || 'N/D'),
          views: v.views || 0
        }
      }
      throw new Error()
    },
    async () => {
      const res = await fetch(`https://widipe.com/download/ytsearch?text=${encodeURIComponent(query)}`)
      const json = await res.json()
      if (json?.result?.length > 0) {
        const v = json.result[0]
        return {
          url: v.url,
          title: clean(v.title || 'YouTube'),
          duration: clean(v.timestamp || 'N/D'),
          thumbnail: v.thumbnail || null,
          author: clean(v.author || 'N/D'),
          views: v.views || 0
        }
      }
      throw new Error()
    }
  ]

  for (const api of apis) {
    try {
      const result = await api()
      if (result) return result
    } catch {}
  }

  throw new Error('Nessun risultato trovato.')
}

async function downloadMedia(url, type) {
  const apis = [
    async () => {
      const res = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
          url: url,
          audioFormat: type === 'audio' ? 'mp3' : 'best',
          videoQuality: '720'
        })
      })
      const json = await res.json()
      const dlUrl = json?.url || json?.picker?.[0]?.url
      if (dlUrl) return { url: dlUrl, provider: 'Cobalt' }
      throw new Error()
    },
    async () => {
      const endpoint = type === 'audio'
        ? `https://widipe.com/download/ytmp3?url=${encodeURIComponent(url)}`
        : `https://widipe.com/download/ytmp4?url=${encodeURIComponent(url)}`
      const res = await fetch(endpoint)
      const json = await res.json()
      const dlUrl = json?.result?.url || json?.result?.download || json?.url
      if (dlUrl) return { url: dlUrl, provider: 'Widipe' }
      throw new Error()
    },
    async () => {
      const endpoint = type === 'audio'
        ? `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`
        : `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`
      const res = await fetch(endpoint)
      const json = await res.json()
      const dlUrl = json?.result?.download?.url || json?.result?.url || json?.data?.url
      if (dlUrl) return { url: dlUrl, provider: 'Vreden' }
      throw new Error()
    }
  ]

  for (const api of apis) {
    try {
      const result = await api()
      if (result) return result
    } catch {}
  }

  throw new Error('Impossibile generare il link di download da nessuna API.')
}

async function getBuffer(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  })
  if (!response.ok) throw new Error('Errore nel download del file dal server remoto.')
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const cmd = clean(command).toLowerCase()

  if (!text) {
    return m.reply(
      `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ❌ Inserisci il titolo di una canzone\n` +
      `┃    o un link YouTube valido.\n` +
      `┃\n` +
      `┃ 💡 Esempio:\n` +
      `┃ • ${usedPrefix}play un milione di notti\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let videoData

    if (isYoutubeUrl(text)) {
      videoData = {
        url: text,
        title: 'Media YouTube',
        duration: '',
        thumbnail: null,
        author: '',
        views: 0
      }
    } else {
      videoData = await searchYouTube(text)
    }

    if (cmd === 'play') {
      const caption =
        `╭━━━〔 🎧 𝑩𝑶𝑻 〕━━━╮\n` +
        `┃\n` +
        `┃ 🎵 *${videoData.title}*\n` +
        `┃\n` +
        `┃ 👤 ${videoData.author || 'Sconosciuto'}\n` +
        `┃ ⏱️ ${videoData.duration || 'N/D'}\n` +
        `┃ 👁️ ${videoData.views ? Number(videoData.views).toLocaleString('it-IT') : 'N/D'}\n` +
        `┃\n` +
        `┃ 🎧 *Scegli il formato:* \n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯`

      const buttons = [
        {
          buttonId: `${usedPrefix}playaud ${videoData.url}`,
          buttonText: { displayText: '🎵 MP3 AUDIO' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}playvid ${videoData.url}`,
          buttonText: { displayText: '🎬 MP4 VIDEO' },
          type: 1
        }
      ]

      if (videoData.thumbnail) {
        await conn.sendMessage(m.chat, {
          image: { url: videoData.thumbnail },
          caption,
          footer: '𝑩𝑶𝑻',
          buttons,
          headerType: 4
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          text: caption,
          footer: '𝑩𝑶𝑻',
          buttons,
          headerType: 1
        }, { quoted: m })
      }

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    const type = cmd === 'playaud' ? 'audio' : 'video'

    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })

    const mediaInfo = await downloadMedia(videoData.url, type)
    const buffer = await getBuffer(mediaInfo.url)

    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${clean(videoData.title || 'audio')}.mp3`,
        ptt: false
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: buffer,
        mimetype: 'video/mp4',
        fileName: `${clean(videoData.title || 'video')}.mp4`,
        caption: `╭━━━〔 🎬 𝑩𝑶𝑻 〕━━━╮\n` +
                 `┃\n` +
                 `┃ ✅ *Download completato*\n` +
                 `┃\n` +
                 `┃ 🎵 ${videoData.title}\n` +
                 `┃ 🌐 ${mediaInfo.provider}\n` +
                 `┃\n` +
                 `╰━━━━━━━━━━━━━━━━━━━━━━╯`
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('[PLAY PLUGIN ERROR]', error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply(
      `╭━━━〔 ❌ 𝑩𝑶𝑻 〕━━━╮\n` +
      `┃\n` +
      `┃ ⚠️ *Errore durante l'operazione*\n` +
      `┃ ${error.message || 'Errore sconosciuto'}\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━╯`
    )
  }
}

handler.help = ['play', 'playaud', 'playvid']
handler.tags = ['downloader']
handler.command = /^(play|playaud|playvid)$/i
handler.group = true

export default handler
