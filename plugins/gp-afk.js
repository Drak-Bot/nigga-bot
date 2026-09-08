const handler = async (m, { conn }) => {
    const text = (m.text || '').replace(/^\.afk\s*/i, '').trim()

    const afkUsers = global.afkUsers || (global.afkUsers = new Map())

    const sender = conn.decodeJid(m.sender)
    const chatId = conn.decodeJid(m.chat)
    const key = `${chatId}:${sender}`

    const reason = text || 'Nessun motivo specificato'

    afkUsers.set(key, {
        reason,
        time: Date.now()
    })

    try {
        await conn.sendMessage(m.chat, {
            text:
                `💤 *AFK ATTIVATO*\n\n` +
                `👤 @${sender.split('@')[0]}\n` +
                `📝 *Motivo:* ${reason}`,
            mentions: [sender]
        }, { quoted: m })
    } catch (e) {
        console.error('[AFK SEND ERROR]', e)
    }
}

handler.before = async function (m, { conn }) {
    if (!m.isGroup || m.fromMe) return

    const afkUsers = global.afkUsers || (global.afkUsers = new Map())

    const sender = conn.decodeJid(m.sender)
    const chatId = conn.decodeJid(m.chat)
    const key = `${chatId}:${sender}`

    if (!afkUsers.has(key)) return

    const messageText = m.text || ''

    if (/^\.afk(?:\s|$)/i.test(messageText)) return

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

    try {
        await conn.sendMessage(m.chat, {
            text:
                `👋 @${sender.split('@')[0]} non è più AFK!\n\n` +
                `💤 *Tempo AFK:* ${duration}\n` +
                `📝 *Motivo:* ${afk.reason}`,
            mentions: [sender]
        })
    } catch (e) {
        console.error('[AFK RETURN ERROR]', e)
    }
}

handler.help = ['afk', 'afk <motivo>']
handler.tags = ['gruppo']
handler.command = /^afk$/i
handler.group = true

export default handler