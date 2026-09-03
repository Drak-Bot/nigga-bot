// Plugin modmsg by Bonzino

function formatJid(input = '') {
  const num = String(input).replace(/\D/g, '')
  if (!num) return null
  return num + '@s.whatsapp.net'
}

function parseTargetAndAmount(m, text = '') {
  let who =
    m.mentionedJid?.[0] ||
    m.quoted?.sender ||
    null

  let cleaned = String(text || '').trim()

  if (m.mentionedJid?.[0]) {
    cleaned = cleaned.replace(/@\d+/g, '').trim()
  }

  const parts = cleaned.split(/\s+/).filter(Boolean)

  if (!who && parts.length > 1) {
    who = formatJid(parts[0])
    parts.shift()
  }

  const amount = Number(parts[0] || 0)

  return { who, amount }
}

function ensureChat(chat) {
  if (!chat.classificaGiornaliera) {
    chat.classificaGiornaliera = {
      totali: 0,
      utenti: {},
      ultimoReset: new Date().toDateString()
    }
  }

  if (!chat.classificaTotale) {
    chat.classificaTotale = {
      totali: 0,
      utenti: {}
    }
  }

  if (!chat.users) {
    chat.users = {}
  }
}

function ensureClassificaUser(container, jid) {
  if (!container.utenti[jid]) {
    container.utenti[jid] = { conteggio: 0 }
  }
}

function ensureLegacyUser(chat, jid) {
  if (!chat.users[jid]) {
    chat.users[jid] = {}
  }

  if (typeof chat.users[jid].messages !== 'number') {
    chat.users[jid].messages = 0
  }
}

function ensureGlobalUser(jid) {
  if (!global.db.data.users[jid]) {
    global.db.data.users[jid] = {}
  }

  if (typeof global.db.data.users[jid].messages !== 'number') {
    global.db.data.users[jid].messages = 0
  }
}

let handler = async (m, { conn, text, command }) => {
  const cmd = String(command || '').toLowerCase()
  const { who, amount } = parseTargetAndAmount(m, text)

  if (!who || !amount || amount <= 0) {
    return m.reply(
`*⚠️ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:*
*.${cmd} @utente 10*
*.${cmd} 393xxxxxxxxx 10*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
    )
  }

  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {}
  }

  const chat = global.db.data.chats[m.chat]

  ensureChat(chat)
  ensureClassificaUser(chat.classificaGiornaliera, who)
  ensureClassificaUser(chat.classificaTotale, who)
  ensureLegacyUser(chat, who)
  ensureGlobalUser(who)

  if (cmd === 'addmsg') {

    chat.classificaGiornaliera.utenti[who].conteggio += amount
    chat.classificaGiornaliera.totali += amount

    chat.classificaTotale.utenti[who].conteggio += amount
    chat.classificaTotale.totali += amount

    chat.users[who].messages += amount

    global.db.data.users[who].messages += amount
  }

  if (cmd === 'removemsg') {

    const oldDaily =
      chat.classificaGiornaliera.utenti[who].conteggio || 0

    const oldTotal =
      chat.classificaTotale.utenti[who].conteggio || 0

    const oldLegacy =
      chat.users[who].messages || 0

    const oldGlobal =
      global.db.data.users[who].messages || 0

    const removeDaily = Math.min(oldDaily, amount)
    const removeTotal = Math.min(oldTotal, amount)
    const removeLegacy = Math.min(oldLegacy, amount)
    const removeGlobal = Math.min(oldGlobal, amount)

    chat.classificaGiornaliera.utenti[who].conteggio -= removeDaily
    chat.classificaGiornaliera.totali -= removeDaily

    chat.classificaTotale.utenti[who].conteggio -= removeTotal
    chat.classificaTotale.totali -= removeTotal

    chat.users[who].messages -= removeLegacy

    global.db.data.users[who].messages -= removeGlobal

    if (chat.classificaGiornaliera.utenti[who].conteggio <= 0) {
      delete chat.classificaGiornaliera.utenti[who]
    }

    if (chat.classificaTotale.utenti[who].conteggio <= 0) {
      delete chat.classificaTotale.utenti[who]
    }

    if (chat.users[who].messages < 0) {
      chat.users[who].messages = 0
    }

    if (global.db.data.users[who].messages < 0) {
      global.db.data.users[who].messages = 0
    }

    if (chat.classificaGiornaliera.totali < 0) {
      chat.classificaGiornaliera.totali = 0
    }

    if (chat.classificaTotale.totali < 0) {
      chat.classificaTotale.totali = 0
    }
  }

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐢*

*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${who.split('@')[0]}
*🔧 𝐎𝐩𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞:* *${cmd === 'addmsg' ? '𝐀𝐠𝐠𝐢𝐮𝐧𝐭𝐢' : '𝐑𝐢𝐦𝐨𝐬𝐬𝐢'}*
*📊 𝐐𝐮𝐚𝐧𝐭𝐢𝐭𝐚̀:* *${amount}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['addmsg', 'removemsg']
handler.tags = ['owner']
handler.command = /^(addmsg|removemsg)$/i
handler.owner = true

export default handler