//Plugin AccarezzaAnimale by Bonzino

const ANIMALI_MESSAGGI = {
  Gatto: {
    carezza: [
      '𝐟𝐚 𝐥𝐞 𝐟𝐮𝐬𝐚 𝐞 𝐬𝐢 𝐬𝐭𝐫𝐮𝐬𝐜𝐢𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.',
      '𝐜𝐡𝐢𝐮𝐝𝐞 𝐠𝐥𝐢 𝐨𝐜𝐜𝐡𝐢 𝐞 𝐬𝐢 𝐫𝐢𝐥𝐚𝐬𝐬𝐚 𝐬𝐨𝐭𝐭𝐨 𝐥𝐚 𝐭𝐮𝐚 𝐦𝐚𝐧𝐨.',
      '𝐦𝐢𝐚𝐠𝐨𝐥𝐚 𝐝𝐨𝐥𝐜𝐞𝐦𝐞𝐧𝐭𝐞 𝐩𝐞𝐫 𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐢𝐭à.'
    ],
    rifiuta: [
      '𝐬𝐢 𝐬𝐩𝐨𝐬𝐭𝐚 𝐩𝐞𝐫𝐜𝐡é 𝐧𝐨𝐧 𝐡𝐚 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.',
      '𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐦𝐚 𝐩𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐞 𝐫𝐞𝐬𝐭𝐚𝐫𝐞 𝐝𝐚 𝐬𝐨𝐥𝐨.',
      '𝐬𝐢 𝐚𝐥𝐥𝐨𝐧𝐭𝐚𝐧𝐚 𝐩𝐢𝐚𝐧𝐨 𝐬𝐞𝐧𝐳𝐚 𝐟𝐚𝐫𝐬𝐢 𝐚𝐜𝐜𝐚𝐫𝐞𝐳𝐳𝐚𝐫𝐞.'
    ]
  },
  Cane: {
    carezza: [
      '𝐬𝐜𝐨𝐝𝐢𝐧𝐳𝐨𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐚𝐥𝐥𝐞 𝐭𝐮𝐞 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.',
      '𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐞 𝐬𝐢 𝐚𝐯𝐯𝐢𝐜𝐢𝐧𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐝𝐢 𝐩𝐢ù.',
      '𝐬𝐢 𝐫𝐢𝐥𝐚𝐬𝐬𝐚 𝐬𝐨𝐭𝐭𝐨 𝐥𝐞 𝐭𝐮𝐞 𝐜𝐚𝐫𝐞𝐳𝐳𝐞.'
    ],
    rifiuta: [
      '𝐬𝐞𝐦𝐛𝐫𝐚 𝐝𝐢𝐬𝐭𝐫𝐚𝐭𝐭𝐨 𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐭𝐚𝐧𝐭𝐚 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.',
      '𝐬𝐢 𝐬𝐝𝐫𝐚𝐢𝐚 𝐦𝐚 𝐬𝐞𝐦𝐛𝐫𝐚 𝐯𝐨𝐥𝐞𝐫 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.',
      '𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐦𝐚 𝐧𝐨𝐧 𝐫𝐞𝐚𝐠𝐢𝐬𝐜𝐞 𝐦𝐨𝐥𝐭𝐨.'
    ]
  },
  Coniglio: {
    carezza: [
      '𝐬𝐢 𝐚𝐜𝐜𝐨𝐜𝐜𝐨𝐥𝐚 𝐞 𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚𝐫𝐞 𝐥𝐚 𝐭𝐞𝐧𝐞𝐫𝐞𝐳𝐳𝐚.',
      '𝐫𝐞𝐬𝐭𝐚 𝐜𝐚𝐥𝐦𝐨 𝐞 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐨 𝐯𝐢𝐜𝐢𝐧𝐨 𝐚 𝐭𝐞.',
      '𝐦𝐮𝐨𝐯𝐞 𝐢𝐥 𝐦𝐮𝐬𝐞𝐭𝐭𝐨 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.'
    ],
    rifiuta: [
      '𝐬𝐞𝐦𝐛𝐫𝐚 𝐯𝐨𝐥𝐞𝐫 𝐬𝐭𝐚𝐫𝐞 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐨 𝐩𝐞𝐫 𝐜𝐨𝐧𝐭𝐨 𝐬𝐮𝐨.',
      '𝐫𝐞𝐬𝐭𝐚 𝐝𝐢𝐬𝐭𝐚𝐧𝐭𝐞 𝐞 𝐩𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐞 𝐧𝐨𝐧 𝐞𝐬𝐬𝐞𝐫𝐞 𝐭𝐨𝐜𝐜𝐚𝐭𝐨.',
      '𝐬𝐢 𝐟𝐞𝐫𝐦𝐚 𝐦𝐚 𝐧𝐨𝐧 𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐯𝐞𝐫𝐞 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.'
    ]
  },
  Tartaruga: {
    carezza: [
      '𝐬𝐛𝐢𝐫𝐜𝐢𝐚 𝐝𝐚𝐥 𝐠𝐮𝐬𝐜𝐢𝐨 𝐞 𝐫𝐞𝐬𝐭𝐚 𝐜𝐚𝐥𝐦𝐚.',
      '𝐬𝐢 𝐫𝐢𝐥𝐚𝐬𝐬𝐚 𝐩𝐢𝐚𝐧𝐨 𝐬𝐨𝐭𝐭𝐨 𝐥𝐚 𝐭𝐮𝐚 𝐩𝐫𝐞𝐬𝐞𝐧𝐳𝐚.',
      '𝐭𝐢 𝐨𝐬𝐬𝐞𝐫𝐯𝐚 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐚 𝐞 𝐬𝐞𝐫𝐞𝐧𝐚.'
    ],
    rifiuta: [
      '𝐩𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐞 𝐫𝐢𝐭𝐫𝐚𝐫𝐬𝐢 𝐧𝐞𝐥 𝐬𝐮𝐨 𝐠𝐮𝐬𝐜𝐢𝐨.',
      '𝐫𝐞𝐬𝐭𝐚 𝐟𝐞𝐫𝐦𝐚 𝐞 𝐧𝐨𝐧 𝐬𝐞𝐦𝐛𝐫𝐚 𝐯𝐨𝐥𝐞𝐫𝐞 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.',
      '𝐧𝐨𝐧 𝐬𝐢 𝐚𝐯𝐯𝐢𝐜𝐢𝐧𝐚 𝐞 𝐯𝐮𝐨𝐥𝐞 𝐬𝐭𝐚𝐫𝐞 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐚.'
    ]
  },
  Pappagallo: {
    carezza: [
      '𝐢𝐧𝐜𝐥𝐢𝐧𝐚 𝐥𝐚 𝐭𝐞𝐬𝐭𝐚 𝐞 𝐜𝐢𝐧𝐠𝐮𝐞𝐭𝐭𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.',
      '𝐬𝐢 𝐫𝐢𝐥𝐚𝐬𝐬𝐚 𝐬𝐮𝐥 𝐬𝐮𝐨 𝐩𝐨𝐬𝐚𝐭𝐨𝐢𝐨 𝐞 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚 𝐥𝐚 𝐭𝐮𝐚 𝐜𝐮𝐫𝐚.',
      '𝐟𝐢𝐬𝐜𝐡𝐢𝐞𝐭𝐭𝐚 𝐝𝐨𝐥𝐜𝐞𝐦𝐞𝐧𝐭𝐞 𝐝𝐨𝐩𝐨 𝐥𝐚 𝐜𝐨𝐜𝐜𝐨𝐥𝐚.'
    ],
    rifiuta: [
      '𝐭𝐢 𝐨𝐬𝐬𝐞𝐫𝐯𝐚 𝐦𝐚 𝐩𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐞 𝐫𝐞𝐬𝐭𝐚𝐫𝐞 𝐬𝐮𝐥 𝐬𝐮𝐨 𝐩𝐨𝐬𝐚𝐭𝐨𝐢𝐨.',
      '𝐧𝐨𝐧 𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐯𝐞𝐫𝐞 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐜𝐨𝐜𝐜𝐨𝐥𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐦𝐨𝐦𝐞𝐧𝐭𝐨.',
      '𝐫𝐞𝐬𝐭𝐚 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐨 𝐞 𝐧𝐨𝐧 𝐜𝐞𝐫𝐜𝐚 𝐜𝐨𝐧𝐭𝐚𝐭𝐭𝐨.'
    ]
  }
}

