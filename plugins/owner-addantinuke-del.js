const handler = async (m, { conn, isOwner }) => {
    if (!m.isGroup) return
    if (!isOwner) return

    const text = m.text || ''
    const match = text.match(/^\.((?:add|del)antinuke)(?:\s+|$)/i)

    if (!match) return

    const command = match[1].toLowerCase()

    global.db.data.chats[m.chat] =
        global.db.data.chats[m.chat] || {}

    const chat = global.db.data.chats[m.chat]

    if (!Array.isArray(chat.antinukeAdmins)) {
        chat.antinukeAdmins = []
    }

    let target = null

    if (m.mentionedJid && m.mentionedJid.length) {
        target = m.mentionedJid[0]
    }

    if (!target && m.quoted) {
        target = m.quoted.sender
    }

    if (!target) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    command === 'addantinuke'
                        ? '❌ Menziona l\'utente da autorizzare.\n\nEsempio: .addantinuke @utente'
                        : '❌ Menziona l\'utente da rimuovere.\n\nEsempio: .delantinuke @utente'
            },
            { quoted: m }
        )
    }

    try {
        target = conn.decodeJid(target)
    } catch {
        return
    }

    if (!target || !target.includes('@s.whatsapp.net')) return

    if (command === 'addantinuke') {
        if (chat.antinukeAdmins.includes(target)) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `⚠️ @${target.split('@')[0]} è già autorizzato all'Anti-Nuke.`,
                    mentions: [target]
                },
                { quoted: m }
            )
        }

        chat.antinukeAdmins.push(target)

        return conn.sendMessage(
            m.chat,
            {
                text:
                    `✅ *ANTI-NUKE*\n\n` +
                    `@${target.split('@')[0]} è stato autorizzato.\n\n` +
                    `Ora può modificare gli amministratori senza essere bloccato dall'Anti-Nuke.`,
                mentions: [target]
            },
            { quoted: m }
        )
    }

    if (command === 'delantinuke') {
        if (!chat.antinukeAdmins.includes(target)) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `⚠️ @${target.split('@')[0]} non è presente tra gli autorizzati.`,
                    mentions: [target]
                },
                { quoted: m }
            )
        }

        chat.antinukeAdmins = chat.antinukeAdmins.filter(
            jid => jid !== target
        )

        return conn.sendMessage(
            m.chat,
            {
                text:
                    `✅ *ANTI-NUKE*\n\n` +
                    `@${target.split('@')[0]} è stato rimosso dagli autorizzati.\n\n` +
                    `Da ora le sue modifiche agli amministratori verranno controllate dall'Anti-Nuke.`,
                mentions: [target]
            },
            { quoted: m }
        )
    }
}

handler.command = /^(addantinuke|delantinuke)$/i
handler.group = true
handler.owner = true

export default handler