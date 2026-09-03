// Plugin tuttigp by Bonzino

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*⚠️ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨.*

*𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*
*${usedPrefix + command} 𝐂𝐢𝐚𝐨 𝐚 𝐭𝐮𝐭𝐭𝐢!*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  const chats = Object.entries(conn.chats || {})
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)

  if (!chats.length) {
    return m.reply(`*⚠️ 𝐈𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 è 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐢𝐧 𝐧𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  await m.reply(`*📢 𝐈𝐧𝐯𝐢𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧 ${chats.length} 𝐠𝐫𝐮𝐩𝐩𝐢...*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)

  let inviati = 0
  let falliti = 0

  for (const [jid] of chats) {
    try {
      const metadata = await conn.groupMetadata(jid)
      const participants = metadata.participants.map(p => p.id)

      await conn.sendMessage(jid, {
        text:
`*╭━━━━━━━📢━━━━━━━╮*
*✦ 𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓 ✦*
*╰━━━━━━━📢━━━━━━━╯*

${text}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
        mentions: participants
      })

      inviati++
      await delay(1500)
    } catch (e) {
      falliti++
      console.log(`[TUTTIGP ERROR] ${jid}`, e)
    }
  }

  return m.reply(`*✅ 𝐁𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨.*

*📤 𝐈𝐧𝐯𝐢𝐚𝐭𝐢:* *${inviati}*
*❌ 𝐅𝐚𝐥𝐥𝐢𝐭𝐢:* *${falliti}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
}

handler.help = ['tuttigp <messaggio>']
handler.tags = ['owner']
handler.command = /^(tuttigp)$/i
handler.owner = true

export default handler