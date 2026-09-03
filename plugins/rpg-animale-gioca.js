// Plugin AnimaleGioca by Bonzino

const ANIMALI_MESSAGGI = {
  Gatto: {
    gioca: [
      '𝐢𝐧𝐬𝐞𝐠𝐮𝐞 𝐭𝐮𝐭𝐭𝐨 𝐪𝐮𝐞𝐥𝐥𝐨 𝐜𝐡𝐞 𝐬𝐢 𝐦𝐮𝐨𝐯𝐞 𝐞 𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞 𝐮𝐧 𝐬𝐚𝐜𝐜𝐨.',
      '𝐬𝐚𝐥𝐭𝐚 𝐚𝐠𝐢𝐥𝐦𝐞𝐧𝐭𝐞 𝐢𝐧 𝐠𝐢𝐫𝐨 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐜𝐨𝐧 𝐭𝐞.',
      '𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐞 𝐩𝐨𝐢 𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐬𝐨𝐝𝐝𝐢𝐬𝐟𝐚𝐭𝐭𝐨.'
    ],
    stanco: [
      '𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞, 𝐦𝐚 𝐩𝐨𝐢 𝐬𝐢 𝐬𝐝𝐫𝐚𝐢𝐚 𝐩𝐞𝐫 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.',
      '𝐠𝐢𝐨𝐜𝐚 𝐮𝐧 𝐩𝐨’ 𝐦𝐚 𝐬𝐢 𝐬𝐭𝐚𝐧𝐜𝐚 𝐩𝐫𝐞𝐬𝐭𝐨.'
    ]
  },
  Cane: {
    gioca: [
      '𝐜𝐨𝐫𝐫𝐞 𝐨𝐯𝐮𝐧𝐪𝐮𝐞 𝐩𝐢𝐞𝐧𝐨 𝐝𝐢 𝐞𝐧𝐞𝐫𝐠𝐢𝐚.',
      '𝐬𝐜𝐨𝐝𝐢𝐧𝐳𝐨𝐥𝐚 𝐞 𝐬𝐚𝐥𝐭𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐦𝐞𝐧𝐭𝐫𝐞 𝐠𝐢𝐨𝐜𝐚 𝐜𝐨𝐧 𝐭𝐞.',
      '𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞 𝐭𝐚𝐧𝐭𝐢𝐬𝐬𝐢𝐦𝐨 𝐞 𝐧𝐨𝐧 𝐯𝐨𝐫𝐫𝐞𝐛𝐛𝐞 𝐟𝐞𝐫𝐦𝐚𝐫𝐬𝐢.'
    ],
    stanco: [
      '𝐠𝐢𝐨𝐜𝐚 𝐯𝐨𝐥𝐞𝐧𝐭𝐢𝐞𝐫𝐢, 𝐦𝐚 𝐩𝐨𝐢 𝐬𝐢 𝐟𝐞𝐫𝐦𝐚 𝐚 𝐫𝐢𝐩𝐫𝐞𝐧𝐝𝐞𝐫𝐞 𝐟𝐢𝐚𝐭𝐨.',
      '𝐝𝐨𝐩𝐨 𝐮𝐧 𝐩𝐨’ 𝐝𝐢 𝐠𝐢𝐨𝐜𝐨 𝐬𝐢 𝐬𝐝𝐫𝐚𝐢𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨 𝐦𝐚 𝐬𝐭𝐚𝐧𝐜𝐨.'
    ]
  },
  Coniglio: {
    gioca: [
      '𝐬𝐚𝐥𝐭𝐞𝐥𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐚𝐭𝐭𝐨𝐫𝐧𝐨 𝐚 𝐭𝐞.',
      '𝐬𝐢 𝐦𝐮𝐨𝐯𝐞 𝐯𝐞𝐥𝐨𝐜𝐞 𝐞 𝐩𝐨𝐢 𝐬𝐢 𝐟𝐞𝐫𝐦𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.',
      '𝐠𝐢𝐨𝐜𝐡𝐞𝐫𝐞𝐥𝐥𝐚 𝐚𝐥𝐥𝐞𝐠𝐫𝐨 𝐞 𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞 𝐜𝐨𝐧 𝐭𝐞.'
    ],
    stanco: [
      '𝐟𝐚 𝐪𝐮𝐚𝐥𝐜𝐡𝐞 𝐬𝐚𝐥𝐭𝐞𝐥𝐥𝐨 𝐦𝐚 𝐩𝐨𝐢 𝐯𝐮𝐨𝐥𝐞 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.',
      '𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞, 𝐦𝐚 𝐩𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐞 𝐫𝐞𝐬𝐭𝐚𝐫𝐞 𝐜𝐚𝐥𝐦𝐨.'
    ]
  },
  Tartaruga: {
    gioca: [
      '𝐚𝐯𝐚𝐧𝐳𝐚 𝐩𝐢𝐚𝐧𝐨 𝐦𝐚 𝐬𝐞𝐦𝐛𝐫𝐚 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚𝐫𝐞 𝐢𝐥 𝐭𝐞𝐦𝐩𝐨 𝐜𝐨𝐧 𝐭𝐞.',
      '𝐬𝐢 𝐦𝐮𝐨𝐯𝐞 𝐜𝐨𝐧 𝐜𝐚𝐥𝐦𝐚, 𝐦𝐚 𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞 𝐚 𝐦𝐨𝐝𝐨 𝐬𝐮𝐨.',
      '𝐭𝐢 𝐬𝐞𝐠𝐮𝐞 𝐩𝐢𝐚𝐧𝐨 𝐞 𝐬𝐞𝐦𝐛𝐫𝐚 𝐩𝐢ù 𝐬𝐞𝐫𝐞𝐧𝐚.'
    ],
    stanco: [
      '𝐡𝐚 𝐯𝐨𝐠𝐥𝐢𝐚 𝐝𝐢 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞 𝐧𝐞𝐥 𝐬𝐮𝐨 𝐠𝐮𝐬𝐜𝐢𝐨.',
      '𝐬𝐢 𝐟𝐞𝐫𝐦𝐚 𝐪𝐮𝐚𝐬𝐢 𝐬𝐮𝐛𝐢𝐭𝐨 𝐩𝐞𝐫 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.'
    ]
  },
  Pappagallo: {
    gioca: [
      '𝐜𝐢𝐧𝐠𝐮𝐞𝐭𝐭𝐚 𝐞𝐧𝐭𝐮𝐬𝐢𝐚𝐬𝐭𝐚 𝐦𝐞𝐧𝐭𝐫𝐞 𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞.',
      '𝐬𝐛𝐚𝐭𝐭𝐞 𝐥𝐞 𝐚𝐥𝐢 𝐞 𝐠𝐢𝐨𝐜𝐚 𝐜𝐨𝐧 𝐯𝐢𝐯𝐚𝐜𝐢𝐭à.',
      '𝐟𝐢𝐬𝐜𝐡𝐢𝐞𝐭𝐭𝐚 𝐟𝐞𝐥𝐢𝐜𝐞 𝐝𝐨𝐩𝐨 𝐮𝐧 𝐛𝐞𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨 𝐝𝐢 𝐠𝐢𝐨𝐜𝐨.'
    ],
    stanco: [
      '𝐠𝐢𝐨𝐜𝐚 𝐮𝐧 𝐩𝐨’, 𝐦𝐚 𝐩𝐨𝐢 𝐬𝐢 𝐟𝐞𝐫𝐦𝐚 𝐬𝐮𝐥 𝐬𝐮𝐨 𝐩𝐨𝐬𝐚𝐭𝐨𝐢𝐨.',
      '𝐬𝐢 𝐝𝐢𝐯𝐞𝐫𝐭𝐞, 𝐦𝐚 𝐨𝐫𝐚 𝐯𝐮𝐨𝐥𝐞 𝐬𝐭𝐚𝐫𝐞 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐨.'
    ]
  }
}

