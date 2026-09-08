const handler = async (m, { conn, isOwner }) => {
    if (!m.isGroup) return
    if (!isOwner) return

    const text = m.text || ''
    const match = text.match(/^\.((?:add|del)antinuke)(?:\s+|$)/i)

    if (!match) return

    const command = match[1].toLowerCase()

    const chat = global.db.data.chats[m.chat]

    if (!chat) return

    if (!chat.antinukeAdmins) {
        chat.antinukeAdmins = []
    }

    let target = m.mentionedJid?.[0]

    if (!target && m.quoted) {
        target = m.quoted.sender
    }

    if (!target) {
        return m.reply(
            command === 'addantinuke'
                ? '❌ Menziona l\'utente da autorizzare.'
                : '❌ Menziona l\'utente da rimuovere.'
        )
    }

    target = conn.decodeJid(target)

    if (command === 'addantinuke') {
        if (chat.antinukeAdmins.includes(target)) {
            return m.reply(
                `⚠️ @${target.split('@')[0]} è già autorizzato.`,
                { mentions: [target] }
            )
        }

        chat.antinukeAdmins.push(target)

        return m.reply(
            `✅ @${target.split('@')[0]} è stato autorizzato all'Anti-Nuke.`,
            { mentions: [target] }
        )
    }

    if (command === 'delantinuke') {
        if (!chat.antinukeAdmins.includes(target)) {
            return m.reply(
                `⚠️ @${target.split('@')[0]} non è presente tra gli autorizzati.`,
                { mentions: [target] }
            )
        }

        chat.antinukeAdmins = chat.antinukeAdmins.filter(
            jid => jid !== target
        )

        return m.reply(
            `❌ @${target.split('@')[0]} è stato rimosso dagli autorizzati.`,
            { mentions: [target] }
        )
    }
}

handler.command = /^(addantinuke|delantinuke)$/i
handler.group = true
handler.owner = true

export default handler