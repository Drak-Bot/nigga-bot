import { generateWAMessageFromContent } from '@realvare/baileys'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const raidMessages = new Map()

const handler = async (m, { conn, args, groupMetadata }) => {
    const cmd = m.text?.trim().split(/\s+/)[0]?.toLowerCase()

    if (cmd === '.delraid') {
        const keys = raidMessages.get(m.chat)

        if (!keys?.length) {
            return m.reply('❌ Nessun raid da eliminare.')
        }

        let deleted = 0

        for (const key of keys) {
            try {
                await conn.sendMessage(m.chat, {
                    delete: key
                })

                deleted++
                await sleep(500)
            } catch (e) {
                console.error('[DELRAID] Errore:', e)
            }
        }

        raidMessages.delete(m.chat)

        return m.reply(
            `🗑️ Eliminazione completata.\nMessaggi eliminati: ${deleted}/${keys.length}`
        )
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
            console.error('[RAID] Metadata:', e)
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

    const sentKeys = []

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

            sentKeys.push({
                ...msg.key,
                remoteJid: m.chat,
                fromMe: true
            })

        } catch (e) {
            console.error(`[RAID] Errore ${count + 1}:`, e)
        }

        if (count < number - 1) {
            await sleep(800)
        }
    }

    raidMessages.set(m.chat, sentKeys)

    return m.reply(
        `✅ Raid inviato: ${sentKeys.length} messaggi.`
    )
}

handler.command = ['raid', 'delraid']
handler.help = ['raid <numero>', 'delraid']
handler.tags = ['owner']
handler.owner = true

export default handler