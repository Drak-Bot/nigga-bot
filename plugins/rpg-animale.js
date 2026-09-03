// Plugin Animale by Bonzino

const ANIMALI = {
  Gatto: {
    emoji: '🐱',
    colore: '𝐆𝐚𝐭𝐭𝐨',
    mood: {
      high: '𝐟𝐚 𝐥𝐞 𝐟𝐮𝐬𝐚 𝐟𝐞𝐥𝐢𝐜𝐞.',
      medium: '𝐭𝐢 𝐨𝐬𝐬𝐞𝐫𝐯𝐚 𝐜𝐨𝐧 𝐜𝐚𝐥𝐦𝐚.',
      low: '𝐬𝐢 𝐚𝐫𝐫𝐨𝐭𝐨𝐥𝐚 𝐢𝐧 𝐬𝐢𝐥𝐞𝐧𝐳𝐢𝐨.'
    }
  },
  Cane: {
    emoji: '🐶',
    colore: '𝐂𝐚𝐧𝐞',
    mood: {
      high: '𝐬𝐜𝐨𝐝𝐢𝐧𝐳𝐨𝐥𝐚 𝐭𝐮𝐭𝐭𝐨 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨.',
      medium: '𝐭𝐢 𝐠𝐮𝐚𝐫𝐝𝐚 𝐢𝐧 𝐚𝐭𝐭𝐞𝐬𝐚.',
      low: '𝐬𝐢 𝐬𝐝𝐫𝐚𝐢𝐚 𝐩𝐞𝐫 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.'
    }
  },
  Coniglio: {
    emoji: '🐰',
    colore: '𝐂𝐨𝐧𝐢𝐠𝐥𝐢𝐨',
    mood: {
      high: '𝐬𝐚𝐥𝐭𝐞𝐥𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐞.',
      medium: '𝐬𝐢 𝐦𝐮𝐨𝐯𝐞 𝐜𝐨𝐧 𝐜𝐚𝐮𝐭𝐞𝐥𝐚.',
      low: '𝐬𝐢 𝐚𝐜𝐜𝐮𝐜𝐜𝐢𝐚 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐨.'
    }
  },
  Tartaruga: {
    emoji: '🐢',
    colore: '𝐓𝐚𝐫𝐭𝐚𝐫𝐮𝐠𝐚',
    mood: {
      high: '𝐚𝐯𝐚𝐧𝐳𝐚 𝐩𝐢𝐚𝐧𝐨 𝐦𝐚 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐚.',
      medium: '𝐭𝐢 𝐨𝐬𝐬𝐞𝐫𝐯𝐚 𝐝𝐚𝐥 𝐬𝐮𝐨 𝐠𝐮𝐬𝐜𝐢𝐨.',
      low: '𝐬𝐢 𝐫𝐢𝐭𝐫𝐚𝐞 𝐩𝐞𝐫 𝐫𝐢𝐩𝐨𝐬𝐚𝐫𝐞.'
    }
  },
  Pappagallo: {
    emoji: '🦜',
    colore: '𝐏𝐚𝐩𝐩𝐚𝐠𝐚𝐥𝐥𝐨',
    mood: {
      high: '𝐜𝐢𝐧𝐠𝐮𝐞𝐭𝐭𝐚 𝐞𝐧𝐭𝐮𝐬𝐢𝐚𝐬𝐭𝐚.',
      medium: '𝐢𝐧𝐜𝐥𝐢𝐧𝐚 𝐥𝐚 𝐭𝐞𝐬𝐭𝐚 𝐜𝐨𝐧 𝐜𝐮𝐫𝐢𝐨𝐬𝐢𝐭à.',
      low: '𝐫𝐞𝐬𝐭𝐚 𝐳𝐢𝐭𝐭𝐨 𝐬𝐮𝐥 𝐬𝐮𝐨 𝐩𝐨𝐬𝐚𝐭𝐨𝐢𝐨.'
    }
  }
}

const DECAY_HOURS = 6
const DECAY_MS = DECAY_HOURS * 60 * 60 * 1000

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function formatBar(value) {
  const total = 10
  const filled = Math.round((clamp(value, 0, 100) / 100) * total)
  return `${'█'.repeat(filled)}${'░'.repeat(total - filled)}`
}

