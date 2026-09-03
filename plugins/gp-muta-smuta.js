import { createMuteCard } from '../lib/cards/mute-card.js'

function normalizeJid(jid = '') {
  if (!jid) return null
  if (jid.includes('@s.whatsapp.net')) return jid
  if (jid.includes('@lid')) return jid

  const clean = String(jid).replace(/[^0-9]/g, '')
  if (clean.length > 5) return clean + '@s.whatsapp.net'

  return null
}

function cleanJid(jid = '') {
  return String(jid || '').replace(/[^0-9]/g, '')
}

function isOwnerJid(jid = '') {
  const num = cleanJid(jid)

  return (global.owner || []).some(owner => {
    const ownerNum = Array.isArray(owner)
      ? cleanJid(owner[0])
      : cleanJid(owner)

    return ownerNum === num
  })
}

function getMentioned(m) {
  return (
    m.mentionedJid?.[0] ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
    m.msg?.contextInfo?.mentionedJid?.[0] ||
    null
  )
}

function resolveTarget(m, text = '') {
  const mentioned = getMentioned(m)

  if (mentioned) return normalizeJid(mentioned)

  if (m.quoted?.sender) return normalizeJid(m.quoted.sender)

  const clean = String(text || '').replace(/[^0-9]/g, '')

  if (clean.length > 5) return normalizeJid(clean)

  return null
}

function resolveAction(m, command = '') {
  const cmd = String(command || '').toLowerCase().replace(/^[.!/#]/, '')
  const body = String(
    m.text ||
    m.body ||
    m.message?.conversation ||
    ''
  ).toLowerCase().trim()

  if (cmd === 'muta') return true
  if (cmd === 'smuta') return false

  if (/^[.!/#]smuta(\s|$)/i.test(body)) return false
  if (/^[.!/#]muta(\s|$)/i.test(body)) return true

  return null
}

function ensureChatMuteStore(chat) {
  global.db.data.chats ||= {}
  global.db.data.chats[chat] ||= {}
  global.db.data.chats[chat].mutedUsers ||= {}

  return global.db.data.chats[chat].mutedUsers
}

function parseDuration(text = '') {
  const match = String(text)
    .toLowerCase()
    .match(/(?:^|\s)(\d+)\s*(m|min|minuti|h|ore|ora|d|giorni|giorno)?(?:\s|$)/)

  if (!match) return null

  const value = Number(match[1])
  const unit = match[2] || 'm'

  if (!value || value <= 0) return null

  if (['h', 'ora', 'ore'].includes(unit)) {
    return {
      ms: value * 60 * 60 * 1000,
      label: `${value} ${value === 1 ? 'ora' : 'ore'}`
    }
  }

  if (['d', 'giorno', 'giorni'].includes(unit)) {
    return {
      ms: value * 24 * 60 * 60 * 1000,
      label: `${value} ${value === 1 ? 'giorno' : 'giorni'}`
    }
  }

  return {
    ms: value * 60 * 1000,
    label: `${value} ${value === 1 ? 'minuto' : 'minuti'}`
  }
}

let handler = async (m, {
  conn,
  text,
  command,
  isOwner,
  isROwner
}) => {
  try {
    const isMute = resolveAction(m, command)
    const target = resolveTarget(m, text || '')

    if (isMute === null) return

    if (!target) {
      return conn.reply(
        m.chat,
        '*⚠️ 𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚𝐝 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞.*\n\n> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
        m
      )
    }

    const executorIsOwner = !!(isOwner || isROwner || isOwnerJid(m.sender))
    const targetIsOwner = isOwnerJid(target)

    if (isMute && targetIsOwner) {
      return conn.reply(
        m.chat,
        '*⛔ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐮𝐭𝐚𝐫𝐞 𝐝𝐢𝐨.*\n\n> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
        m
      )
    }

    const mutedUsers = ensureChatMuteStore(m.chat)
    const oldMuteData = mutedUsers[target]

    if (!isMute && oldMuteData?.mutedByOwner && !executorIsOwner) {
      return conn.reply(
        m.chat,
        '*⛔ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 è 𝐬𝐭𝐚𝐭𝐨 𝐦𝐮𝐭𝐚𝐭𝐨 𝐝𝐚 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫.*\n*𝐒𝐨𝐥𝐨 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 𝐩𝐮𝐨̀ 𝐬𝐦𝐮𝐭𝐚𝐫𝐥𝐨.*\n\n> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
        m
      )
    }

    const duration = isMute
      ? parseDuration(text || '')
      : null

    const expiresAt = duration
      ? Date.now() + duration.ms
      : null

    if (isMute) {
      mutedUsers[target] = {
        active: true,
        expiresAt,
        mutedBy: m.sender,
        mutedByOwner: executorIsOwner
      }
    } else {
      delete mutedUsers[target]
    }

    const username = await conn.getName(target)
    const executor = `@${m.sender.split('@')[0]}`

    let avatar

    try {
      avatar = await conn.profilePictureUrl(target, 'image')
    } catch {
      avatar = 'https://i.imgur.com/8K9mXz4.png'
    }

    const card = await createMuteCard(
      username,
      avatar,
      isMute
    )

    const caption = isMute
      ? `*🔇 𝐈 𝐬𝐮𝐨𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐯𝐞𝐫𝐫𝐚𝐧𝐧𝐨 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢.*

*👮 𝐄𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐝𝐚:* ${executor}
*⏳ 𝐃𝐮𝐫𝐚𝐭𝐚:* ${duration?.label || 'permanente'}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
      : `*🔊 𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐩𝐮𝐨̀ 𝐭𝐨𝐫𝐧𝐚𝐫𝐞 𝐚 𝐬𝐜𝐫𝐢𝐯𝐞𝐫𝐞.*

*👮 𝐄𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐝𝐚:* ${executor}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

    await conn.sendMessage(m.chat, {
      image: card,
      caption,
      mentions: [target, m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error('[MUTA ERROR]', e)

    conn.reply(
      m.chat,
      '*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐠𝐞𝐬𝐭𝐢𝐨𝐧𝐞 𝐝𝐞𝐥 𝐦𝐮𝐭𝐞.*\n\n> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
      m
    )
  }
}

handler.before = async function (m, { conn }) {
  if (!m.isGroup) return
  if (!m.sender) return
  if (m.fromMe) return

  const sender = normalizeJid(m.sender)

  if (!sender) return

  const mutedUsers = ensureChatMuteStore(m.chat)
  const muteData = mutedUsers[sender]

  if (!muteData) return

  if (
    muteData !== true &&
    muteData.expiresAt &&
    Date.now() >= muteData.expiresAt
  ) {
    delete mutedUsers[sender]
    return
  }

  const isMuted =
    muteData === true ||
    muteData.active === true

  if (!isMuted) return

  try {
    await conn.sendMessage(m.chat, {
      delete: m.key
    })
  } catch {}
}

handler.command = ['muta', 'smuta']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler