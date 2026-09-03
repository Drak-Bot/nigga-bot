//plugin by Bonzino

const S = v => String(v || '')

const buildContextMsg = title => ({
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'CTX' },
    message: {
        locationMessage: { name: title }
    },
    participant: '0@s.whatsapp.net'
})

let handler = async (m, { conn, text }) => {
    const chat = m.chat || m.key?.remoteJid
    if (!chat) return

    if (!S(text).trim()) {
        const q = buildContextMsg('𝐅𝐈𝐆𝐀')
        await conn.sendMessage(chat, {
            text: '𝐓𝐚𝐠𝐠𝐚 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐩𝐞𝐫 𝐚𝐧𝐚𝐥𝐢𝐳𝐳𝐚𝐫𝐞',
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424041538498@newsletter',
                    newsletterName: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
                    serverMessageId: 1
                }
            }
        }, { quoted: q })
        return
    }

    let width = Math.floor(Math.random() * 31)

    let finalPhrase = width >= 8
        ? '🔥 𝐂𝐨𝐦𝐩𝐥𝐢𝐦𝐞𝐧𝐭𝐢, 𝐥𝐢𝐯𝐞𝐥𝐥𝐨 𝐢𝐦𝐩𝐫𝐞𝐬𝐬𝐢𝐨𝐧𝐚𝐧𝐭𝐞!'
        : '😅 𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐦𝐞𝐝𝐢𝐨, 𝐜’𝐞̀ 𝐦𝐚𝐫𝐠𝐢𝐧𝐞 𝐝𝐢 𝐦𝐢𝐠𝐥𝐢𝐨𝐫𝐚𝐦𝐞𝐧𝐭𝐨!'

    let message = `
*╭━━━━━━━📏━━━━━━━╮*
*┃ 𝐂𝐀𝐋𝐂𝐎𝐋𝐎 𝐀𝐏𝐄𝐑𝐓𝐔𝐑𝐀*
*┣━━━━━━━━━━━━━━━*
*┃ 🔍 ${S(text).trim()}*
*┃ 👉 ${width} 𝐜𝐦*
*┣━━━━━━━━━━━━━━━*
*┃ ${finalPhrase}*
*╰━━━━━━━━━━━━━━━╯*
`.trim()

    const q = buildContextMsg('𝐅𝐈𝐆𝐀')

    await conn.sendMessage(chat, {
        text: message,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424041538498@newsletter',
                newsletterName: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
                serverMessageId: 1
            }
        }
    }, { quoted: q })
}

handler.help = ['figa <testo>']
handler.tags = ['fun']
handler.command = /^(figa)$/i

export default handler