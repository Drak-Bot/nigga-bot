const ANIMALI_MESSAGGI = {
  Gatto: {
    nutri: [
      '𝐟𝐚 𝐥𝐞 𝐟𝐮𝐬𝐚 𝐦𝐞𝐧𝐭𝐫𝐞 𝐦𝐚𝐧𝐠𝐢𝐚.',
      '𝐬𝐢 𝐬𝐭𝐫𝐮𝐬𝐜𝐢𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐝𝐨𝐩𝐨 𝐢𝐥 𝐩𝐚𝐬𝐭𝐨.',
      '𝐦𝐢𝐚𝐠𝐨𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐞 𝐝𝐢𝐯𝐨𝐫𝐚 𝐭𝐮𝐭𝐭𝐨.'
    ]
  },
  Cane: {
    nutri: [
      '𝐬𝐜𝐨𝐝𝐢𝐧𝐳𝐨𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐝𝐨𝐩𝐨 𝐚𝐯𝐞𝐫 𝐦𝐚𝐧𝐠𝐢𝐚𝐭𝐨.',
      '𝐝𝐢𝐯𝐨𝐫𝐚 𝐢𝐥 𝐜𝐢𝐛𝐨 𝐞 𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.',
      '𝐚𝐛𝐛𝐚𝐢𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐞 𝐜𝐡𝐢𝐞𝐝𝐞 𝐚𝐥𝐭𝐫𝐞 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.'
    ]
  },
  Coniglio: {
    nutri: [
      '𝐫𝐨𝐬𝐢𝐜𝐜𝐡𝐢𝐚 𝐭𝐮𝐭𝐭𝐨 𝐜𝐨𝐧 𝐜𝐚𝐥𝐦𝐚.',
      '𝐬𝐚𝐥𝐭𝐞𝐥𝐥𝐚 𝐩𝐢𝐜𝐜𝐨𝐥𝐨 𝐩𝐞𝐫 𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐢𝐭à.',
      '𝐦𝐚𝐧𝐠𝐢𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐞 𝐬𝐢 𝐚𝐜𝐜𝐨𝐜𝐜𝐨𝐥𝐚.'
    ]
  },
  Tartaruga: {
    nutri: [
      '𝐦𝐚𝐧𝐠𝐢𝐚 𝐩𝐢𝐚𝐧𝐨 𝐦𝐚 𝐜𝐨𝐧 𝐠𝐫𝐚𝐧𝐝𝐞 𝐬𝐨𝐝𝐝𝐢𝐬𝐟𝐚𝐳𝐢𝐨𝐧𝐞.',
      '𝐬𝐛𝐢𝐫𝐜𝐢𝐚 𝐝𝐚𝐥 𝐠𝐮𝐬𝐜𝐢𝐨 𝐞 𝐬𝐢 𝐠𝐨𝐝𝐞 𝐢𝐥 𝐩𝐚𝐬𝐭𝐨.',
      '𝐚𝐯𝐚𝐧𝐳𝐚 𝐩𝐢𝐚𝐧𝐨 𝐯𝐞𝐫𝐬𝐨 𝐢𝐥 𝐜𝐢𝐛𝐨 𝐞 𝐥𝐨 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚.'
    ]
  },
  Pappagallo: {
    nutri: [
      '𝐜𝐢𝐧𝐠𝐮𝐞𝐭𝐭𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐦𝐞𝐧𝐭𝐫𝐞 𝐦𝐚𝐧𝐠𝐢𝐚.',
      '𝐢𝐧𝐜𝐥𝐢𝐧𝐚 𝐥𝐚 𝐭𝐞𝐬𝐭𝐚 𝐞 𝐬𝐢 𝐠𝐨𝐝𝐞 𝐢𝐥 𝐩𝐚𝐬𝐭𝐨.',
      '𝐟𝐢𝐬𝐜𝐡𝐢𝐞𝐭𝐭𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐝𝐨𝐩𝐨 𝐚𝐯𝐞𝐫 𝐦𝐚𝐧𝐠𝐢𝐚𝐭𝐨.'
    ]
  }
}

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num)
}

function getXpNeeded(level) {
  return Math.max(20, level * 20)
}

