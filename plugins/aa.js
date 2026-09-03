import { generateWAMessageFromContent } from '@realvare/baileys'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const handler = async (m, { conn, args, groupMetadata }) => {
    const number = parseInt(args[0])

    if (!number || number < 1) {
        return m.reply(`Usa così:\n*.spam 1*`)
    }

    if (number > 100) {
        return m.reply('❌ Massimo 100 messaggi per volta.')
    }

    const link1 = 'https://chat.whatsapp.com/Gyf7BzAE1rTDomlgW7Qccr'
    const link2 = 'https://chat.whatsapp.com/Giwjquiq4k680j9IxNwW2D'
    const link3 = 'https://chat.whatsapp.com/HVjLMKrarPG0nUZicrgn8l'
    const botNumber = conn.user.id

    // Recupera tutti i partecipanti del gruppo
    let meta = groupMetadata

    if (!meta?.participants) {
        try {
            meta = await conn.groupMetadata(m.chat)
        } catch (e) {
            console.error('[SPAN] Errore metadata:', e)
            return m.reply('❌ Impossibile recuperare i partecipanti.')
        }
    }

    const activeJids = meta.participants.map(p =>
        conn.decodeJid(p.id)
    )

    // Testo con i 3 link
    const testo = `*CI SPOSTIAMO QUI*

MANDATE RICHIESTA QUI:

${link1}

${link2}

${link3}

${link1}

${link2}

${link3}`

    for (let count = 0; count < number; count++) {
        try {
            const msg = generateWAMessageFromContent(
                m.chat,
                {
                    requestPaymentMessage: {
                        currencyCodeIso4217: 'EUR',
                        amount1000: 333000, // €333.00

                        requestFrom: botNumber,

                        noteMessage: {
                            extendedTextMessage: {
                                text: testo,

                                contextInfo: {
                                    mentionedJid: activeJids
                                }
                            }
                        },

                        // Scadenza tra 7 giorni
                        expiryTimestamp:
                            Math.floor(Date.now() / 1000) + (86400 * 7),

                        background: {
                            placeholderArgb: 0xFF0A84FF
                        }
                    }
                },
                {
                    userJid: conn.user.id
                }
            )

            await conn.relayMessage(
                m.chat,
                msg.message,
                {
                    messageId: msg.key.id
                }
            )

            console.log(
                `[SPAN] ${count + 1}/${number} inviato: ${msg.key.id}`
            )

        } catch (e) {
            console.error(
                `[SPAN] Errore ${count + 1}:`,
                e
            )
        }

        if (count < number) {
            await sleep(800)
        }
    }
}

handler.command = ['raid']
handler.help = ['spam <numero>']
handler.tags = ['owner']
handler.owner = true

export default handler