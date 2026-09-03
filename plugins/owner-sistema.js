// plugin sistema by Bonzino

import os from 'os'
import fs from 'fs'
import { execSync } from 'child_process'
import { performance } from 'perf_hooks'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎',
    '1': '𝟏',
    '2': '𝟐',
    '3': '𝟑',
    '4': '𝟒',
    '5': '𝟓',
    '6': '𝟔',
    '7': '𝟕',
    '8': '𝟖',
    '9': '𝟗',
    '.': '.'
  }

  return number
    .toString()
    .split('')
    .map(v => map[v] || v)
    .join('')
}

const clockString = ms => {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60

  return `${toMathematicalAlphanumericSymbols(d.toString().padStart(2, '0'))}d ${toMathematicalAlphanumericSymbols(h.toString().padStart(2, '0'))}h ${toMathematicalAlphanumericSymbols(m.toString().padStart(2, '0'))}m`
}

const getRuntime = () => {
  if (process.env.pm_id) return 'PM2'
  if (process.env.NODEMON) return 'Nodemon'
  return 'Node.js'
}

const getDiskUsage = () => {
  try {
    const output = execSync('df -h /').toString().split('\n')[1].split(/\s+/)
    return {
      used: output[2],
      total: output[1]
    }
  } catch {
    return {
      used: '?',
      total: '?'
    }
  }
}

const handler = async (m, { conn, usedPrefix }) => {
  const start = performance.now()
  const end = performance.now()

  const speed = (end - start).toFixed(4)
  const uptime = clockString(process.uptime() * 1000)

  const totalMem = Math.round(os.totalmem() / 1024 / 1024)
  const usedMem = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)
  const ramPercent = Math.round((usedMem / totalMem) * 100)

  const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)

  const cpu = os.cpus()?.[0]?.model || 'Unknown'
  const cores = os.cpus()?.length || 0
  const threads = cores * 2

  const disk = getDiskUsage()

  const totalPlugins = Object.keys(global.plugins || {}).length
  const totalUsers = Object.keys(global.db?.data?.users || {}).length
  const totalChats = Object.keys(global.db?.data?.chats || {}).length

  let totalGroups = 0

  try {
    const groups = await conn.groupFetchAllParticipating()
    totalGroups = Object.keys(groups).length
  } catch {}

  const info = `
*╭━━━━━━━⚙️━━━━━━━╮*
*✦ 𝑵𝑰𝑮𝑮𝑨 • 𝐒𝐈𝐒𝐓𝐄𝐌 ✦*
*╰━━━━━━━⚙️━━━━━━━╯*

*🟢 𝐒𝐭𝐚𝐭𝐮𝐬:* Online
*🚀 𝐋𝐚𝐭𝐞𝐧𝐳𝐚:* ${toMathematicalAlphanumericSymbols(speed)} ms
*⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞:* ${uptime}

*💻 𝐑𝐀𝐌:* ${toMathematicalAlphanumericSymbols(usedMem)}/${toMathematicalAlphanumericSymbols(totalMem)} MB (${toMathematicalAlphanumericSymbols(ramPercent)}%)
*🔧 𝐇𝐞𝐚𝐩:* ${toMathematicalAlphanumericSymbols(heapUsed)} MB
*💾 𝐃𝐢𝐬𝐜𝐨:* ${disk.used}/${disk.total}
*📈 𝐋𝐨𝐚𝐝:* ${toMathematicalAlphanumericSymbols(ramPercent)}%

*🧠 𝐂𝐏𝐔:* ${cpu}
*🔩 𝐂𝐨𝐫𝐞𝐬:* ${toMathematicalAlphanumericSymbols(cores)}
*🧵 𝐓𝐡𝐫𝐞𝐚𝐝𝐬:* ${toMathematicalAlphanumericSymbols(threads)}

*📦 𝐍𝐨𝐝𝐞:* ${process.version}
*🖥️ 𝐎𝐒:* ${os.platform()} ${os.arch()}
*⚡ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞:* ${getRuntime()}

*🧩 𝐏𝐥𝐮𝐠𝐢𝐧𝐬:* ${toMathematicalAlphanumericSymbols(totalPlugins)}
*👥 𝐔𝐭𝐞𝐧𝐭𝐢:* ${toMathematicalAlphanumericSymbols(totalUsers)}
*💬 𝐂𝐡𝐚𝐭:* ${toMathematicalAlphanumericSymbols(totalChats)}
*📂 𝐆𝐫𝐮𝐩𝐩𝐢:* ${toMathematicalAlphanumericSymbols(totalGroups)}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*
`.trim()

  const buttons = [
    {
      buttonId: `${usedPrefix}ping`,
      buttonText: {
        displayText: '🏓 Ping'
      },
      type: 1
    },
    {
      buttonId: `${usedPrefix}menu`,
      buttonText: {
        displayText: '📋 Menu'
      },
      type: 1
    }
  ]

  await conn.sendMessage(m.chat, {
    text: info,
    buttons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['sistema']
handler.tags = ['info']
handler.command = /^(sistema|system|status)$/i

export default handler