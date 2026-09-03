global.begSession = global.begSession || {}

const begCooldown = 5 * 60 * 1000

const scenarios = [
  {
    txt: '*👵 𝐔𝐧𝐚 𝐯𝐞𝐜𝐜𝐡𝐢𝐞𝐭𝐭𝐚 𝐭𝐢 𝐯𝐞𝐝𝐞 𝐞 𝐬𝐨𝐫𝐫𝐢𝐝𝐞.*',
    opzioni: ['1️⃣ 𝐂𝐡𝐢𝐞𝐝𝐢 𝐠𝐞𝐧𝐭𝐢𝐥𝐦𝐞𝐧𝐭𝐞', '2️⃣ 𝐈𝐠𝐧𝐨𝐫𝐢'],
    bonus: [randomNum(5, 15), 0]
  },
  {
    txt: '*🧔 𝐔𝐧 𝐮𝐨𝐦𝐨 𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐬𝐨𝐬𝐩𝐞𝐭𝐭𝐨𝐬𝐨.*',
    opzioni: ['1️⃣ 𝐑𝐚𝐜𝐜𝐨𝐧𝐭𝐢 𝐥𝐚 𝐭𝐮𝐚 𝐬𝐭𝐨𝐫𝐢𝐚', '2️⃣ 𝐅𝐢𝐧𝐠𝐢 𝐝𝐢 𝐧𝐮𝐥𝐥𝐚'],
    bonus: [randomNum(5, 20), -2]
  },
  {
    txt: '*👦 𝐔𝐧 𝐛𝐚𝐦𝐛𝐢𝐧𝐨 𝐭𝐢 𝐨𝐟𝐟𝐫𝐞 𝐝𝐞𝐥𝐥𝐞 𝐦𝐨𝐧𝐞𝐭𝐞.*',
    opzioni: ['1️⃣ 𝐀𝐜𝐜𝐞𝐭𝐭𝐢 𝐜𝐨𝐧 𝐠𝐫𝐚𝐭𝐢𝐭𝐮𝐝𝐢𝐧𝐞', '2️⃣ 𝐑𝐢𝐟𝐢𝐮𝐭𝐢'],
    bonus: [randomNum(2, 10), 0]
  },
  {
    txt: '*💼 𝐔𝐧𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐭𝐢 𝐨𝐟𝐟𝐫𝐞 𝐮𝐧𝐚 𝐛𝐚𝐧𝐜𝐨𝐧𝐨𝐭𝐚 𝐠𝐫𝐚𝐧𝐝𝐞.*',
    opzioni: ['1️⃣ 𝐀𝐜𝐜𝐞𝐭𝐭𝐢', '2️⃣ 𝐑𝐢𝐟𝐢𝐮𝐭𝐢'],
    bonus: [randomNum(15, 30), 0]
  },
  {
    txt: '*🚓 𝐔𝐧 𝐯𝐢𝐠𝐢𝐥𝐞 𝐭𝐢 𝐝𝐢𝐜𝐞 𝐝𝐢 𝐬𝐩𝐨𝐬𝐭𝐚𝐫𝐭𝐢.*',
    opzioni: ['1️⃣ 𝐓𝐢 𝐬𝐩𝐨𝐬𝐭𝐢', '2️⃣ 𝐑𝐞𝐬𝐭𝐢 𝐥𝐢̀'],
    bonus: [0, -5]
  },
  {
    txt: '*🐕 𝐔𝐧 𝐜𝐚𝐧𝐞 𝐭𝐢 𝐫𝐮𝐛𝐚 𝐮𝐧𝐚 𝐦𝐨𝐧𝐞𝐭𝐚.*',
    opzioni: ['1️⃣ 𝐋𝐨 𝐢𝐧𝐬𝐞𝐠𝐮𝐢', '2️⃣ 𝐋𝐚𝐬𝐜𝐢 𝐩𝐞𝐫𝐝𝐞𝐫𝐞'],
    bonus: [randomNum(1, 5), -3]
  }
]

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

