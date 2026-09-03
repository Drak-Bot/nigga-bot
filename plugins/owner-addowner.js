// Plugin addowner by Bonzino

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

function escapeString(str = '') {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
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
    return m.reply(`*❌ 𝐅𝐢𝐥𝐞 𝐜𝐨𝐧𝐟𝐢𝐠.𝐣𝐬 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.*`)
  }

  let name = ''
  try {
    name = await conn.getName(number + '@s.whatsapp.net')
  } catch {
    name = number
  }

  let config = fs.readFileSync(configPath, 'utf8')

  if (config.includes(`['${number}'`) || config.includes(`["${number}"`)) {
    return m.reply(
`*⚠️ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐮𝐦𝐞𝐫𝐨 è 𝐠𝐢à 𝐨𝐰𝐧𝐞𝐫.*

*👤 @${number}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
      null,
      { mentions: [number + '@s.whatsapp.net'] }
    )
  }

  const newLine = `  ['${number}', '${escapeString(name)}', true],`

  config = config.replace(
    /(global\.owner\s*=\s*\[\s*)/,
    `$1\n${newLine}`
  )

  fs.writeFileSync(configPath, config)

  global.owner = global.owner || []
  global.owner.push([number, name, true])

  return conn.sendMessage(m.chat, {
    text:
`*✅ 𝐍𝐮𝐨𝐯𝐨 𝐨𝐰𝐧𝐞𝐫 𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨*

*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${number}
*📛 𝐍𝐨𝐦𝐞:* *${name}*
*📂 𝐅𝐢𝐥𝐞:* *config.js*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
    mentions: [number + '@s.whatsapp.net']
  }, { quoted: m })
}

handler.help = ['addowner']
handler.tags = ['owner']
handler.command = /^(addowner)$/i
handler.rowner = true

export default handler