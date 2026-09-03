// Plugin tagallgp by Bonzino

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

  await m.reply(`*📢 𝐈𝐧𝐯𝐢𝐨 𝐭𝐚𝐠 𝐠𝐥𝐨𝐛𝐚𝐥𝐞 𝐢𝐧 ${chats.length} 𝐠𝐫𝐮𝐩𝐩𝐢...*

> *𝛥𝐗𝐈𝚶𝐍 𝚩𝚯𝐓*`)

  let inviati = 0
  let falliti = 0

  for (const [jid] of chats) {
    try {
      const metadata = await conn.groupMetadata(jid)
      const participants = metadata.participants.map(p => p.id)

      await conn.sendMessage(jid, {
        text,
        mentions: participants
      })

      inviati++
      await delay(1500)

    } catch (e) {
      falliti++
      console.log(`[TAGALLGP ERROR] ${jid}`, e)
    }
  }

  return m.reply(`*✅ 𝐓𝐚𝐠 𝐠𝐥𝐨𝐛𝐚𝐥𝐞 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨.*

*📤 𝐈𝐧𝐯𝐢𝐚𝐭𝐢:* *${inviati}*
*❌ 𝐅𝐚𝐥𝐥𝐢𝐭𝐢:* *${falliti}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
}

handler.help = ['tagallgp <messaggio>']
handler.tags = ['owner']
handler.command = /^(tagallgp|pingallgp)$/i
handler.owner = true

export default handler