let handler = async (m, { conn, command }) => {
  const user = m.sender

  if (!global.db.data.users[user]) {
    global.db.data.users[user] = { euro: 0, xp: 0, level: 1, lastBeg: 0 }
  }

  const u = global.db.data.users[user]

  if (typeof u.euro !== 'number') u.euro = 0
  if (typeof u.xp !== 'number') u.xp = 0
  if (typeof u.level !== 'number') u.level = 1
  if (typeof u.lastBeg !== 'number') u.lastBeg = 0

  const time = begCooldown - (Date.now() - u.lastBeg)

  if (time > 0) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)

    return conn.reply(
      m.chat,
      box(
        '⏳',
        '𝐄𝐋𝐄𝐌𝐎𝐒𝐈𝐍𝐀',
        `*𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚:* ${minutes}𝐦 ${seconds}𝐬`
      ),
      m
    )
  }

  if (command === 'elemosina' || command === 'beg') {
    const ev = scenarios[Math.floor(Math.random() * scenarios.length)]

    global.begSession[user] = {
      step: 'choice',
      event: ev
    }

    const txt = box(
      '🙏',
      '𝐄𝐋𝐄𝐌𝐎𝐒𝐈𝐍𝐀',
      `${ev.txt}

*${ev.opzioni[0]}*
*${ev.opzioni[1]}*

*💸 𝐃𝐞𝐧𝐚𝐫𝐨:* ${formatNumber(u.euro)}

*𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧’𝐨𝐩𝐳𝐢𝐨𝐧𝐞 𝐪𝐮𝐢 𝐬𝐨𝐭𝐭𝐨:*`
    )

    return conn.sendMessage(m.chat, {
      text: txt,
      footer: '',
      buttons: [
        {
          buttonId: '.beg1',
          buttonText: { displayText: '1️⃣ 𝐒𝐜𝐞𝐥𝐭𝐚 𝟏' },
          type: 1
        },
        {
          buttonId: '.beg2',
          buttonText: { displayText: '2️⃣ 𝐒𝐜𝐞𝐥𝐭𝐚 𝟐' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })
  }
}

handler.before = async (m, { conn }) => {
  const user = m.sender
  if (!global.begSession[user]) return

  const raw = getButtonId(m).toLowerCase()
  let input = null

  if (raw === '.beg1' || raw === '1') input = 1
  if (raw === '.beg2' || raw === '2') input = 2
  if (!input) return

  const session = global.begSession[user]
  const u = global.db.data.users[user]

  if (session.step === 'choice') {
    const ev = session.event
    const choice = input - 1
    const bonus = ev.bonus[choice] || 0

    u.euro += bonus

    const xpGain = randomNum(1, 5)
    u.xp += xpGain
    u.lastBeg = Date.now()

    let lvlUp = false

    if (u.xp >= u.level * 50) {
      u.level++
      u.xp = 0
      lvlUp = true
    }

    delete global.begSession[user]

    let msg = `*✅ 𝐇𝐚𝐢 𝐬𝐜𝐞𝐥𝐭𝐨:* ${input}️⃣
*💸 𝐇𝐚𝐢 𝐫𝐢𝐜𝐞𝐯𝐮𝐭𝐨:* ${formatNumber(bonus)}

*💼 𝐃𝐞𝐧𝐚𝐫𝐨 𝐭𝐨𝐭𝐚𝐥𝐞:* ${formatNumber(u.euro)}
*🏅 𝐋𝐢𝐯𝐞𝐥𝐥𝐨:* ${u.level}
*⭐ 𝐄𝐗𝐏:* ${formatNumber(u.xp)}/${formatNumber(u.level * 50)}`

    if (lvlUp) {
      msg += `

*🎉 𝐋𝐄𝐕𝐄𝐋 𝐔𝐏!*`
    }

    return conn.reply(m.chat, box('💰', '𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎', msg), m)
  }
}

handler.help = ['beg', 'elemosina']
handler.tags = ['economy']
handler.command = /^(beg|elemosina)$/i

export default handler

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num)
}