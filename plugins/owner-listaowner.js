// Plugin listaowner by Bonzino

import fetch from 'node-fetch'
import fs from 'fs'

const handler = async (m, { conn }) => {
  global.owner = global.owner || []

  const owners = [...new Set(
    global.owner
      .map(v => Array.isArray(v) ? v[0] : v)
      .map(v => String(v || '').replace(/\D/g, ''))
      .filter(Boolean)
  )]

  if (!owners.length) {
    return m.reply('*⚠️ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.*')
  }

  const ownerJids = owners.map(num => `${num}@s.whatsapp.net`)

  const list = owners
    .map(num => `➤ @${num}`)
    .join('\n')

  const text = `*╭━━━━━━━👑━━━━━━━╮*
*✦ 𝐎𝐖𝐍𝐄𝐑 ✦*
*╰━━━━━━━👑━━━━━━━╯*

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
    mentions: ownerJids
  }, { quoted: fakeContact })
}

handler.help = ['listaowner']
handler.tags = ['owner']
handler.command = /^(listaowner|owners|ownerlist)$/i
handler.owner = true

export default handler