// Plugin azzeramsg by Bonzino

function formatJid(input = '') {
  const num = String(input).replace(/\D/g, '')
  if (!num) return null
  return num + '@s.whatsapp.net'
}

let handler = async (m, { conn, text }) => {

  let who =
    m.mentionedJid?.[0] ||
    m.quoted?.sender

  if (!who && text) {
    who = formatJid(text)
  }

  if (!who) {
    return m.reply(
`*⚠️ 𝐓𝐚𝐫𝐠𝐚, 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐨 𝐢𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
    )
  }

  let rimossiGiornalieri = 0
  let rimossiTotali = 0
  let rimossiLegacy = 0
  let rimossiGlobal = 0

  const chats = global.db.data.chats || {}

  for (const chatId of Object.keys(chats)) {

    const chat = chats[chatId]

    if (!chat) continue

    if (chat.classificaGiornaliera?.utenti?.[who]) {

      const count =
        chat.classificaGiornaliera.utenti[who]?.conteggio || 0

      rimossiGiornalieri += count

      chat.classificaGiornaliera.totali -= count

      if (chat.classificaGiornaliera.totali < 0) {
        chat.classificaGiornaliera.totali = 0
      }

      delete chat.classificaGiornaliera.utenti[who]
    }

    if (chat.classificaTotale?.utenti?.[who]) {

      const count =
        chat.classificaTotale.utenti[who]?.conteggio || 0

      rimossiTotali += count

      chat.classificaTotale.totali -= count

      if (chat.classificaTotale.totali < 0) {
        chat.classificaTotale.totali = 0
      }

      delete chat.classificaTotale.utenti[who]
    }

    if (chat.users?.[who]) {

      const count =
        chat.users[who]?.messages || 0

      rimossiLegacy += count

      chat.users[who].messages = 0
    }
  }

  if (global.db.data.users?.[who]) {

    rimossiGlobal =
      global.db.data.users[who]?.messages || 0

    global.db.data.users[who].messages = 0
  }

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐢*

*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${who.split('@')[0]}
*📅 𝐆𝐢𝐨𝐫𝐧𝐚𝐥𝐢𝐞𝐫𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:* *${rimossiGiornalieri}*
*🌐 𝐓𝐨𝐭𝐚𝐥𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:* *${rimossiTotali}*
*📦 𝐋𝐞𝐠𝐚𝐜𝐲 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:* *${rimossiLegacy}*
*👤 𝐆𝐥𝐨𝐛𝐚𝐥𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:* *${rimossiGlobal}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['azzeramsg']
handler.tags = ['owner']
handler.command = /^(azzeramsg)$/i
handler.owner = true

export default handler