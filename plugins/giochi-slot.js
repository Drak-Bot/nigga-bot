// "slot" by Bonzino

let cooldowns = {}

const symbols = ['💎', '👑', '🔮', '🧿', '🔱', '💠', '⭐', '⚜️']
const RITARDO_RISULTATO = 5500
const COOLDOWN = 45 * 1000
const footer = '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻'

let handler = async (m, { conn, args, command }) => {
  global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
  global.db.data.slotSessioni || (global.db.data.slotSessioni = {})

  let user = global.db.data.users[m.sender]
  user.euro = Number(user.euro) || 0
  user.exp = Number(user.exp) || 0
  user.level = Number(user.level) || 1

  const cmd = String(command || '').toLowerCase()

  if (cmd === 'confermaslot') return confermaSlot(m, conn)
  if (cmd === 'annullaslot') return annullaSlot(m, conn)

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < COOLDOWN) {
    let timeLeft = cooldowns[m.sender] + COOLDOWN - Date.now()
    let min = Math.floor(timeLeft / 60000)
    let sec = Math.floor((timeLeft % 60000) / 1000)

    return conn.reply(
      m.chat,
      `*⏳ 𝐀𝐬𝐩𝐞𝐭𝐭𝐚 ${min}𝐦 ${sec}𝐬 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚.*`,
      m
    )
  }

  let importo = parseAmount(args.join(' '))

  if (!importo || importo <= 0) {
    return conn.reply(
      m.chat,
      `╭━━━━━━━🎰━━━━━━━╮
*✦ 𝐀𝐗𝐈𝐎𝐍 𝐒𝐋𝐎𝐓 ✦*
╰━━━━━━━🎰━━━━━━━╯

*💸 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐝𝐚 𝐠𝐢𝐨𝐜𝐚𝐫𝐞.*

*📌 𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*
*.slot 1000*

*💼 𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${formatNumber(user.euro)}€

> *${footer}*`,
      m
    )
  }

  if (importo > user.euro) {
    return conn.reply(
      m.chat,
      `╭━━━━━━━❌━━━━━━━╮
*✦ 𝐀𝐗𝐈𝐎𝐍 𝐒𝐋𝐎𝐓 ✦*
╰━━━━━━━❌━━━━━━━╯

*💼 𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${formatNumber(user.euro)}€
*🎰 𝐏𝐮𝐧𝐭𝐚𝐭𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚:* ${formatNumber(importo)}€

*❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢.*

> *${footer}*`,
      m
    )
  }

  global.db.data.slotSessioni[m.sender] = {
    importo,
    possibileVincita: importo * 5,
    possibilePerdita: importo,
    createdAt: Date.now()
  }

  await conn.sendMessage(
    m.chat,
    {
      text: `╭━━━━━━━💎━━━━━━━╮
*✦ 𝐀𝐗𝐈𝐎𝐍 𝐒𝐋𝐎𝐓 ✦*
╰━━━━━━━💎━━━━━━━╯

*🎰 𝐒𝐭𝐚𝐢 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐚𝐥𝐥𝐚 𝐬𝐥𝐨𝐭.*

*💼 𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${formatNumber(user.euro)}€
*💎 𝐏𝐮𝐧𝐭𝐚𝐭𝐚:* ${formatNumber(importo)}€

*✨ 𝐕𝐢𝐧𝐜𝐢𝐭𝐚 𝐧𝐨𝐫𝐦𝐚𝐥𝐞:* x1.8
*🔥 𝐁𝐈𝐆 𝐖𝐈𝐍:* x3
*💰 𝐉𝐀𝐂𝐊𝐏𝐎𝐓:* x5

*📊 𝐖𝐢𝐧 𝐫𝐚𝐭𝐞 𝐭𝐨𝐭𝐚𝐥𝐞:* 50%

*📌 𝐂𝐨𝐧𝐟𝐞𝐫𝐦𝐢 𝐥’𝐨𝐩𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞?*`,
      footer,
      buttons: [
        {
          buttonId: '.confermaslot',
          buttonText: { displayText: '✅️ Conferma' },
          type: 1
        },
        {
          buttonId: '.annullaslot',
          buttonText: { displayText: '❌ Annulla' },
          type: 1
        }
      ],
      headerType: 1
    },
    { quoted: m }
  )
}

handler.help = ['slot']
handler.tags = ['game']
handler.command = /^(slot|confermaslot|annullaslot)$/i

export default handler

