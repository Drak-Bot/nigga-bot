// delmod by Bonzino

const handler = async (m, { conn, text }) => {

if (!m.isGroup)
return m.reply('*❌ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚 𝐬𝐨𝐥𝐨 𝐧𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢.*')

let who = m.mentionedJid?.[0] || m.quoted?.sender || ''

if (!who && text) {
let number = text.replace(/\D/g, '')
if (number.length >= 8) who = number + '@s.whatsapp.net'
}

if (!who)
return m.reply('*❌ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚𝐥𝐥’𝐮𝐭𝐞𝐧𝐭𝐞.*')

const user = global.db.data.users[who]

if (!user || !user.moderator || user.moderatorGroup !== m.chat)
return m.reply(`*@${who.split('@')[0]} 𝐧𝐨𝐧 𝐞̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.*`, null, { mentions: [who] })

user.moderator = false
delete user.moderatorGroup

let thumbnail = null

try {
const pp = await conn.profilePictureUrl(who, 'image')
const res = await fetch(pp)
thumbnail = Buffer.from(await res.arrayBuffer())
} catch {}

await conn.sendMessage(m.chat, {
text: `*@${who.split('@')[0]} 𝐧𝐨𝐧 𝐞̀ 𝐩𝐢𝐮̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 🚫.*\n\n> 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻`,
contextInfo: {
mentionedJid: [who],
externalAdReply: {
title: '🚫 Moderatore rimosso',
thumbnail: thumbnail
}
}
}, { quoted: m })

}

handler.help = ['delmod @user']
handler.tags = ['group']
handler.command = ['delmod']
handler.group = true
handler.rowner = true

export default handler