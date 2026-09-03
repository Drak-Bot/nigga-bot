// Plugin prefisso by Bonzino

function escapeRegex(text = '') {
  return String(text).replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')
}

function setGlobalPrefix(prefix) {
  global.prefix = new RegExp('^[' + escapeRegex(prefix) + ']')
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const cmd = String(command || '').toLowerCase()

  if (!global.db.data.settings) global.db.data.settings = {}

  const current = global.db.data.settings.prefix || usedPrefix || '.'

  if (cmd === 'prefisso') {
    return m.reply(`*╭━━━━━━━⚙️━━━━━━━╮*
*✦ 𝐏𝐑𝐄𝐅𝐈𝐒𝐒𝐎 ✦*
*╰━━━━━━━⚙️━━━━━━━╯*

*📌 𝐏𝐫𝐞𝐟𝐢𝐬𝐬𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* *${current}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  if (cmd === 'setprefisso') {
    const nuovo = String(args[0] || '').trim()

    if (!nuovo) {
      return m.reply(`*⚠️ 𝐔𝐬𝐨:* *${usedPrefix}setprefisso !*`)
    }

    if (nuovo.length > 1) {
      return m.reply('*❌ 𝐈𝐥 𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨 𝐝𝐞𝐯𝐞 𝐞𝐬𝐬𝐞𝐫𝐞 𝐮𝐧 𝐬𝐨𝐥𝐨 𝐬𝐢𝐦𝐛𝐨𝐥𝐨.*')
    }

    global.db.data.settings.prefix = nuovo
    setGlobalPrefix(nuovo)

    return m.reply(`*╭━━━━━━━✅━━━━━━━╮*
*✦ 𝐏𝐑𝐄𝐅𝐈𝐒𝐒𝐎 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎 ✦*
*╰━━━━━━━✅━━━━━━━╯*

*📌 𝐍𝐮𝐨𝐯𝐨 𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨:* *${nuovo}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }

  if (cmd === 'resettaprefisso') {
    delete global.db.data.settings.prefix
    setGlobalPrefix('.')

    return m.reply(`*╭━━━━━━━🔄━━━━━━━╮*
*✦ 𝐏𝐑𝐄𝐅𝐈𝐒𝐒𝐎 𝐑𝐄𝐒𝐄𝐓𝐓𝐀𝐓𝐎 ✦*
*╰━━━━━━━🔄━━━━━━━╯*

*📌 𝐏𝐫𝐞𝐟𝐢𝐬𝐬𝐨 𝐫𝐢𝐩𝐫𝐢𝐬𝐭𝐢𝐧𝐚𝐭𝐨:* *.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
  }
}

handler.help = ['prefisso', 'setprefisso', 'resettaprefisso']
handler.tags = ['owner']
handler.command = /^(prefisso|setprefisso|resettaprefisso)$/i
handler.owner = true

export default handler