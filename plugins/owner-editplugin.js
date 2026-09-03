// Modifica plugin by Bonzino

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, text, usedPrefix }) => {

  const pluginsDir = path.join(__dirname, '../plugins')

  if (!text) {
    return m.reply(
`*⚠️ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:*
*${usedPrefix}modificaplugin nomeplugin*

*📌 𝐏𝐨𝐢 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 𝐢𝐥 𝐧𝐮𝐨𝐯𝐨 𝐜𝐨𝐝𝐢𝐜𝐞.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  const pluginName = text
    .trim()
    .replace(/\.js$/i, '')
    .replace(/[\\/:*?"<>|]/g, '')

  if (!pluginName) {
    return m.reply(
`*❌ 𝐍𝐨𝐦𝐞 𝐩𝐥𝐮𝐠𝐢𝐧 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  if (!m.quoted?.text) {
    return m.reply(
`*⚠️ 𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 𝐢𝐥 𝐧𝐮𝐨𝐯𝐨 𝐜𝐨𝐝𝐢𝐜𝐞 𝐝𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  const pluginPath = path.join(
    pluginsDir,
    `${pluginName}.js`
  )

  if (!fs.existsSync(pluginPath)) {
    return m.reply(
`*❌ 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 ${pluginName}.js 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞.*

*💡 𝐔𝐬𝐚:*
*${usedPrefix}nuovoplugin ${pluginName}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  const code = m.quoted.text.trim()

  try {

    fs.writeFileSync(pluginPath, code)

    return conn.sendMessage(m.chat, {
      text:
`*✅ 𝐏𝐥𝐮𝐠𝐢𝐧 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.*

*📂 𝐅𝐢𝐥𝐞:* *${pluginName}.js*

*🚀 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐯𝐞𝐫𝐫𝐚̀ 𝐫𝐢𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐞.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
      footer: 'Gestione plugin Axion',
      buttons: [
        {
          buttonId: `${usedPrefix}getplugin ${pluginName}`,
          buttonText: { displayText: '📥 Get Plugin' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}pluginlist`,
          buttonText: { displayText: '🗂️ Lista Plugin' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}plugin`,
          buttonText: { displayText: '🔙 Menu Plugin' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })

  } catch (e) {

    return m.reply(
`*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚.*

*📛 ${String(e)}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }
}

handler.help = ['modificaplugin']
handler.tags = ['owner']
handler.command = /^(modificaplugin|editplugin)$/i
handler.owner = true

export default handler