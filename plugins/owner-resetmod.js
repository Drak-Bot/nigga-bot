import fetch from 'node-fetch'

const handler = async (m, { conn }) => {

  const users = global.db.data.users || {}
  const removed = []

  for (const jid in users) {
    if (users[jid].moderator && users[jid].moderatorGroup === m.chat) {
      users[jid].moderator = false
      delete users[jid].moderatorGroup
      removed.push(jid)
    }
  }

  if (!removed.length) {
    return m.reply(`*ℹ️ 𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐝𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  let thumb = null

  try {
    const pp = await conn.profilePictureUrl(m.chat, 'image')
    const res = await fetch(pp)
    thumb = await res.buffer()
  } catch {}

  const list = removed
    .map((jid, i) => `*☠️ ${i + 1}. @${jid.split('@')[0]}*`)
    .join('\n')

  const caption =
`*✅ 𝐓𝐮𝐭𝐭𝐢 𝐢 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢.*

*𝐔𝐭𝐞𝐧𝐭𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:*
${list}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

  await conn.sendMessage(
    m.chat,
    {
      text: caption,
      mentions: removed,
      contextInfo: thumb ? { jpegThumbnail: thumb } : {}
    },
    { quoted: m }
  )
}

handler.help = ['resetmod']
handler.tags = ['owner']
handler.command = ['resetmod']
handler.group = true
handler.rowner = true

export default handler