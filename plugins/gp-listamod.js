// Plugin listamod by Bonzino

import fetch from 'node-fetch'
import fs from 'fs'

const S = v => String(v || '')

const handler = async (m, { conn }) => {

  const users = global.db.data.users || {}
  const groupMods = []

  for (let jid in users) {
    if (users[jid]?.moderator) {
      groupMods.push(jid)
    }
  }

  if (groupMods.length === 0) {
    return m.reply('*⚠️ 𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.*')
  }

const list = groupMods
  .map(jid => `➤ @${jid.split('@')[0]}`)
  .join('\n')

  const text = `*╭━━━━━━━🛡️━━━━━━━╮*
*✦ 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐎𝐑𝐈 ✦*
*╰━━━━━━━🛡️━━━━━━━╯*

${list}`

  let userPfp

  try {
    userPfp = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    userPfp = './media/default-avatar.png'
  }

  const displayName =
    m.pushName ||
    await conn.getName(m.sender) ||
    '𝐔𝐭𝐞𝐧𝐭𝐞'

  const fakeContact = {
    key: {
      participants: '0@s.whatsapp.net',
      fromMe: false,
      id: '𝑵𝑰𝑮𝑮𝑨'
    },
    message: {
      contactMessage: {
        displayName,
        vcard:
`BEGIN:VCARD
VERSION:3.0
FN:${displayName}
TEL;type=CELL;type=VOICE;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
END:VCARD`,
        jpegThumbnail: Buffer.isBuffer(userPfp)
          ? userPfp
          : userPfp.startsWith('./')
            ? await fs.promises.readFile(userPfp)
            : await (await fetch(userPfp)).buffer()
      }
    },
    participant: '0@s.whatsapp.net'
  }

  await conn.sendMessage(m.chat, {
    text,
    mentions: groupMods
  }, { quoted: fakeContact })
}

handler.help = ['mods', 'listamod']
handler.tags = ['group']
handler.command = /^(mods|listamod)$/i
handler.group = true

export default handler