function randomPick(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function ensureAnimalUser(user) {
  if (typeof user.ciboAnimale !== 'number') user.ciboAnimale = 0
  if (typeof user.lastAnimalAlert !== 'number') user.lastAnimalAlert = 0
}

function updateAnimalState(animale) {
  if (!animale) return { animale: null, alerts: [] }

  const DECAY_HOURS = 6
  const DECAY_MS = DECAY_HOURS * 60 * 60 * 1000
  const now = Date.now()

  if (typeof animale.lastUpdate !== 'number') animale.lastUpdate = now

  const before = {
    salute: Number(animale.salute || 100),
    fame: Number(animale.fame || 100),
    affetto: Number(animale.affetto || 0),
    energia: Number(animale.energia || 100)
  }

  let cycles = Math.floor((now - animale.lastUpdate) / DECAY_MS)
  if (cycles <= 0) {
    animale.salute = clamp(before.salute, 0, 100)
    animale.fame = clamp(before.fame, 0, 100)
    animale.affetto = clamp(before.affetto, 0, 100)
    animale.energia = clamp(before.energia, 0, 100)
    return { animale, alerts: [] }
  }

  while (cycles-- > 0) {
    animale.fame = clamp(Number(animale.fame || 0) - 8, 0, 100)
    animale.energia = clamp(Number(animale.energia || 0) + 5, 0, 100)

    if (animale.fame <= 30) {
      animale.affetto = clamp(Number(animale.affetto || 0) - 2, 0, 100)
    }

    if (animale.fame <= 0) {
      animale.salute = clamp(Number(animale.salute || 0) - 6, 0, 100)
    } else if (animale.fame >= 70 && animale.salute < 100) {
      animale.salute = clamp(Number(animale.salute || 0) + 1, 0, 100)
    }
  }

  animale.lastUpdate = now

  const alerts = []

  if (before.fame > 25 && animale.fame <= 25) {
    alerts.push(`*${animale.emoji} ${animale.nome} 𝐡𝐚 𝐦𝐨𝐥𝐭𝐚 𝐟𝐚𝐦𝐞.*`)
  }

  if (before.salute > 30 && animale.salute <= 30) {
    alerts.push(`*${animale.emoji} ${animale.nome} 𝐧𝐨𝐧 𝐬𝐭𝐚 𝐦𝐨𝐥𝐭𝐨 𝐛𝐞𝐧𝐞.*`)
  }

  animale.salute = clamp(Number(animale.salute || 0), 0, 100)
  animale.fame = clamp(Number(animale.fame || 0), 0, 100)
  animale.affetto = clamp(Number(animale.affetto || 0), 0, 100)
  animale.energia = clamp(Number(animale.energia || 0), 0, 100)

  return { animale, alerts }
}

let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
  ensureAnimalUser(user)

  if (!user.animale) {
    return conn.reply(
      m.chat,
      box(
        '🥫',
        '𝐍𝐔𝐓𝐑𝐈',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐔𝐬𝐚 .shopanimali 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐧𝐞 𝐮𝐧𝐨.*`
      ),
      m
    )
  }

  const { animale, alerts } = updateAnimalState(user.animale)
  user.animale = animale

  if (user.ciboAnimale <= 0) {
    return conn.reply(
      m.chat,
      box(
        '🥫',
        '𝐍𝐔𝐓𝐑𝐈',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐜𝐢𝐛𝐨 𝐩𝐞𝐫 𝐢𝐥 𝐭𝐮𝐨 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐔𝐬𝐚 .shopanimali 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐞 𝐜𝐢𝐛𝐨.*
*🥫 𝐂𝐢𝐛𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${user.ciboAnimale}`
      ),
      m
    )
  }

  const beforeFame = animale.fame
  const beforeAffetto = animale.affetto
  const beforeXp = animale.xp
  const beforeLevel = animale.livello

  user.ciboAnimale -= 1

  animale.fame = clamp(animale.fame + 35, 0, 100)
  animale.affetto = clamp(animale.affetto + 4, 0, 100)
  animale.xp = Number(animale.xp || 0) + 5
  animale.lastFeed = Date.now()
  animale.lastUpdate = Date.now()

  let levelUp = false
  let xpNeeded = getXpNeeded(animale.livello)

  while (animale.xp >= xpNeeded) {
    animale.xp -= xpNeeded
    animale.livello += 1
    animale.salute = clamp(animale.salute + 5, 0, 100)
    animale.energia = clamp(animale.energia + 10, 0, 100)
    levelUp = true
    xpNeeded = getXpNeeded(animale.livello)
  }

  const messages = ANIMALI_MESSAGGI[animale.tipo]?.nutri || [
    '𝐦𝐚𝐧𝐠𝐢𝐚 𝐜𝐨𝐧 𝐠𝐫𝐚𝐧𝐝𝐞 𝐠𝐮𝐬𝐭𝐨.'
  ]

  const moodText = randomPick(messages)

  let alertText = ''
  const now = Date.now()
  if (alerts.length && now - Number(user.lastAnimalAlert || 0) >= 60 * 60 * 1000) {
    user.lastAnimalAlert = now
    alertText = `

*⚠️ 𝐀𝐯𝐯𝐢𝐬𝐢 𝐩𝐫𝐢𝐦𝐚 𝐝𝐞𝐥 𝐩𝐚𝐬𝐭𝐨:*
${alerts.join('\n')}`
  }

  let levelText = ''
  if (levelUp) {
    levelText = `

*🎉 𝐋𝐄𝐕𝐄𝐋 𝐔𝐏!*
*⭐ 𝐋𝐢𝐯𝐞𝐥𝐥𝐨:* ${beforeLevel} ➜ ${animale.livello}`
  }

  const body = `*${animale.emoji} 𝐀𝐧𝐢𝐦𝐚𝐥𝐞:* ${animale.nome} (${animale.tipo})
*🥫 𝐂𝐢𝐛𝐨 𝐮𝐬𝐚𝐭𝐨:* 1
*🍖 𝐅𝐚𝐦𝐞:* ${beforeFame} ➜ ${animale.fame}
*💞 𝐀𝐟𝐟𝐞𝐭𝐭𝐨:* ${beforeAffetto} ➜ ${animale.affetto}
*✨ 𝐗𝐏:* ${beforeXp} ➜ ${animale.xp}/${getXpNeeded(animale.livello)}
*🥫 𝐂𝐢𝐛𝐨 𝐫𝐢𝐦𝐚𝐬𝐭𝐨:* ${user.ciboAnimale}

*💬 ${animale.nome}* ${moodText}${levelText}${alertText}`

  await conn.sendMessage(m.chat, {
    text: box('🥫', '𝐍𝐔𝐓𝐑𝐈', body),
    footer: '',
    buttons: [
      {
        buttonId: '.animale',
        buttonText: { displayText: '🐾 Stato animale' },
        type: 1
      },
      {
        buttonId: '.shopanimali',
        buttonText: { displayText: '🛒 Shop animali' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['nutri']
handler.tags = ['rpg']
handler.command = /^(nutri|daicibo)$/i

export default handler