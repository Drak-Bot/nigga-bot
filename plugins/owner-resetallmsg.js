// Plugin resetallmsg by Bonzino

let handler = async (m, { conn }) => {

  let giornalieri = 0
  let totali = 0
  let legacy = 0
  let globali = 0

  const chats = global.db.data.chats || {}

  for (const chatId of Object.keys(chats)) {

    const chat = chats[chatId]
    if (!chat) continue

    if (chat.classificaGiornaliera?.utenti) {
      for (const jid of Object.keys(chat.classificaGiornaliera.utenti)) {
        giornalieri +=
          chat.classificaGiornaliera.utenti[jid]?.conteggio || 0
      }

      chat.classificaGiornaliera.utenti = {}
      chat.classificaGiornaliera.totali = 0
    }

    if (chat.classificaTotale?.utenti) {
      for (const jid of Object.keys(chat.classificaTotale.utenti)) {
        totali +=
          chat.classificaTotale.utenti[jid]?.conteggio || 0
      }

      chat.classificaTotale.utenti = {}
      chat.classificaTotale.totali = 0
    }

    if (chat.users) {
      for (const jid of Object.keys(chat.users)) {

        legacy += chat.users[jid]?.messages || 0

        if (typeof chat.users[jid].messages === 'number') {
          chat.users[jid].messages = 0
        }
      }
    }
  }

  for (const jid of Object.keys(global.db.data.users || {})) {

    globali +=
      global.db.data.users[jid]?.messages || 0

    if (typeof global.db.data.users[jid].messages === 'number') {
      global.db.data.users[jid].messages = 0
    }
  }

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐓𝐮𝐭𝐭𝐢 𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐢*
*📅 ${giornalieri}* • *🌐 ${totali}* • *📦 ${legacy}* • *👤 ${globali}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
  }, { quoted: m })
}

handler.help = ['resetallmsg']
handler.tags = ['owner']
handler.command = /^(resetallmsg)$/i
handler.owner = true

export default handler