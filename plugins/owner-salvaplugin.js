// Salva Plugin by Bonzino

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
*${usedPrefix}salvaplugin nomeplugin*

*📌 𝐏𝐨𝐢 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞.*

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
`*⚠️ 𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞 𝐝𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  const pluginPath = path.join(
    pluginsDir,
    `${pluginName}.js`
  )

  const code = m.quoted.text.trim()

  try {

    fs.writeFileSync(pluginPath, code)

    const existed = fs.existsSync(pluginPath)

    return conn.sendMessage(m.chat, {
      text:
`*✅ 𝐏𝐥𝐮𝐠𝐢𝐧 𝐬𝐚𝐥𝐯𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.*

*📂 𝐅𝐢𝐥𝐞:* *${pluginName}.js*
*🛠️ 𝐀𝐳𝐢𝐨𝐧𝐞:* *${existed ? 'Modificato' : 'Creato'}*

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
          buttonId: `${usedPrefix}modificaplugin ${pluginName}`,
          buttonText: { displayText: '✏️ Modifica' },
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
`*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐢𝐥 𝐬𝐚𝐥𝐯𝐚𝐭𝐚𝐠𝐠𝐢𝐨.*

*📛 ${String(e)}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }
}

handler.help = ['salvaplugin']
handler.tags = ['owner']
handler.command = /^(salvaplugin|saveplugin)$/i
handler.owner = true

export default handler