function statusLabel(value) {
  if (value >= 80) return '𝐎𝐭𝐭𝐢𝐦𝐨'
  if (value >= 55) return '𝐁𝐮𝐨𝐧𝐨'
  if (value >= 30) return '𝐌𝐞𝐝𝐢𝐨'
  if (value >= 10) return '𝐁𝐚𝐬𝐬𝐨'
  return '𝐂𝐫𝐢𝐭𝐢𝐜𝐨'
}

function getMood(animale) {
  const data = ANIMALI[animale.tipo] || ANIMALI.Gatto
  const mix = Math.round((animale.salute + animale.affetto + animale.energia) / 3)
  if (mix >= 70) return data.mood.high
  if (mix >= 35) return data.mood.medium
  return data.mood.low
}

function getXpNeeded(level) {
  return Math.max(20, level * 20)
}

function ensureAnimalUser(user) {
  if (typeof user.ciboAnimale !== 'number') user.ciboAnimale = 0
  if (typeof user.lastAnimalAlert !== 'number') user.lastAnimalAlert = 0
}

function updateAnimalState(animale) {
  if (!animale) return { animale: null, alerts: [] }

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

  if (before.affetto > 20 && animale.affetto <= 20) {
    alerts.push(`*${animale.emoji} ${animale.nome} 𝐬𝐢 𝐬𝐞𝐧𝐭𝐞 𝐮𝐧 𝐩𝐨’ 𝐭𝐫𝐚𝐬𝐜𝐮𝐫𝐚𝐭𝐨.*`)
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
        '🐾',
        '𝐀𝐍𝐈𝐌𝐀𝐋𝐄',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐏𝐫𝐨𝐜𝐮𝐫𝐚𝐭𝐞𝐧𝐞 𝐮𝐧𝐨 𝐜𝐨𝐧 𝐥𝐨 𝐬𝐡𝐨𝐩 𝐚𝐧𝐢𝐦𝐚𝐥𝐢.*`
      ),
      m
    )
  }

  const { animale, alerts } = updateAnimalState(user.animale)
  user.animale = animale

  const data = ANIMALI[animale.tipo] || ANIMALI.Gatto
  const xpNeeded = getXpNeeded(Number(animale.livello || 1))
  const moodText = getMood(animale)

  let alertText = ''
  const now = Date.now()
  if (alerts.length && now - Number(user.lastAnimalAlert || 0) >= 60 * 60 * 1000) {
    user.lastAnimalAlert = now
    alertText = `

*⚠️ 𝐀𝐯𝐯𝐢𝐬𝐢:*
${alerts.join('\n')}`
  }

  const body = `*${data.emoji} 𝐓𝐢𝐩𝐨:* ${data.colore}
*🏷️ 𝐍𝐨𝐦𝐞:* ${animale.nome}
*❤️ 𝐒𝐚𝐥𝐮𝐭𝐞:* ${animale.salute}/100
*${formatBar(animale.salute)}* *(${statusLabel(animale.salute)})*

*🍖 𝐅𝐚𝐦𝐞:* ${animale.fame}/100
*${formatBar(animale.fame)}* *(${statusLabel(animale.fame)})*

*💞 𝐀𝐟𝐟𝐞𝐭𝐭𝐨:* ${animale.affetto}/100
*${formatBar(animale.affetto)}* *(${statusLabel(animale.affetto)})*

*⚡ 𝐄𝐧𝐞𝐫𝐠𝐢𝐚:* ${animale.energia}/100
*${formatBar(animale.energia)}* *(${statusLabel(animale.energia)})*

*⭐ 𝐋𝐢𝐯𝐞𝐥𝐥𝐨:* ${animale.livello}
*✨ 𝐗𝐏:* ${animale.xp}/${xpNeeded}
*🥫 𝐂𝐢𝐛𝐨 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞:* ${user.ciboAnimale}

*💬 𝐔𝐦𝐨𝐫𝐞:* ${moodText}${alertText}`

  await conn.reply(
    m.chat,
    box('🐾', '𝐀𝐍𝐈𝐌𝐀𝐋𝐄', body),
    m
  )
}

handler.help = ['animale']
handler.tags = ['rpg']
handler.command = /^(animale)$/i

export default handler