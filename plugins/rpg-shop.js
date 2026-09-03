global.shopSession = global.shopSession || {}

const shops = {
  1: {
    nome: '🛒 𝐒𝐮𝐩𝐞𝐫𝐦𝐚𝐫𝐤𝐞𝐭',
    items: [
      { nome: '🍎 𝐌𝐞𝐥𝐚', prezzo: 2 },
      { nome: '🥖 𝐏𝐚𝐧𝐞', prezzo: 1 },
      { nome: '🥛 𝐋𝐚𝐭𝐭𝐞', prezzo: 2 },
      { nome: '🍫 𝐂𝐢𝐨𝐜𝐜𝐨𝐥𝐚𝐭𝐨', prezzo: 3 }
    ]
  },
  2: {
    nome: '🛍️ 𝐓𝐞𝐜𝐡 𝐒𝐭𝐨𝐫𝐞',
    items: [
      { nome: '📱 𝐒𝐦𝐚𝐫𝐭𝐩𝐡𝐨𝐧𝐞', prezzo: 800 },
      { nome: '💻 𝐋𝐚𝐩𝐭𝐨𝐩', prezzo: 1200 },
      { nome: '🎧 𝐂𝐮𝐟𝐟𝐢𝐞', prezzo: 150 },
      { nome: '⌚ 𝐒𝐦𝐚𝐫𝐭𝐰𝐚𝐭𝐜𝐡', prezzo: 300 }
    ]
  },
  3: {
    nome: '🎮 𝐆𝐚𝐦𝐞 𝐒𝐡𝐨𝐩',
    items: [
      { nome: '🎮 𝐂𝐨𝐧𝐬𝐨𝐥𝐞', prezzo: 500 },
      { nome: '🕹️ 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐞𝐫', prezzo: 60 },
      { nome: '💿 𝐍𝐮𝐨𝐯𝐨 𝐆𝐢𝐨𝐜𝐨', prezzo: 70 },
      { nome: '🎧 𝐇𝐞𝐚𝐝𝐬𝐞𝐭 𝐆𝐚𝐦𝐢𝐧𝐠', prezzo: 90 }
    ]
  }
}

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

let handler = async (m, { conn, command, args }) => {
  const user = m.sender

  if (!global.db.data.users[user]) {
    global.db.data.users[user] = { euro: 0, bank: 0, inventory: [] }
  }

  const u = global.db.data.users[user]

  if (command === 'shop') {
    const txt = box(
      '🛍️',
      '𝐒𝐇𝐎𝐏',
      `*1️⃣ 𝐒𝐮𝐩𝐞𝐫𝐦𝐚𝐫𝐤𝐞𝐭*
*2️⃣ 𝐓𝐞𝐜𝐡 𝐒𝐭𝐨𝐫𝐞*
*3️⃣ 𝐆𝐚𝐦𝐞 𝐒𝐡𝐨𝐩*
*4️⃣ 𝐒𝐡𝐨𝐩 𝐀𝐧𝐢𝐦𝐚𝐥𝐢*

*📝 𝐒𝐜𝐫𝐢𝐯𝐢 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐥 𝐧𝐞𝐠𝐨𝐳𝐢𝐨*

*🎒 𝐔𝐬𝐚 .zaino 𝐩𝐞𝐫 𝐯𝐞𝐝𝐞𝐫𝐞 𝐢 𝐭𝐮𝐨𝐢 𝐨𝐠𝐠𝐞𝐭𝐭𝐢*
*🐾 𝐔𝐬𝐚 .animale 𝐩𝐞𝐫 𝐯𝐞𝐝𝐞𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐚𝐧𝐢𝐦𝐚𝐥𝐞*`
    )

    global.shopSession[user] = { step: 'shop' }
    return conn.reply(m.chat, txt, m)
  }

  if (command === 'zaino') {
    if (!u.inventory || u.inventory.length === 0) {
      return conn.reply(
        m.chat,
        box('🎒', '𝐙𝐀𝐈𝐍𝐎', `*🎒 𝐈𝐥 𝐭𝐮𝐨 𝐳𝐚𝐢𝐧𝐨 è 𝐯𝐮𝐨𝐭𝐨!*`),
        m
      )
    }

    let msg = ''

    u.inventory.forEach((item, i) => {
      const sellPrice = Math.floor(item.prezzo * 0.7)
      msg += `*${i + 1}. ${item.nome} — 💰 ${item.prezzo} | 💸 𝐕𝐞𝐧𝐝𝐢𝐭𝐚: ${sellPrice}*\n`
    })

    return conn.reply(m.chat, box('🎒', '𝐙𝐀𝐈𝐍𝐎', msg.trim()), m)
  }

  if (command === 'vendioggetto') {
    const index = parseInt(args[0]) - 1

    if (!u.inventory || u.inventory.length === 0) {
      return conn.reply(
        m.chat,
        box('💸', '𝐕𝐄𝐍𝐃𝐈𝐓𝐀', `*🎒 𝐙𝐚𝐢𝐧𝐨 𝐯𝐮𝐨𝐭𝐨!*`),
        m
      )
    }

    if (isNaN(index) || index < 0 || index >= u.inventory.length) {
      return conn.reply(
        m.chat,
        box('💸', '𝐕𝐄𝐍𝐃𝐈𝐓𝐀', `*❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨*`),
        m
      )
    }

    const item = u.inventory.splice(index, 1)[0]
    const price = Math.floor(item.prezzo * 0.7)

    u.euro += price

    return conn.reply(
      m.chat,
      box(
        '💸',
        '𝐕𝐄𝐍𝐃𝐈𝐓𝐀',
        `*💰 𝐇𝐚𝐢 𝐯𝐞𝐧𝐝𝐮𝐭𝐨:* ${item.nome}
*💸 𝐆𝐮𝐚𝐝𝐚𝐠𝐧𝐚𝐭𝐨:* ${price}
*🏦 𝐓𝐨𝐭𝐚𝐥𝐞:* ${u.euro}`
      ),
      m
    )
  }
}