const CAREZZA_COOLDOWN = 10 * 60 * 1000

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getXpNeeded(level) {
  return Math.max(20, level * 20)
}

function randomPick(arr = []) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function ensureAnimalUser(user) {
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
        '🤲',
        '𝐀𝐂𝐂𝐀𝐑𝐄𝐙𝐙𝐀',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐔𝐬𝐚 .shopanimali 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐧𝐞 𝐮𝐧𝐨.*`
      ),
      m
    )
  }

  const { animale, alerts } = updateAnimalState(user.animale)
  user.animale = animale

  if (typeof animale.lastCare !== 'number') animale.lastCare = 0

  const remaining = CAREZZA_COOLDOWN - (Date.now() - animale.lastCare)
  if (remaining > 0) {
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)

    return conn.reply(
      m.chat,
      box(
        '⏳',
        '𝐀𝐂𝐂𝐀𝐑𝐄𝐙𝐙𝐀',
        `*𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚:* ${minutes}𝐦 ${seconds}𝐬

*${animale.emoji} ${animale.nome} 𝐬𝐢 𝐬𝐭𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐠𝐨𝐝𝐞𝐧𝐝𝐨 𝐥𝐞 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.*`
      ),
      m
    )
  }

  const beforeAffetto = animale.affetto
  const beforeXp = animale.xp
  const beforeLevel = animale.livello

  animale.lastCare = Date.now()
  animale.lastUpdate = Date.now()

  const failChance = Math.random()
  const badCondition = animale.fame <= 15 || animale.energia <= 10 || animale.salute <= 20

  if (failChance < 0.15) {
    const failMessages = ANIMALI_MESSAGGI[animale.tipo]?.rifiuta || [
      '𝐧𝐨𝐧 𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐯𝐞𝐫𝐞 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐜𝐨𝐜𝐜𝐨𝐥𝐞.'
    ]

    if (badCondition) {
      animale.affetto = clamp(animale.affetto - 1, 0, 100)
    }

    let alertText = ''
    const now = Date.now()
    if (alerts.length && now - Number(user.lastAnimalAlert || 0) >= 60 * 60 * 1000) {
      user.lastAnimalAlert = now
      alertText = `

*⚠️ 𝐀𝐯𝐯𝐢𝐬𝐢:*
${alerts.join('\n')}`
    }

    return conn.sendMessage(m.chat, {
      text: box(
        '🤲',
        '𝐀𝐂𝐂𝐀𝐑𝐄𝐙𝐙𝐀',
        `*${animale.emoji} ${animale.nome}* ${randomPick(failMessages)}

*💞 𝐀𝐟𝐟𝐞𝐭𝐭𝐨:* ${beforeAffetto} ➜ ${animale.affetto}${
          badCondition ? `

*⚠️ 𝐍𝐨𝐧 𝐞𝐫𝐚 𝐢𝐧 𝐝𝐢𝐬𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐠𝐢𝐮𝐬𝐭𝐚.*` : ''
        }${alertText}`
      ),
      footer: '',
      buttons: [
        {
          buttonId: '.animale',
          buttonText: { displayText: '🐾 Stato animale' },
          type: 1
        },
        {
          buttonId: '.nutri',
          buttonText: { displayText: '🥫 Nutri' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })
  }

  let affettoGain = 3
  let xpGain = 2

  if (animale.energia <= 15) {
    affettoGain = 2
    xpGain = 1
  }

  animale.affetto = clamp(animale.affetto + affettoGain, 0, 100)
  animale.xp = Number(animale.xp || 0) + xpGain

  let levelUp = false
  let xpNeeded = getXpNeeded(animale.livello)

  while (animale.xp >= xpNeeded) {
    animale.xp -= xpNeeded
    animale.livello += 1
    animale.salute = clamp(animale.salute + 3, 0, 100)
    animale.energia = clamp(animale.energia + 5, 0, 100)
    levelUp = true
    xpNeeded = getXpNeeded(animale.livello)
  }

  const animalMessages = ANIMALI_MESSAGGI[animale.tipo]?.carezza || [
    '𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚𝐫𝐞 𝐥𝐚 𝐭𝐮𝐚 𝐜𝐨𝐜𝐜𝐨𝐥𝐚.'
  ]

  const careText = randomPick(animalMessages)

  let alertText = ''
  const now = Date.now()
  if (alerts.length && now - Number(user.lastAnimalAlert || 0) >= 60 * 60 * 1000) {
    user.lastAnimalAlert = now
    alertText = `

*⚠️ 𝐀𝐯𝐯𝐢𝐬𝐢 𝐩𝐫𝐢𝐦𝐚 𝐝𝐞𝐥𝐥𝐚 𝐜𝐨𝐜𝐜𝐨𝐥𝐚:*
${alerts.join('\n')}`
  }

  let levelText = ''
  if (levelUp) {
    levelText = `

*🎉 𝐋𝐄𝐕𝐄𝐋 𝐔𝐏!*
*⭐ 𝐋𝐢𝐯𝐞𝐥𝐥𝐨:* ${beforeLevel} ➜ ${animale.livello}`
  }

  const body = `*${animale.emoji} 𝐀𝐧𝐢𝐦𝐚𝐥𝐞:* ${animale.nome} (${animale.tipo})
*💞 𝐀𝐟𝐟𝐞𝐭𝐭𝐨:* ${beforeAffetto} ➜ ${animale.affetto}
*✨ 𝐗𝐏:* ${beforeXp} ➜ ${animale.xp}/${getXpNeeded(animale.livello)}

*💬 ${animale.nome}* ${careText}${levelText}${alertText}`

  await conn.sendMessage(m.chat, {
    text: box('🤲', '𝐀𝐂𝐂𝐀𝐑𝐄𝐙𝐙𝐀', body),
    footer: '',
    buttons: [
      {
        buttonId: '.animale',
        buttonText: { displayText: '🐾 Stato animale' },
        type: 1
      },
      {
        buttonId: '.gioca',
        buttonText: { displayText: '🦴 Gioca' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['accarezza']
handler.tags = ['rpg']
handler.command = /^(accarezza|coccola)$/i

export default handler