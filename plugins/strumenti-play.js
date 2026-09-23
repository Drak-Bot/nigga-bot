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
  try {
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
  } catch {}

  try {
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
  } catch {}

  throw new Error('Nessun risultato trovato o servizi di ricerca temporaneamente non disponibili.')
}

async function downloadMedia(url, type) {
  try {
    const endpoint = type === 'audio'
      ? `https://delirius-api-oficial.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      : `https://delirius-api-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`
    
    const res = await fetch(endpoint)
    const json = await res.json()
    const dlUrl = json?.data?.download?.url || json?.data?.link || json?.data?.dl
    if (dlUrl) {
      return { url: dlUrl, title: json?.data?.title || 'media', provider: 'Delirius' }
    }
  } catch {}

  try {
    const res = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        url: url,
        downloadMode: type === 'audio' ? 'audio' : 'auto',
        audioFormat: 'mp3'
      })
    })
    const json = await res.json()
    const dlUrl = json?.url || json?.picker?.[0]?.url
    if (dlUrl) {
      return { url: dlUrl, title: json?.filename || 'media', provider: 'Cobalt' }
    }
  } catch {}

  try {
    const endpoint = type === 'audio'
      ? `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`
      : `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint)
    const json = await res.json()
    const dlUrl = json?.data?.dl || json?.data?.url
    if (dlUrl) {
      return { url: dlUrl, title: json?.data?.title || 'media', provider: 'Siputzx' }
    }
  } catch {}

  throw new Error('Impossibile generare il link di download dai provider disponibili.')
}

async function getBuffer(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Errore HTTP nel download del file: ${response.status}`)
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
      `┃ • ${usedPrefix}playaud [link]\n` +
      `┃ • ${usedPrefix}playvid [link]\n` +
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
        `┃ 📥 *Scarica direttamente:* \n` +
        `┃ 🎵 MP3: \`${usedPrefix}playaud${videoData.url}\`\n` +
        `┃ 🎬 MP4: \`${usedPrefix}playvid${videoData.url}\`\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯`

      if (videoData.thumbnail) {
        await conn.sendMessage(m.chat, { image: { url: videoData.thumbnail }, caption }, { quoted: m })
      } else {
        await m.reply(caption)
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
        caption: `✅ *Download completato*\n🎵 *${videoData.title}*\n🌐 *Provider:* ${mediaInfo.provider}`
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
