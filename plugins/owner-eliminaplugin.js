// Plugin elimina plugin by Bonzino

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
*${usedPrefix}eliminaplugin nomeplugin*

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

  const pluginPath = path.join(
    pluginsDir,
    `${pluginName}.js`
  )

  if (!fs.existsSync(pluginPath)) {
    return m.reply(
`*❌ 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 ${pluginName}.js 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  try {

    fs.unlinkSync(pluginPath)

    return conn.sendMessage(m.chat, {
      text:
`*✅ 𝐏𝐥𝐮𝐠𝐢𝐧 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.*

*📂 𝐅𝐢𝐥𝐞:* *${pluginName}.js*

*🚀 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐞.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
      footer: 'Gestione plugin Axion',
      buttons: [
        {
          buttonId: `${usedPrefix}pluginlist`,
          buttonText: { displayText: '🗂️ Lista Plugin' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}nuovoplugin`,
          buttonText: { displayText: '🆕 Nuovo Plugin' },
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
`*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥’𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐳𝐢𝐨𝐧𝐞.*

*📛 ${String(e)}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }
}

handler.help = ['eliminaplugin']
handler.tags = ['owner']
handler.command = /^(eliminaplugin|deleteplugin|delplugin)$/i
handler.owner = true

export default handler