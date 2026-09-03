// Plugin grade by Bonzino

const bare = (jid = '') => String(jid || '').split('@')[0].split(':')[0]

function isOwner(jid) {
  try {
    const num = bare(jid)
    if (!Array.isArray(global.owner)) return false

    return global.owner
      .map(o => Array.isArray(o) ? o[0] : o)
      .map(v => bare(v))
      .includes(num)
  } catch {
    return false
  }
}

function getGrade(jid, participants = [], user = {}, chatId = '') {
  if (isOwner(jid)) return '👑 𝐃𝐢𝐨'

  const num = bare(jid)
const p = participants.find(x => {
  const ids = [
    x.id,
    x.jid,
    x.lid,
    x.participant
  ].filter(Boolean).map(v => bare(v))

  return ids.includes(num)
})

if (p?.admin === 'superadmin' || p?.isSuperAdmin) return '⚜️ 𝐅𝐨𝐧𝐝𝐚𝐭𝐨𝐫𝐞'

if (
  p?.admin === 'admin' ||
  p?.admin === true ||
  p?.isAdmin === true
) return '🛡️ 𝐀𝐝𝐦𝐢𝐧'

  const isModerator = !!user.moderator && user.moderatorGroup === chatId
  if (isModerator) return '👮 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞'

  return '👤 𝐌𝐞𝐦𝐛𝐫𝐨'
}

let handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.sendMessage(m.chat, {
      text: `*⚠️ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮ò 𝐞𝐬𝐬𝐞𝐫𝐞 𝐮𝐬𝐚𝐭𝐨 𝐬𝐨𝐥𝐨 𝐧𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢.*`,
      contextInfo: global.rcanal?.contextInfo || {}
    }, { quoted: m })
  }

  let meta
  try {
    meta = await conn.groupMetadata(m.chat)
  } catch {}

  const participants = Array.isArray(meta?.participants) ? meta.participants : []
  const user = global.db.data.users[m.sender] || {}
  const grade = getGrade(m.sender, participants, user, m.chat)

  await conn.sendMessage(m.chat, {
    text: `*🎖️ 𝐈𝐥 𝐭𝐮𝐨 𝐠𝐫𝐚𝐝𝐨 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 è:*

『 ${grade} 』

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
    contextInfo: global.rcanal?.contextInfo || {}
  }, { quoted: m })
}

handler.help = ['grade', 'myrole', 'ruolo']
handler.tags = ['info']
handler.command = ['grade', 'myrole', 'ruolo']
handler.group = true

export default handler