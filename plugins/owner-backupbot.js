// Plugin backupbot by Bonzino

import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const BACKUP_DIR = path.resolve('./axion-bot-Md-Backup')
const TEMP_DIR = path.resolve('./tmp')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function getTimestamp() {
  const d = new Date()

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

async function createBackupZip() {
  console.log('[BACKUPBOT] Avvio creazione zip...')
  ensureDir(BACKUP_DIR)
  ensureDir(TEMP_DIR)

  const fileName =
    `axion-bot-Md-Backup_${getTimestamp()}.zip`

  const outputPath =
    path.join(BACKUP_DIR, fileName)

  await execFileAsync('zip', [
  '-q',
  '-r',
  outputPath,
  '.',
  '-x',
  'node_modules/*',
  '.git/*',
  'tmp/*',
  'temp/*',
  '.cache/*',
  'axion-bot-Md-Backup/*',
  'db-backup/*',
  '*.zip',
  '*.log',
  '*.tmp'
], {
  cwd: process.cwd(),
  maxBuffer: 1024 * 1024 * 10
})
console.log('[BACKUPBOT] Compressione completata')

  const stats =
    fs.statSync(outputPath)
    
 console.log(
  `[BACKUPBOT] File creato: ${fileName}`
)

console.log(
  `[BACKUPBOT] Dimensione: ${(stats.size / 1024 / 1024).toFixed(2)} MB`
)

  return {
    fileName,
    outputPath,
    size: stats.size
  }
}

global.backupBotFiles ??= {}

let handler = async (
  m,
  {
    conn,
    command,
    usedPrefix
  }
) => {

  if (/^backupbot$/i.test(command)) {

    return conn.sendMessage(m.chat, {
      text:
`*⚠️ 𝐕𝐮𝐨𝐢 𝐜𝐫𝐞𝐚𝐫𝐞 𝐮𝐧 𝐛𝐚𝐜𝐤𝐮𝐩 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭?*

*📦 𝐕𝐞𝐫𝐫𝐚̀ 𝐜𝐫𝐞𝐚𝐭𝐨 𝐮𝐧 𝐟𝐢𝐥𝐞 .𝐳𝐢𝐩 𝐧𝐞𝐥𝐥𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚:*
*axion-bot-Md-Backup*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
      footer: 'Backup Manager',
      buttons: [
        {
          buttonId:
            `${usedPrefix}startbackupbot`,
          buttonText: {
            displayText:
              '💾 Avvia Backup'
          },
          type: 1
        },
        {
          buttonId:
            `${usedPrefix}annullabackup`,
          buttonText: {
            displayText:
              '❌ Annulla'
          },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })
  }

  if (/^startbackupbot$/i.test(command)) {
  
  await m.react('🔄')

    try {

      const {
        fileName,
        outputPath,
        size
      } = await createBackupZip()

      global.backupBotFiles[fileName] =
        outputPath

      const sizeMB =
        (size / 1024 / 1024).toFixed(2)
        
       await m.react('✅')

      return conn.sendMessage(m.chat, {
        text:
`*✅ 𝐁𝐚𝐜𝐤𝐮𝐩 𝐜𝐫𝐞𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.*

*📦 𝐅𝐢𝐥𝐞:* *${fileName}*
*📏 𝐃𝐢𝐦𝐞𝐧𝐬𝐢𝐨𝐧𝐞:* *${sizeMB} MB*
*📁 𝐂𝐚𝐫𝐭𝐞𝐥𝐥𝐚:* *axion-bot-Md-Backup*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,
        footer: 'Backup Manager',
        buttons: [
          {
            buttonId:
              `${usedPrefix}scaricabackup ${fileName}`,
            buttonText: {
              displayText:
                '💾 Scarica Backup'
            },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: m })

    } catch (e) {
    console.error(
  '[BACKUPBOT ERROR]',
  e
)

      return m.reply(    
`*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐜𝐫𝐞𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥 𝐛𝐚𝐜𝐤𝐮𝐩.*

*🧾 ${e.message}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
      )
    }
  }

  if (/^annullabackup$/i.test(command)) {

    return m.reply(
`*❌ 𝐁𝐚𝐜𝐤𝐮𝐩 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨.*

*𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 𝐨 𝐟𝐢𝐥𝐞 è 𝐬𝐭𝐚𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
    )
  }

  if (/^scaricabackup$/i.test(command)) {

    const fileName =
      String(
        m.text
          .split(' ')
          .slice(1)
          .join(' ') || ''
      ).trim()

    if (!fileName) {

      return m.reply(
`*⚠️ 𝐁𝐚𝐜𝐤𝐮𝐩 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
      )
    }

    const filePath =
      global.backupBotFiles[fileName]

    if (
      !filePath ||
      !fs.existsSync(filePath)
    ) {

      return m.reply(
`*❌ 𝐅𝐢𝐥𝐞 𝐛𝐚𝐜𝐤𝐮𝐩 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
      )
    }

    await conn.sendMessage(m.chat, {
      document:
        fs.readFileSync(filePath),
      mimetype:
        'application/zip',
      fileName
    }, { quoted: m })
  }
}

handler.help = [
  'backupbot',
  'startbackupbot',
  'annullabackup',
  'scaricabackup'
]

handler.tags = ['owner']

handler.command =
  /^(backupbot|startbackupbot|annullabackup|scaricabackup)$/i

handler.owner = true

export default handler