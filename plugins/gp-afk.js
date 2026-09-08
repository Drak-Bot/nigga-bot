const handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) return

    const afkUsers = global.afkUsers || (global.afkUsers = new Map())

    const sender = conn.decodeJid(m.sender)
    const chatId = conn.decodeJid(m.chat)
    const key = `${chatId}:${sender}`

    afkUsers.set(key, {
        reason: text.trim(),
        time: Date.now()
    })

    await conn.sendMessage(m.chat, {
        text:
            `💤 *AFK ATTIVATO*\n\n` +
            `👤 @${sender.split('@')[0]}\n` +
            `📝 *Motivo:* ${text.trim()}`,
        mentions: [sender]
    }, { quoted: m })
}

handler.before = async function (m, { conn }) {
    if (!m.isGroup || m.fromMe) return

    const afkUsers = global.afkUsers || (global.afkUsers = new Map())

    const sender = conn.decodeJid(m.sender)
    const chatId = conn.decodeJid(m.chat)
    const key = `${chatId}:${sender}`

    if (!afkUsers.has(key)) return

    const text = m.text || ''

    if (/^\.afk(?:\s|$)/i.test(text)) return

    const afk = afkUsers.get(key)

    const elapsed = Date.now() - afk.time
    const totalSeconds = Math.floor(elapsed / 1000)

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    let duration = ''

    if (days > 0) duration += `${days}g `
    if (hours > 0 || days > 0) duration += `${hours}h `
    if (minutes > 0 || hours > 0 || days > 0) duration += `${minutes}m `
    duration += `${seconds}s`

    afkUsers.delete(key)

    await conn.sendMessage(m.chat, {
        text:
            `👋 @${sender.split('@')[0]} non è più AFK!\n\n` +
            `💤 *Tempo AFK:* ${duration}\n` +
            `📝 *Motivo:* ${afk.reason}`,
        mentions: [sender]
    })
}

handler.help = ['afk <motivo>']
handler.tags = ['gruppo']
handler.command = /^afk$/i
handler.group = true

export default handler