handler.before = async (m, { conn }) => {
  const user = m.sender
  const input = m.text?.trim()

  if (!global.shopSession[user]) return
  if (!input) return

  const session = global.shopSession[user]
  const u = global.db.data.users[user] || (global.db.data.users[user] = { euro: 0, bank: 0, inventory: [] })

  if (session.step === 'shop' && /^[1-4]$/.test(input)) {
    if (input === '4') {
      delete global.shopSession[user]

      const fakeMessage = {
        ...m,
        text: '.shopanimali',
        body: '.shopanimali',
        message: {
          conversation: '.shopanimali'
        }
      }

      return conn.ev.emit('messages.upsert', {
        messages: [fakeMessage],
        type: 'notify'
      })
    }

    const shop = shops[input]

    session.step = 'items'
    session.shop = input

    let txt = ''

    shop.items.forEach((item, i) => {
      txt += `*${i + 1}️⃣ ${item.nome} — 💰 ${item.prezzo}*\n`
    })

    txt += `\n*💸 𝐃𝐞𝐧𝐚𝐫𝐨:* ${u.euro}`

    return conn.reply(m.chat, box('🏪', shop.nome, txt.trim()), m)
  }

  if (session.step === 'items' && /^[1-4]$/.test(input)) {
    const shop = shops[session.shop]
    const item = shop.items[Number(input) - 1]

    if (u.euro < item.prezzo) {
      return conn.reply(
        m.chat,
        box('🛒', '𝐀𝐂𝐐𝐔𝐈𝐒𝐓𝐎', `*❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐝𝐞𝐧𝐚𝐫𝐨!*`),
        m
      )
    }

    u.euro -= item.prezzo

    if (!u.inventory) u.inventory = []
    u.inventory.push(item)

    delete global.shopSession[user]

    return conn.reply(
      m.chat,
      box(
        '🛒',
        '𝐀𝐂𝐐𝐔𝐈𝐒𝐓𝐎',
        `*✅ 𝐂𝐨𝐦𝐩𝐫𝐚𝐭𝐨:* ${item.nome}
*💸 𝐏𝐚𝐠𝐚𝐭𝐨:* ${item.prezzo}
*💰 𝐑𝐢𝐦𝐚𝐬𝐭𝐢:* ${u.euro}`
      ),
      m
    )
  }
}

handler.help = ['shop', 'zaino', 'vendioggetto <numero>']
handler.tags = ['economy']
handler.command = /^(shop|zaino|vendioggetto)$/i

export default handler