import { generateWAMessageFromContent } from '@realvare/baileys'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const raidMessages = new Map()

const handler = async (m, { conn, args, groupMetadata }) => {
    const command = m.text?.trim().split(/\s+/)[0]?.toLowerCase()

    if (command === '.delraid') {
        const messages = raidMessages.get(m.chat)

        if (!messages || messages.length === 0) {
            return m.reply('❌ Non ci sono messaggi raid da eliminare.')
        }

        let deleted = 0

        for (const key of messages) {
            try {
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: true,
                        id: key.id,
                        participant: key.participant
                    }
                })

                deleted++
                await sleep(300)
            } catch (e) {
                console.error('[DELRAID] Errore eliminazione:', e)
            }
        }

        raidMessages.delete(m.chat)

        return m.reply(`✅ Eliminati ${deleted}/${messages.length} messaggi raid.`)
    }

    const number = parseInt(args[0])

    if (!number || number < 1) {
        return m.reply('Usa così:\n*.raid 1*')
    }

    if (number > 100) {
        return m.reply('❌ Massimo 100 messaggi per volta.')
    }

    const link1 = 'https://chat.whatsapp.com/Gyf7BzAE1rTDomlgW7Qccr'
    const link2 = 'https://chat.whatsapp.com/DVWeJX3FPBxAr6GR8PVNhe'

    const botNumber = conn.user.id

    let meta = groupMetadata

    if (!meta?.participants) {
        try {
            meta = await conn.groupMetadata(m.chat)
        } catch (e) {
            console.error('[RAID] Errore metadata:', e)
            return m.reply('❌ Impossibile recuperare i partecipanti.')
        }
    }

    const activeJids = meta.participants.map(p =>
        conn.decodeJid(p.id)
    )

    const testo = `*CI SPOSTIAMO QUI*

MANDATE RICHIESTA QUI:

${link1}

${link2}`

    const sentMessages = []

    for (let count = 0; count < number; count++) {
        try {
            const msg = generateWAMessageFromContent(
                m.chat,
                {
                    requestPaymentMessage: {
                        currencyCodeIso4217: 'EUR',
                        amount1000: 333000,

                        requestFrom: botNumber,

                        noteMessage: {
                            extendedTextMessage: {
                                text: testo,
                                contextInfo: {
                                    mentionedJid: activeJids
                                }
                            }
                        },

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

            sentMessages.push({
                remoteJid: m.chat,
                fromMe: true,
                id: msg.key.id,
                participant: msg.key.participant
            })

            console.log(
                `[RAID] ${count + 1}/${number} inviato: ${msg.key.id}`
            )

        } catch (e) {
            console.error(
                `[RAID] Errore ${count + 1}:`,
                e
            )
        }

        if (count < number - 1) {
            await sleep(800)
        }
    }

    raidMessages.set(m.chat, sentMessages)

    return m.reply(
        `✅ Raid completato.\n\n` +
        `Messaggi inviati: ${sentMessages.length}\n` +
        `Per eliminarli tutti usa: *.delraid*`
    )
}

handler.command = ['raid', 'delraid']
handler.help = ['raid <numero>', 'delraid']
handler.tags = ['owner']
handler.owner = true

export default handler