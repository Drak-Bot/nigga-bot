// Plugin delowner by Bonzino 

import fs from 'fs'
import path from 'path'

function formatNumber(input = '') {
  return String(input).replace(/\D/g, '')
}

function getTargetNumber(m, text = '') {
  if (m.mentionedJid?.[0]) return formatNumber(m.mentionedJid[0])
  if (m.quoted?.sender) return formatNumber(m.quoted.sender)
  return formatNumber(text)
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const number = getTargetNumber(m, text)

  if (!number) {
    return m.reply(
`*⚠️ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:*
*${usedPrefix + command} 393xxxxxxxxx*
*${usedPrefix + command} @utente*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
    )
  }

  const configPath = path.join(process.cwd(), 'config.js')

  if (!fs.existsSync(configPath)) {
    return m.reply(
`*❌ 𝐅𝐢𝐥𝐞 config.js 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  let config = fs.readFileSync(configPath, 'utf8')

  const ownerRegex = new RegExp(
    `\\s*\\[['"]${number}['"],\\s*['"].*?['"],\\s*true\\],?\\n?`,
    'g'
  )

  if (!ownerRegex.test(config)) {
    return m.reply(
`*⚠️ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 è 𝐨𝐰𝐧𝐞𝐫.*

*👤 @${number}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
      null,
      { mentions: [number + '@s.whatsapp.net'] }
    )
  }

  config = config.replace(ownerRegex, '\n')

  fs.writeFileSync(configPath, config)

  if (Array.isArray(global.owner)) {
    global.owner = global.owner.filter(
      owner => String(owner?.[0]) !== number
    )
  }

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐎𝐰𝐧𝐞𝐫 𝐫𝐢𝐦𝐨𝐬𝐬𝐨*

*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${number}
*📂 𝐅𝐢𝐥𝐞:* *config.js*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
    mentions: [number + '@s.whatsapp.net']
  }, { quoted: m })
}

handler.help = ['delowner']
handler.tags = ['owner']
handler.command = /^(delowner|removeowner)$/i
handler.rowner = true

export default handler