async function confermaSlot(m, conn) {
  global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
  global.db.data.slotSessioni || (global.db.data.slotSessioni = {})

  let user = global.db.data.users[m.sender]
  let sessione = global.db.data.slotSessioni[m.sender]

  user.euro = Number(user.euro) || 0
  user.exp = Number(user.exp) || 0
  user.level = Number(user.level) || 1

  if (!sessione) {
    return conn.reply(m.chat, `*❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐧𝐞𝐬𝐬𝐮𝐧𝐚 𝐬𝐥𝐨𝐭 𝐝𝐚 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚𝐫𝐞.*`, m)
  }

  if (Date.now() - sessione.createdAt > 60000) {
    delete global.db.data.slotSessioni[m.sender]
    return conn.reply(m.chat, `*⏳ 𝐋𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐝𝐞𝐥𝐥𝐚 𝐬𝐥𝐨𝐭 è 𝐬𝐜𝐚𝐝𝐮𝐭𝐚.*`, m)
  }

  if (sessione.importo > user.euro) {
    delete global.db.data.slotSessioni[m.sender]
    return conn.reply(m.chat, `*❌ 𝐈𝐥 𝐭𝐮𝐨 𝐬𝐚𝐥𝐝𝐨 𝐧𝐨𝐧 è 𝐩𝐢ù 𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭𝐞.*`, m)
  }

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🎰', key: m.key }
    })

    const reward = getSlotReward(sessione.importo)
    const generated = generateGridByReward(reward)

    let result = generated.grid
    let winningLine = generated.winningLine
    let win = reward.win

    let denaroText = ''
    let expText = ''

    if (win) {
      let denaroWin = reward.amount
      let xpWin = Math.floor(Math.random() * 51) + 50

      user.euro += denaroWin
      user.exp += xpWin

      denaroText = `+${formatNumber(denaroWin)}€`
      expText = `+${formatNumber(xpWin)}`
    } else {
      let denaroLose = sessione.possibilePerdita
      let xpLose = Math.floor(Math.random() * 31) + 20

      user.euro -= denaroLose
      user.exp = Math.max(0, user.exp - xpLose)

      denaroText = `-${formatNumber(denaroLose)}€`
      expText = `-${formatNumber(xpLose)}`
    }

    const { generateSlotMp4 } =
      await import(`../lib/cards/slot-card.js?update=${Date.now()}`)

    let mp4Path = await generateSlotMp4(result, {
      win,
      winningLine,
      esitoText: reward.type,
      denaroText,
      expText,
      saldoEuro: formatNumber(user.euro),
      saldoExp: formatNumber(user.exp),
      grid: true
    })

    cooldowns[m.sender] = Date.now()
    delete global.db.data.slotSessioni[m.sender]

    await conn.sendMessage(
      m.chat,
      {
        video: global.fs.readFileSync(mp4Path),
        gifPlayback: true
      },
      { quoted: m }
    )

    try {
      global.fs.unlinkSync(mp4Path)
    } catch {}

    await delay(RITARDO_RISULTATO)

  } catch (e) {
    console.error(e)

    delete global.db.data.slotSessioni[m.sender]

    return conn.reply(
      m.chat,
      '*❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥𝐥𝐚 𝐠𝐞𝐧𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥𝐥𝐚 𝐬𝐥𝐨𝐭.*',
      m
    )
  }
}

async function annullaSlot(m, conn) {
  global.db.data.slotSessioni || (global.db.data.slotSessioni = {})

  if (global.db.data.slotSessioni[m.sender]) {
    delete global.db.data.slotSessioni[m.sender]
  }

  return conn.reply(
    m.chat,
    `╭━━━━━━━❌━━━━━━━╮
*✦ 𝐀𝐗𝐈𝐎𝐍 𝐒𝐋𝐎𝐓 ✦*
╰━━━━━━━❌━━━━━━━╯

*📌 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚 è 𝐬𝐭𝐚𝐭𝐚 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐭𝐚.*

> *${footer}*`,
    m
  )
}

function getSlotReward(importo) {
  const roll = Math.random() * 100

  if (roll <= 5) {
    return {
      win: true,
      type: 'JACKPOT',
      multiplier: 5,
      amount: Math.floor(importo * 5)
    }
  }

  if (roll <= 15) {
    return {
      win: true,
      type: 'BIG WIN',
      multiplier: 3,
      amount: Math.floor(importo * 3)
    }
  }

  if (roll <= 50) {
    return {
      win: true,
      type: 'VITTORIA',
      multiplier: 1.8,
      amount: Math.floor(importo * 1.8)
    }
  }

  return {
    win: false,
    type: 'SCONFITTA',
    multiplier: 0,
    amount: importo
  }
}

function generateGridByReward(reward) {
  if (!reward.win) {
    let grid = generateGrid()

    while (checkWin(grid)) {
      grid = generateGrid()
    }

    return {
      grid,
      winningLine: null
    }
  }

  const grid = generateGrid()
  const lines = getLines()
  const winningLine = pick(lines)
  const symbol = pick(symbols)

  for (const [row, col] of winningLine) {
    grid[row][col] = symbol
  }

  return {
    grid,
    winningLine
  }
}

function generateGrid() {
  return [
    [pick(symbols), pick(symbols), pick(symbols)],
    [pick(symbols), pick(symbols), pick(symbols)],
    [pick(symbols), pick(symbols), pick(symbols)]
  ]
}

function getLines() {
  return [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ]
}

function checkWin(grid) {
  return getLines().some(line => {
    const [a, b, c] = line
    return grid[a[0]][a[1]] === grid[b[0]][b[1]] && grid[b[0]][b[1]] === grid[c[0]][c[1]]
  })
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function parseAmount(input) {
  let value = String(input || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/\./g, '')

  if (!/^\d+$/.test(value)) return null

  return parseInt(value)
}

function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num || 0)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}