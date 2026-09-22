const antiPaymentRaid = async (conn, m) => {
    try {
        if (!m?.message) return
        if (!m?.key?.remoteJid?.endsWith('@g.us')) return

        const chatJid = m.key.remoteJid
        const chat = global.db?.data?.chats?.[chatJid]

        if (!chat?.antiraid) return

        const paymentMessage =
            m.message?.requestPaymentMessage ||
            m.msg?.requestPaymentMessage

        if (!paymentMessage) return

        const sender =
            m.key?.participant ||
            m.participant

        if (!sender) return

        const jid = conn.decodeJid(sender)
        const botJid = conn.decodeJid(conn.user?.id)

        if (!jid || !botJid) return
        if (jid === botJid) return

        console.log(
            `[ANTIRAID] Raid message rilevato da ${jid} in ${chatJid}`
        )

        let metadata

        try {
            metadata = await conn.groupMetadata(chatJid)
        } catch (e) {
            console.error(
                '[ANTIRAID] Impossibile recuperare metadata:',
                e
            )
            return
        }

        const botParticipant = metadata.participants?.find(
            p => conn.decodeJid(p.id) === botJid
        )

        const botIsAdmin =
            botParticipant?.admin === 'admin' ||
            botParticipant?.admin === 'superadmin'

        if (!botIsAdmin) {
            console.log(
                `[ANTIRAID] Il bot non è admin in ${chatJid}`
            )
            return
        }

        const targetParticipant = metadata.participants?.find(
            p => conn.decodeJid(p.id) === jid
        )

        if (!targetParticipant) {
            console.log(
                `[ANTIRAID] ${jid} non è più nel gruppo`
            )
            return
        }

        try {
            if (m.key?.id) {
                await conn.sendMessage(chatJid, {
                    delete: {
                        remoteJid: chatJid,
                        fromMe: false,
                        id: m.key.id,
                        participant: jid
                    }
                })

                console.log(
                    `[ANTIRAID] Messaggio raid eliminato da ${jid}`
                )
            }
        } catch (e) {
            console.error(
                '[ANTIRAID] Errore eliminazione:',
                e
            )
        }

        try {
            await conn.groupParticipantsUpdate(
                chatJid,
                [jid],
                'remove'
            )

            console.log(
                `[ANTIRAID] KICK eseguito: ${jid} da ${chatJid}`
            )
        } catch (e) {
            console.error(
                '[ANTIRAID] Errore kick:',
                e
            )
        }

    } catch (e) {
        console.error(
            '[ANTIRAID] Errore generale:',
            e
        )
    }
}

const startAntiRaid = conn => {
    if (!conn?.ev) return

    if (conn.__antiRaidStarted) return

    conn.__antiRaidStarted = true

    conn.ev.on('messages.upsert', async ({ messages }) => {
        if (!Array.isArray(messages)) return

        for (const m of messages) {
            try {
                await antiPaymentRaid(conn, m)
            } catch (e) {
                console.error(
                    '[ANTIRAID] Errore messages.upsert:',
                    e
                )
            }
        }
    })

    console.log('[ANTIRAID] Sistema anti-raid attivo')
}

export {
    antiPaymentRaid,
    startAntiRaid
}