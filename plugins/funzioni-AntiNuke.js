const handler = m => m

const registeredAdmins = [
    '393204514107@s.whatsapp.net',
    '393516908130@s.whatsapp.net',
    '447598974929@s.whatsapp.net'
]

handler.before = async function (m, { conn, participants, isBotAdmin }) {
    if (!m.isGroup) return

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antinuke) return

    if (![29, 30].includes(m.messageStubType)) return

    const decode = jid => {
        try {
            return conn.decodeJid(jid)
        } catch {
            return jid
        }
    }

    const sender = decode(
        m.key?.participant ||
        m.participant ||
        m.sender
    )

    const botJid = decode(conn.user.id)

    const BOT_OWNERS = (global.owner || [])
        .map(o => decode(
            o[0].includes('@')
                ? o[0]
                : o[0] + '@s.whatsapp.net'
        ))

    const dynamicAdmins = Array.isArray(chat.antinukeAdmins)
        ? chat.antinukeAdmins.map(decode)
        : []

    let metadata = null

    try {
        metadata = await conn.groupMetadata(m.chat)
    } catch (e) {
        console.error('[ANTINUKE] Errore metadata:', e)
    }

    const founderJid = metadata?.owner
        ? decode(metadata.owner)
        : null

    const allowed = new Set([
        botJid,
        ...BOT_OWNERS,
        ...registeredAdmins.map(decode),
        ...dynamicAdmins,
        founderJid
    ].filter(Boolean))

    if (sender === botJid) return

    if (!isBotAdmin) {
        return
    }

    const currentParticipants =
        metadata?.participants?.length
            ? metadata.participants
            : participants || []

    const usersToDemote = currentParticipants
        .filter(p => p.admin)
        .map(p => decode(p.jid || p.id))
        .filter(jid =>
            jid &&
            jid !== botJid &&
            !allowed.has(jid)
        )

    if (!usersToDemote.length) return

    const action =
        m.messageStubType === 29
            ? 'promozione'
            : 'retrocessione'

    console.log(
        `[ANTINUKE] ${action} non autorizzata da ${sender}`
    )

    console.log(
        `[ANTINUKE] Admin da demotare:`,
        usersToDemote
    )

    const results = await Promise.allSettled(
        usersToDemote.map(jid =>
            conn.groupParticipantsUpdate(
                m.chat,
                [jid],
                'demote'
            )
        )
    )

    const demoted = []
    const failed = []

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            demoted.push(usersToDemote[index])
        } else {
            failed.push(usersToDemote[index])

            console.error(
                `[ANTINUKE] Errore demote ${usersToDemote[index]}:`,
                result.reason
            )
        }
    })

    if (!demoted.length) return

    const text =
        `⚠️ *ANTI-NUKE*\n\n` +
        `È stata rilevata una ${action} non autorizzata.\n\n` +
        `👤 *Azione eseguita da:*\n` +
        `@${sender.split('@')[0]}\n\n` +
        `🔒 *ADMIN DEMOTATI:*\n` +
        demoted
            .map(jid => `• @${jid.split('@')[0]}`)
            .join('\n') +
        (failed.length
            ? `\n\n⚠️ *Non è stato possibile demotare:*\n` +
              failed
                .map(jid => `• @${jid.split('@')[0]}`)
                .join('\n')
            : '') +
        `\n\n🛡️ *Protetti:* Owner • Founder • Bot • Admin autorizzati`

    try {
        await conn.sendMessage(m.chat, {
            text,
            mentions: [
                sender,
                ...demoted,
                ...failed
            ]
        })
    } catch (e) {
        console.error(
            '[ANTINUKE] Errore invio messaggio:',
            e
        )
    }
}

export default handler