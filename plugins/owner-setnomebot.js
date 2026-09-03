// Plugin setownerbot by Bonzino

function salvaNome(nome) {
  if (!global.db.data.settings) global.db.data.settings = {}

  global.db.data.settings.botName = nome
  global.botname = nome
}

let handler = async (m, { text, command, usedPrefix }) => {

  if (command === 'nomebot') {

    return m.reply(`╭━━━━━━━🤖━━━━━━━╮
*✦ 𝐍𝐎𝐌𝐄 𝐁𝐎𝐓 ✦*
╰━━━━━━━🤖━━━━━━━╯

*𝐍𝐨𝐦𝐞 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:*  
*${global.botname || '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻'}*

*──────────────*

*✏️ 𝐂𝐨𝐦𝐚𝐧𝐝𝐢:*
*• ${usedPrefix}setnomebot <nome>*
*• ${usedPrefix}resetnomebot*`)
  }

  if (command === 'setnomebot') {

    if (!text) {
      return m.reply(`╭━━━━━━━✏️━━━━━━━╮
*✦ 𝐈𝐌𝐏𝐎𝐒𝐓𝐀 𝐍𝐎𝐌𝐄 ✦*
╰━━━━━━━✏️━━━━━━━╯

*❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐨𝐦𝐞*

*📌 𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*  
*${usedPrefix}setnomebot 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`)
    }

    salvaNome(text.trim())

    return m.reply(`╭━━━━━━━✅━━━━━━━╮
*✦ 𝐍𝐎𝐌𝐄 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎 ✦*
╰━━━━━━━✅━━━━━━━╯

*𝐍𝐮𝐨𝐯𝐨 𝐧𝐨𝐦𝐞:*  
*${global.botname}*`)
  }

  if (command === 'resetnomebot') {

    salvaNome('𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻')

    return m.reply(`╭━━━━━━━♻️━━━━━━━╮
*✦ 𝐑𝐄𝐒𝐄𝐓 𝐍𝐎𝐌𝐄 ✦*
╰━━━━━━━♻️━━━━━━━╯

*✅ 𝐈𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭 è 𝐬𝐭𝐚𝐭𝐨 𝐫𝐞𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨*

*𝐍𝐨𝐦𝐞 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:*  
*${global.botname}*`)
  }
}

handler.help = ['nomebot', 'setnomebot', 'resetnomebot']
handler.tags = ['owner']
handler.command = /^(nomebot|setnomebot|resetnomebot)$/i
handler.owner = true

export default handler