const PLAY_COOLDOWN = 15 * 60 * 1000

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
        '🦴',
        '𝐆𝐈𝐎𝐂𝐀',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐔𝐬𝐚 .shopanimali 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐧𝐞 𝐮𝐧𝐨.*`
      ),
      m
    )
  }

  const { animale, alerts } = updateAnimalState(user.animale)
  user.animale = animale

  if (typeof animale.lastPlay !== 'number') animale.lastPlay = 0

  const remaining = PLAY_COOLDOWN - (Date.now() - animale.lastPlay)
  if (remaining > 0) {
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)

    return conn.reply(
      m.chat,
      box(
        '⏳',
        '𝐆𝐈𝐎𝐂𝐀',
        `*𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚:* ${minutes}𝐦 ${seconds}𝐬

*${animale.emoji} ${animale.nome} 𝐬𝐭𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐫𝐢𝐩𝐫𝐞𝐧𝐝𝐞𝐧𝐝𝐨 𝐟𝐢𝐚𝐭𝐨.*`
      ),
      m
    )
  }

  const beforeEnergia = animale.energia
  const beforeFame = animale.fame
  const beforeAffetto = animale.affetto
  const beforeXp = animale.xp
  const beforeLevel = animale.livello

  let affettoGain = 6
  let xpGain = 7
  let fameLoss = 6
  let energiaLoss = 12
  let eventText = ''
  let mode = 'normal'

  if (animale.energia <= 20) {
    affettoGain = 2
    xpGain = 2
    fameLoss = 3
    energiaLoss = 4
    mode = 'stanco'
  } else {
    const roll = Math.random()

    if (roll < 0.15) {
      affettoGain += 4
      xpGain += 5
      fameLoss += 2
      energiaLoss += 4
      eventText = `*🎁 𝐄𝐯𝐞𝐧𝐭𝐨 𝐬𝐩𝐞𝐜𝐢𝐚𝐥𝐞:* ${animale.emoji} ${animale.nome} 𝐬𝐢 è 𝐝𝐢𝐯𝐞𝐫𝐭𝐢𝐭𝐨 𝐭𝐚𝐧𝐭𝐢𝐬𝐬𝐢𝐦𝐨!`
    } else if (roll < 0.25) {
      affettoGain += 1
      xpGain += 1
      eventText = `*✨ 𝐄𝐯𝐞𝐧𝐭𝐨:* ${animale.emoji} ${animale.nome} 𝐬𝐞𝐦𝐛𝐫𝐚 𝐝𝐢 𝐨𝐭𝐭𝐢𝐦𝐨 𝐮𝐦𝐨𝐫𝐞.`
    } else if (roll < 0.30) {
      fameLoss += 3
      energiaLoss += 3
      eventText = `*😵 𝐄𝐯𝐞𝐧𝐭𝐨:* ${animale.emoji} ${animale.nome} 𝐬𝐢 è 𝐬𝐭𝐚𝐧𝐜𝐚𝐭𝐨 𝐩𝐢ù 𝐝𝐞𝐥 𝐬𝐨𝐥𝐢𝐭𝐨.`
    }
  }

  animale.affetto = clamp(animale.affetto + affettoGain, 0, 100)
  animale.xp = Number(animale.xp || 0) + xpGain
  animale.fame = clamp(animale.fame - fameLoss, 0, 100)
  animale.energia = clamp(animale.energia - energiaLoss, 0, 100)
  animale.lastPlay = Date.now()
  animale.lastUpdate = Date.now()

  let levelUp = false
  let xpNeeded = getXpNeeded(animale.livello)

  while (animale.xp >= xpNeeded) {
    animale.xp -= xpNeeded
    animale.livello += 1
    animale.salute = clamp(animale.salute + 4, 0, 100)
    animale.energia = clamp(animale.energia + 8, 0, 100)
    levelUp = true
    xpNeeded = getXpNeeded(animale.livello)
  }

  const animalMessages = ANIMALI_MESSAGGI[animale.tipo] || ANIMALI_MESSAGGI.Gatto
  const playText = mode === 'stanco'
    ? randomPick(animalMessages.stanco)
    : randomPick(animalMessages.gioca)

  let alertText = ''
  const now = Date.now()
  if (alerts.length && now - Number(user.lastAnimalAlert || 0) >= 60 * 60 * 1000) {
    user.lastAnimalAlert = now
    alertText = `

*⚠️ 𝐀𝐯𝐯𝐢𝐬𝐢 𝐩𝐫𝐢𝐦𝐚 𝐝𝐞𝐥 𝐠𝐢𝐨𝐜𝐨:*
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
*🍖 𝐅𝐚𝐦𝐞:* ${beforeFame} ➜ ${animale.fame}
*⚡ 𝐄𝐧𝐞𝐫𝐠𝐢𝐚:* ${beforeEnergia} ➜ ${animale.energia}

*💬 ${animale.nome}* ${playText}${eventText ? `

${eventText}` : ''}${levelText}${alertText}`

  await conn.sendMessage(m.chat, {
    text: box('🦴', '𝐆𝐈𝐎𝐂𝐀', body),
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

handler.help = ['gioca']
handler.tags = ['rpg']
handler.command = /^(gioca)$/i

export default handler