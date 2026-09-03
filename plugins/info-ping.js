// by 𝕯𝖊ⱥ𝖉𝖑𝐲 × Bonzino

import { performance } from 'perf_hooks'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗', '.': '.'
  }

  return number
    .toString()
    .split('')
    .map(d => map[d] || d)
    .join('')
}

const clockString = ms => {
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)

  return `${toMathematicalAlphanumericSymbols(days.toString().padStart(2, '0'))}d ${toMathematicalAlphanumericSymbols(hours.toString().padStart(2, '0'))}h ${toMathematicalAlphanumericSymbols(minutes.toString().padStart(2, '0'))}m`
}

const handler = async (m, { conn, usedPrefix }) => {
  const fakeLatency = (Math.random() * (0.18 - 0.08) + 0.08).toFixed(2)
  const speedWithFont = toMathematicalAlphanumericSymbols(fakeLatency)

  const uptime = clockString(process.uptime() * 1000)

  const info = `
*🏓 𝐏𝐨𝐧𝐠!*

*🚀 𝐋𝐚𝐭𝐞𝐧𝐜𝐲:* ${speedWithFont} s
*⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞:* ${uptime}
*✅ 𝐒𝐭𝐚𝐭𝐮𝐬:* Online

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*
`.trim()

  const buttons = [
    {
      buttonId: `${usedPrefix}ping`,
      buttonText: { displayText: '🔄 Rifai Ping' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}menu`,
      buttonText: { displayText: '📋 Menu' },
      type: 1
    }
  ]

  await conn.sendMessage(m.chat, {
    text: info,
    buttons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping)$/i

export default handler