const antiPaymentRaid = async (conn, m) => {
    try {
        if (!m?.isGroup) return

        const paymentMessage =
            m.message?.requestPaymentMessage ||
            m.msg?.requestPaymentMessage

        if (!paymentMessage) return

        const sender =
            m.key?.participant ||
            m.participant

        if (!sender) return

        const jid = conn.decodeJid(sender)
        const botJid = conn.decodeJid(conn.user.id)

        if (jid === botJid) return

        console.log(`[ANTIRAID] Payment message rilevato da ${jid} in ${m.chat}`)

        try {
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: jid
                }
            })
        } catch (e) {
            console.error('[ANTIRAID] Errore eliminazione:', e)
        }

        try {
            await conn.groupParticipantsUpdate(
                m.chat,
                [jid],
                'remove'
            )

            console.log(`[ANTIRAID] ${jid} rimosso da ${m.chat}`)
        } catch (e) {
            console.error('[ANTIRAID] Errore kick:', e)
        }

    } catch (e) {
        console.error('[ANTIRAID] Errore generale:', e)
    }
}

const startAntiRaid = conn => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        for (const m of messages) {
            if (!m?.message) continue

            await antiPaymentRaid(conn, m)
        }
    })
}

export {
    antiPaymentRaid,
    startAntiRaid
}