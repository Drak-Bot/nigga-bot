global.abbandonaAnimaleConfirm = global.abbandonaAnimaleConfirm || {}

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function getButtonId(m) {
  const msg = m.message || {}
  return (
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.templateButtonReplyMessage?.selectedId ||
    m.text ||
    ''
  ).trim()
}

let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})

  if (!user.animale) {
    return conn.reply(
      m.chat,
      box(
        '⚠️',
        '𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐀 𝐀𝐍𝐈𝐌𝐀𝐋𝐄',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐝𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐫𝐞.*`
      ),
      m
    )
  }

  global.abbandonaAnimaleConfirm[m.sender] = {
    owner: m.sender,
    chat: m.chat,
    expires: Date.now() + 2 * 60 * 1000
  }

  await conn.sendMessage(m.chat, {
    text: box(
      '⚠️',
      '𝐂𝐎𝐍𝐅𝐄𝐑𝐌𝐀 𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐎',
      `*𝐀𝐧𝐢𝐦𝐚𝐥𝐞:* ${user.animale.emoji} ${user.animale.nome}
*𝐓𝐢𝐩𝐨:* ${user.animale.tipo}

*🚫 𝐒𝐞 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐢:*
*• 𝐩𝐞𝐫𝐝𝐞𝐫𝐚𝐢 𝐥’𝐚𝐧𝐢𝐦𝐚𝐥𝐞*
*• 𝐩𝐞𝐫𝐝𝐞𝐫𝐚𝐢 𝐚𝐧𝐜𝐡𝐞 𝐢𝐥 𝐜𝐢𝐛𝐨 𝐚𝐜𝐜𝐮𝐦𝐮𝐥𝐚𝐭𝐨*`
    ),
    footer: '',
    buttons: [
      {
        buttonId: '.confirmabbandonaanimale',
        buttonText: { displayText: '✅ Conferma' },
        type: 1
      },
      {
        buttonId: '.annullaabbandonoanimale',
        buttonText: { displayText: '❌ Annulla' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.before = async (m, { conn }) => {
  const raw = getButtonId(m)

  if (raw !== '.confirmabbandonaanimale' && raw !== '.annullaabbandonoanimale') return false

  const session = global.abbandonaAnimaleConfirm[m.sender]
  if (!session) {
    await conn.reply(
      m.chat,
      box(
        '⚠️',
        '𝐒𝐄𝐒𝐒𝐈𝐎𝐍𝐄 𝐍𝐎𝐍 𝐕𝐀𝐋𝐈𝐃𝐀',
        `*𝐐𝐮𝐞𝐬𝐭𝐚 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚 𝐧𝐨𝐧 è 𝐩𝐢ù 𝐯𝐚𝐥𝐢𝐝𝐚.*`
      ),
      m
    )
    return true
  }

  if (session.chat !== m.chat) return true

  if (Date.now() > session.expires) {
    delete global.abbandonaAnimaleConfirm[m.sender]
    await conn.reply(
      m.chat,
      box(
        '⏳',
        '𝐂𝐎𝐍𝐅𝐄𝐑𝐌𝐀 𝐒𝐂𝐀𝐃𝐔𝐓𝐀',
        `*𝐋𝐚 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚 è 𝐬𝐜𝐚𝐝𝐮𝐭𝐚. 𝐔𝐬𝐚 .abbandonaanimale 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨.*`
      ),
      m
    )
    return true
  }

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})

  if (raw === '.annullaabbandonoanimale') {
    delete global.abbandonaAnimaleConfirm[m.sender]

    await conn.sendMessage(m.chat, {
      text: box(
        '❌',
        '𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐎 𝐀𝐍𝐍𝐔𝐋𝐋𝐀𝐓𝐎',
        `*𝐇𝐚𝐢 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨 𝐥’𝐨𝐩𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞.*`
      ),
      footer: '',
      buttons: [
        {
          buttonId: '.animale',
          buttonText: { displayText: '🐾 Stato animale' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })

    return true
  }

  if (!user.animale) {
    delete global.abbandonaAnimaleConfirm[m.sender]
    await conn.reply(
      m.chat,
      box(
        '⚠️',
        '𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐀 𝐀𝐍𝐈𝐌𝐀𝐋𝐄',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐝𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐫𝐞.*`
      ),
      m
    )
    return true
  }

  const animaleNome = user.animale.nome
  const animaleEmoji = user.animale.emoji
  const ciboPerso = Number(user.ciboAnimale || 0)

  user.animale = null
  user.ciboAnimale = 0
  user.lastAnimalAlert = 0

  delete global.abbandonaAnimaleConfirm[m.sender]

  await conn.sendMessage(m.chat, {
    text: box(
      '✅',
      '𝐀𝐍𝐈𝐌𝐀𝐋𝐄 𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐀𝐓𝐎',
      `*𝐇𝐚𝐢 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐭𝐨:* ${animaleEmoji} ${animaleNome}
*🥫 𝐂𝐢𝐛𝐨 𝐩𝐞𝐫𝐬𝐨:* ${ciboPerso}

*🛒 𝐎𝐫𝐚 𝐩𝐮𝐨𝐢 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐞 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐜𝐨𝐧 .shopanimali*`
    ),
    footer: '',
    buttons: [
      {
        buttonId: '.shopanimali',
        buttonText: { displayText: '🛒 Shop animali' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })

  return true
}

handler.help = ['abbandonaanimale']
handler.tags = ['rpg']
handler.command = /^(abbandonaanimale|abbandona)$/i

export default handler