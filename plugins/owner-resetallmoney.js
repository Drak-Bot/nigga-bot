// Plugin resetallmoney by Bonzino

let handler = async (m, { conn }) => {

  let rimossi = 0
  let utenti = 0
  for (const jid of Object.keys(global.db.data.users || {})) {
    const user = global.db.data.users[jid]
    if (!user) continue
    const soldi = Number(user.euro || 0)
    rimossi += soldi
    if (soldi > 0) utenti++
    user.euro = 0
  }

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐓𝐮𝐭𝐭𝐢 𝐢 𝐬𝐨𝐥𝐝𝐢 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐢*
*👥 𝐔𝐭𝐞𝐧𝐭𝐢:* *${utenti}*
*💸 𝐓𝐨𝐭𝐚𝐥𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨:* *${rimossi}€*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
  }, { quoted: m })
}

handler.help = ['resetallmoney']
handler.tags = ['owner']
handler.command = /^(resetallmoney)$/i
handler.owner = true

export default handler