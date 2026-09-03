let handler = async (m, { conn, usedPrefix, command }) => {
  const user = m.sender

  if (!global.db.data.users[user]) {
    global.db.data.users[user] = { euro: 0, lastCrime: 0, isJailed: false, jailTime: 0 }
  }

  const u = global.db.data.users[user]

  if (typeof u.euro !== 'number') u.euro = 0
  if (typeof u.lastCrime !== 'number') u.lastCrime = 0
  if (typeof u.isJailed !== 'boolean') u.isJailed = false
  if (typeof u.jailTime !== 'number') u.jailTime = 0

  const cauzionePrezzo = 5000

  const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

  if (u.isJailed && command !== 'evadi' && command !== 'cauzione') {
    const tempoRimanente = u.jailTime - Date.now()

    if (tempoRimanente > 0) {
      const minuti = Math.ceil(tempoRimanente / 60000)

      return conn.reply(
        m.chat,
        box(
          '🔒',
          '𝐈𝐍 𝐂𝐄𝐋𝐋𝐀',
          `*⏳ 𝐓𝐢 𝐫𝐞𝐬𝐭𝐚𝐧𝐨 𝐚𝐧𝐜𝐨𝐫𝐚:* ${minuti} 𝐦𝐢𝐧𝐮𝐭𝐢

*⚖️ 𝐔𝐬𝐚:* *${usedPrefix}cauzione* 𝐩𝐞𝐫 𝐮𝐬𝐜𝐢𝐫𝐞 𝐬𝐮𝐛𝐢𝐭𝐨`
        ),
        m
      )
    } else {
      u.isJailed = false
      u.jailTime = 0
    }
  }

  if (command === 'cauzione') {
    if (!u.isJailed) {
      return m.reply(
        box(
          '⚖️',
          '𝐂𝐀𝐔𝐙𝐈𝐎𝐍𝐄',
          `*🕊️ 𝐒𝐞𝐢 𝐠𝐢à 𝐥𝐢𝐛𝐞𝐫𝐨*`
        )
      )
    }

    if (u.euro < cauzionePrezzo) {
      return m.reply(
        box(
          '❌',
          '𝐂𝐀𝐔𝐙𝐈𝐎𝐍𝐄',
          `*💸 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐝𝐞𝐧𝐚𝐫𝐨*

*⚖️ 𝐂𝐚𝐮𝐳𝐢𝐨𝐧𝐞:* ${formatNumber(cauzionePrezzo)}
*💼 𝐃𝐞𝐧𝐚𝐫𝐨:* ${formatNumber(u.euro)}`
        )
      )
    }

    u.euro -= cauzionePrezzo
    u.isJailed = false
    u.jailTime = 0

    return m.reply(
      box(
        '⚖️',
        '𝐋𝐈𝐁𝐄𝐑𝐓À',
        `*✅ 𝐇𝐚𝐢 𝐩𝐚𝐠𝐚𝐭𝐨 𝐥𝐚 𝐜𝐚𝐮𝐳𝐢𝐨𝐧𝐞*

*💸 𝐒𝐜𝐚𝐥𝐚𝐭𝐢:* ${formatNumber(cauzionePrezzo)}
*💼 𝐃𝐞𝐧𝐚𝐫𝐨:* ${formatNumber(u.euro)}`
      )
    )
  }

  if (command === 'evadibla') {
    if (!u.isJailed) {
      return m.reply(
        box(
          '🏃‍♂️',
          '𝐄𝐕𝐀𝐒𝐈𝐎𝐍𝐄',
          `*🕊️ 𝐍𝐨𝐧 𝐬𝐞𝐢 𝐢𝐧 𝐜𝐚𝐫𝐜𝐞𝐫𝐞*`
        )
      )
    }

    const successoEvasione = Math.random() < 0.3

    if (successoEvasione) {
      u.isJailed = false
      u.jailTime = 0

      return m.reply(
        box(
          '🏃‍♂️',
          '𝐄𝐕𝐀𝐒𝐈𝐎𝐍𝐄',
          `*💨 𝐒𝐞𝐢 𝐫𝐢𝐮𝐬𝐜𝐢𝐭𝐨 𝐚 𝐟𝐮𝐠𝐠𝐢𝐫𝐞*

*🕊️ 𝐎𝐫𝐚 𝐬𝐞𝐢 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐥𝐢𝐛𝐞𝐫𝐨*`
        )
      )
    } else {
      u.jailTime += 10 * 60 * 1000

      return m.reply(
        box(
          '👮',
          '𝐄𝐕𝐀𝐒𝐈𝐎𝐍𝐄 𝐅𝐀𝐋𝐋𝐈𝐓𝐀',
          `*🚫 𝐓𝐢 𝐡𝐚𝐧𝐧𝐨 𝐩𝐫𝐞𝐬𝐨*

*⏳ 𝐀𝐥𝐭𝐫𝐢 10 𝐦𝐢𝐧𝐮𝐭𝐢 𝐢𝐧 𝐜𝐞𝐥𝐥𝐚*`
        )
      )
    }
  }

  const crimes = [
    { name: '🏦 𝐑𝐚𝐩𝐢𝐧𝐚 𝐢𝐧 𝐛𝐚𝐧𝐜𝐚', rate: 0.35, reward: [1500, 3000] },
    { name: '🏠 𝐅𝐮𝐫𝐭𝐨 𝐢𝐧 𝐯𝐢𝐥𝐥𝐚', rate: 0.50, reward: [600, 1200] },
    { name: '💨 𝐒𝐜𝐢𝐩𝐩𝐨', rate: 0.75, reward: [150, 400] }
  ]

  const crime = crimes[Math.floor(Math.random() * crimes.length)]
  const success = Math.random() < crime.rate
  const amount = Math.floor(Math.random() * (crime.reward[1] - crime.reward[0] + 1)) + crime.reward[0]

  if (success) {
    u.euro += amount

    await conn.sendMessage(m.chat, {
      text: box(
        '🕶️',
        '𝐂𝐎𝐋𝐏𝐎 𝐑𝐈𝐔𝐒𝐂𝐈𝐓𝐎',
        `*🎯 𝐂𝐫𝐢𝐦𝐢𝐧𝐞:* ${crime.name}
*💸 𝐁𝐨𝐭𝐭𝐢𝐧𝐨:* +${formatNumber(amount)}
*💼 𝐃𝐞𝐧𝐚𝐫𝐨:* ${formatNumber(u.euro)}`
      ),
      footer: '',
      buttons: [
        {
          buttonId: `${usedPrefix}crimine`,
          buttonText: { displayText: '🔁 Altro colpo' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })

    return
  }

  u.isJailed = true
  u.jailTime = Date.now() + 5 * 60 * 1000

  const txtFail = box(
    '🚔',
    '𝐀𝐑𝐑𝐄𝐒𝐓𝐎',
    `*❌ 𝐈𝐥 𝐜𝐨𝐥𝐩𝐨 è 𝐟𝐚𝐥𝐥𝐢𝐭𝐨*

*🎯 𝐂𝐫𝐢𝐦𝐢𝐧𝐞:* ${crime.name}
*⏳ 𝐏𝐞𝐧𝐚:* 5 𝐦𝐢𝐧𝐮𝐭𝐢
*⚖️ 𝐂𝐚𝐮𝐳𝐢𝐨𝐧𝐞* ${formatNumber(cauzionePrezzo)}`
  )

  const jailButtons = [
    {
      buttonId: `${usedPrefix}evadibla`,
      buttonText: { displayText: '🏃‍♂️ Tenta Evasione' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}cauzione`,
      buttonText: { displayText: '⚖️ Paga Cauzione' },
      type: 1
    }
  ]

  await conn.sendMessage(m.chat, {
    text: txtFail,
    footer: '',
    buttons: jailButtons,
    headerType: 1
  }, { quoted: m })
}

handler.help = ['crimine', 'evadi', 'cauzione']
handler.tags = ['economy']
handler.command = /^(crimine|evadibla|cauzione)$/i

export default handler

function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num)
}