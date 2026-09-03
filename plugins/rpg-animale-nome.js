// Plugin nomeaniamael by Bonzino

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function cleanName(text = '') {
  return String(text)
    .replace(/\s+/g, ' ')
    .trim()
}

let handler = async (m, { conn, text }) => {
  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})

  if (!user.animale) {
    return conn.reply(
      m.chat,
      box(
        '🏷️',
        '𝐍𝐎𝐌𝐄 𝐀𝐍𝐈𝐌𝐀𝐋𝐄',
        `*𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.*

*🛒 𝐔𝐬𝐚 .shopanimali 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐧𝐞 𝐮𝐧𝐨.*`
      ),
      m
    )
  }

  const newName = cleanName(text)

  if (!newName) {
    return conn.reply(
      m.chat,
      box(
        '🏷️',
        '𝐍𝐎𝐌𝐄 𝐀𝐍𝐈𝐌𝐀𝐋𝐄',
        `*𝐃𝐞𝐯𝐢 𝐬𝐜𝐫𝐢𝐯𝐞𝐫𝐞 𝐮𝐧 𝐧𝐨𝐦𝐞 𝐯𝐚𝐥𝐢𝐝𝐨.*

*📌 𝐄𝐬𝐞𝐦𝐩𝐢𝐨:* *.nomeanimale Milo*`
      ),
      m
    )
  }

  if (newName.length < 2) {
    return conn.reply(
      m.chat,
      box(
        '⚠️',
        '𝐍𝐎𝐌𝐄 𝐓𝐑𝐎𝐏𝐏𝐎 𝐂𝐎𝐑𝐓𝐎',
        `*𝐈𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐯𝐞 𝐚𝐯𝐞𝐫𝐞 𝐚𝐥𝐦𝐞𝐧𝐨 𝟐 𝐜𝐚𝐫𝐚𝐭𝐭𝐞𝐫𝐢.*`
      ),
      m
    )
  }

  if (newName.length > 20) {
    return conn.reply(
      m.chat,
      box(
        '⚠️',
        '𝐍𝐎𝐌𝐄 𝐓𝐑𝐎𝐏𝐏𝐎 𝐋𝐔𝐍𝐆𝐎',
        `*𝐈𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐯𝐞 𝐚𝐯𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝟐𝟎 𝐜𝐚𝐫𝐚𝐭𝐭𝐞𝐫𝐢.*`
      ),
      m
    )
  }

  const oldName = user.animale.nome || user.animale.tipo
  user.animale.nome = newName

  await conn.sendMessage(m.chat, {
    text: box(
      '✅',
      '𝐍𝐎𝐌𝐄 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎',
      `*${user.animale.emoji} 𝐀𝐧𝐢𝐦𝐚𝐥𝐞:* ${user.animale.tipo}
*🏷️ 𝐏𝐫𝐢𝐦𝐚:* ${oldName}
*✨ 𝐎𝐫𝐚:* ${user.animale.nome}`
    ),
    footer: '',
    buttons: [
      {
        buttonId: '.animale',
        buttonText: { displayText: '🐾 Stato animale' },
        type: 1
      },
      {
        buttonId: '.gioca',
        buttonText: { displayText: '🦴 Gioca' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['nomeanimale <nome>']
handler.tags = ['rpg']
handler.command = /^(nomeanimale|cambianomeanimale)$/i

export default handler