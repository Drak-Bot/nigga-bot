global.workSession = global.workSession || {}

const workCooldown = 10 * 60 * 1000

const jobs = [
  {
    nome: '🍔 𝐂𝐚𝐦𝐞𝐫𝐢𝐞𝐫𝐞',
    min: 50,
    max: 100,
    eventi: [
      {
        txt: '*𝐔𝐧 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐭𝐢 𝐥𝐚𝐬𝐜𝐢𝐚 𝐮𝐧𝐚 𝐦𝐚𝐧𝐜𝐢𝐚 𝐬𝐞 𝐥𝐨 𝐬𝐞𝐫𝐯𝐢 𝐬𝐮𝐛𝐢𝐭𝐨.*',
        opzioni: ['1️⃣ 𝐂𝐨𝐫𝐫𝐢 𝐚𝐥 𝐭𝐚𝐯𝐨𝐥𝐨', '2️⃣ 𝐀𝐬𝐩𝐞𝐭𝐭𝐢 𝐢𝐥 𝐭𝐮𝐨 𝐭𝐮𝐫𝐧𝐨'],
        bonus: [20, 5]
      },
      {
        txt: '*𝐒𝐛𝐚𝐠𝐥𝐢 𝐮𝐧 𝐨𝐫𝐝𝐢𝐧𝐞.*',
        opzioni: ['1️⃣ 𝐑𝐢𝐟𝐚𝐢 𝐭𝐮𝐭𝐭𝐨', '2️⃣ 𝐅𝐚𝐢 𝐟𝐢𝐧𝐭𝐚 𝐝𝐢 𝐧𝐢𝐞𝐧𝐭𝐞'],
        bonus: [5, -15]
      },
      {
        txt: '*𝐈𝐥 𝐫𝐢𝐬𝐭𝐨𝐫𝐚𝐧𝐭𝐞 è 𝐩𝐢𝐞𝐧𝐨.*',
        opzioni: ['1️⃣ 𝐅𝐚𝐢 𝐬𝐭𝐫𝐚𝐨𝐫𝐝𝐢𝐧𝐚𝐫𝐢', '2️⃣ 𝐓𝐢 𝐥𝐢𝐦𝐢𝐭𝐢 𝐚𝐥 𝐭𝐮𝐨 𝐭𝐮𝐫𝐧𝐨'],
        bonus: [25, 0]
      },
      {
        txt: '*𝐔𝐧 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐬𝐢 𝐥𝐚𝐦𝐞𝐧𝐭𝐚.*',
        opzioni: ['1️⃣ 𝐆𝐥𝐢 𝐨𝐟𝐟𝐫𝐢 𝐮𝐧 𝐝𝐨𝐥𝐜𝐞', '2️⃣ 𝐋𝐨 𝐢𝐠𝐧𝐨𝐫𝐢'],
        bonus: [10, -10]
      }
    ]
  },
  {
    nome: '💻 𝐅𝐫𝐞𝐞𝐥𝐚𝐧𝐜𝐞',
    min: 100,
    max: 200,
    eventi: [
      {
        txt: '*𝐈𝐥 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐯𝐮𝐨𝐥𝐞 𝐮𝐧𝐚 𝐫𝐞𝐯𝐢𝐬𝐢𝐨𝐧𝐞 𝐮𝐫𝐠𝐞𝐧𝐭𝐞.*',
        opzioni: ['1️⃣ 𝐀𝐜𝐜𝐞𝐭𝐭𝐢', '2️⃣ 𝐑𝐢𝐟𝐢𝐮𝐭𝐢'],
        bonus: [30, -10]
      },
      {
        txt: '*𝐓𝐫𝐨𝐯𝐢 𝐮𝐧 𝐛𝐮𝐠 𝐚𝐥𝐥’𝐮𝐥𝐭𝐢𝐦𝐨.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐬𝐨𝐥𝐯𝐢 𝐬𝐮𝐛𝐢𝐭𝐨', '2️⃣ 𝐋𝐨 𝐢𝐠𝐧𝐨𝐫𝐢'],
        bonus: [15, -20]
      },
      {
        txt: '*𝐔𝐧 𝐩𝐫𝐨𝐠𝐞𝐭𝐭𝐨 𝐩𝐚𝐠𝐚 𝐝𝐢 𝐩𝐢𝐮̀ 𝐦𝐚 𝐡𝐚 𝐬𝐜𝐚𝐝𝐞𝐧𝐳𝐚 𝐬𝐭𝐫𝐞𝐭𝐭𝐚.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐚𝐜𝐜𝐞𝐭𝐭𝐢', '2️⃣ 𝐏𝐫𝐞𝐟𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐥𝐚𝐯𝐨𝐫𝐨 𝐬𝐢𝐜𝐮𝐫𝐨'],
        bonus: [35, 10]
      },
      {
        txt: '*𝐈𝐥 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐭𝐚𝐫𝐝𝐚 𝐢𝐥 𝐩𝐚𝐠𝐚𝐦𝐞𝐧𝐭𝐨.*',
        opzioni: ['1️⃣ 𝐈𝐧𝐯𝐢𝐢 𝐮𝐧 𝐬𝐨𝐥𝐥𝐞𝐜𝐢𝐭𝐨', '2️⃣ 𝐀𝐬𝐩𝐞𝐭𝐭𝐢 𝐢𝐧 𝐬𝐢𝐥𝐞𝐧𝐳𝐢𝐨'],
        bonus: [20, -5]
      }
    ]
  },
  {
    nome: '🧹 𝐏𝐮𝐥𝐢𝐳𝐢𝐞',
    min: 30,
    max: 60,
    eventi: [
      {
        txt: '*𝐓𝐫𝐨𝐯𝐢 𝐮𝐧𝐚 𝐳𝐨𝐧𝐚 𝐩𝐢𝐮̀ 𝐬𝐩𝐨𝐫𝐜𝐚 𝐝𝐞𝐥 𝐩𝐫𝐞𝐯𝐢𝐬𝐭𝐨.*',
        opzioni: ['1️⃣ 𝐏𝐮𝐥𝐢𝐬𝐜𝐢 𝐭𝐮𝐭𝐭𝐨', '2️⃣ 𝐒𝐚𝐥𝐭𝐢 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐞'],
        bonus: [12, -8]
      },
      {
        txt: '*𝐔𝐧 𝐜𝐨𝐥𝐥𝐞𝐠𝐚 𝐭𝐢 𝐜𝐡𝐢𝐞𝐝𝐞 𝐚𝐢𝐮𝐭𝐨.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐚𝐢𝐮𝐭𝐢', '2️⃣ 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐢 𝐝𝐚 𝐬𝐨𝐥𝐨'],
        bonus: [10, 0]
      },
      {
        txt: '*𝐒𝐜𝐢𝐯𝐨𝐥𝐢 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐢𝐥 𝐥𝐚𝐯𝐨𝐫𝐨.*',
        opzioni: ['1️⃣ 𝐓𝐢 𝐟𝐞𝐫𝐦𝐢 𝐮𝐧 𝐚𝐭𝐭𝐢𝐦𝐨', '2️⃣ 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐢 𝐬𝐮𝐛𝐢𝐭𝐨'],
        bonus: [5, -10]
      }
    ]
  },
  {
    nome: '🚗 𝐂𝐨𝐫𝐫𝐢𝐞𝐫𝐞',
    min: 80,
    max: 160,
    eventi: [
      {
        txt: "*𝐂'è 𝐭𝐫𝐚𝐟𝐟𝐢𝐜𝐨 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐜𝐨𝐧𝐬𝐞𝐠𝐧𝐚.*",
        opzioni: ['1️⃣ 𝐂𝐚𝐦𝐛𝐢 𝐬𝐭𝐫𝐚𝐝𝐚', '2️⃣ 𝐀𝐬𝐩𝐞𝐭𝐭𝐢'],
        bonus: [20, 5]
      },
      {
        txt: '*𝐈𝐥 𝐩𝐚𝐜𝐜𝐨 𝐬𝐢 𝐝𝐚𝐧𝐧𝐞𝐠𝐠𝐢𝐚.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐦𝐛𝐨𝐫𝐬𝐢', '2️⃣ 𝐒𝐜𝐚𝐩𝐩𝐢'],
        bonus: [-5, -25]
      },
      {
        txt: '*𝐈𝐥 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐭𝐢 𝐝à 𝐮𝐧𝐚 𝐦𝐚𝐧𝐜𝐢𝐚 𝐬𝐞 𝐚𝐫𝐫𝐢𝐯𝐢 𝐩𝐫𝐢𝐦𝐚.*',
        opzioni: ['1️⃣ 𝐂𝐨𝐫𝐫𝐢 𝐝𝐢 𝐩𝐢𝐮̀', '2️⃣ 𝐌𝐚𝐧𝐭𝐢𝐞𝐧𝐢 𝐢𝐥 𝐫𝐢𝐭𝐦𝐨'],
        bonus: [25, 8]
      },
      {
        txt: '*𝐒𝐛𝐚𝐠𝐥𝐢 𝐢𝐧𝐝𝐢𝐫𝐢𝐳𝐳𝐨.*',
        opzioni: ['1️⃣ 𝐓𝐨𝐫𝐧𝐢 𝐢𝐧𝐝𝐢𝐞𝐭𝐫𝐨', '2️⃣ 𝐏𝐫𝐨𝐯𝐢 𝐚 𝐜𝐨𝐧𝐬𝐞𝐠𝐧𝐚𝐫𝐞 𝐜𝐨𝐦𝐮𝐧𝐪𝐮𝐞'],
        bonus: [5, -20]
      }
    ]
  },
  {
    nome: '🛠️ 𝐌𝐚𝐧𝐨𝐯𝐚𝐥𝐞',
    min: 60,
    max: 120,
    eventi: [
      {
        txt: '*𝐓𝐢 𝐨𝐟𝐟𝐫𝐨𝐧𝐨 𝐮𝐧𝐨 𝐬𝐭𝐫𝐚𝐨𝐫𝐝𝐢𝐧𝐚𝐫𝐢𝐨.*',
        opzioni: ['1️⃣ 𝐀𝐜𝐜𝐞𝐭𝐭𝐢', '2️⃣ 𝐑𝐢𝐟𝐢𝐮𝐭𝐢'],
        bonus: [20, 0]
      },
      {
        txt: '*𝐔𝐧 𝐚𝐭𝐭𝐫𝐞𝐳𝐳𝐨 𝐬𝐢 𝐫𝐨𝐦𝐩𝐞.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐬𝐨𝐬𝐭𝐢𝐭𝐮𝐢𝐬𝐜𝐢', '2️⃣ 𝐂𝐨𝐧𝐭𝐢𝐧𝐮𝐢 𝐜𝐨𝐬𝐢̀'],
        bonus: [5, -15]
      },
      {
        txt: '*𝐈𝐥 𝐜𝐚𝐩𝐨 𝐧𝐨𝐭𝐚 𝐢𝐥 𝐭𝐮𝐨 𝐢𝐦𝐩𝐞𝐠𝐧𝐨.*',
        opzioni: ['1️⃣ 𝐃𝐚𝐢 𝐢𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨', '2️⃣ 𝐓𝐢 𝐫𝐢𝐩𝐨𝐬𝐢'],
        bonus: [15, 0]
      }
    ]
  },
  {
    nome: '📦 𝐌𝐚𝐠𝐚𝐳𝐳𝐢𝐧𝐢𝐞𝐫𝐞',
    min: 55,
    max: 110,
    eventi: [
      {
        txt: '*𝐀𝐫𝐫𝐢𝐯𝐚 𝐮𝐧𝐚 𝐬𝐩𝐞𝐝𝐢𝐳𝐢𝐨𝐧𝐞 𝐢𝐦𝐩𝐫𝐞𝐯𝐢𝐬𝐭𝐚.*',
        opzioni: ['1️⃣ 𝐓𝐢 𝐨𝐜𝐜𝐮𝐩𝐢 𝐝𝐢 𝐭𝐮𝐭𝐭𝐨', '2️⃣ 𝐀𝐬𝐩𝐞𝐭𝐭𝐢 𝐚𝐢𝐮𝐭𝐨'],
        bonus: [18, 5]
      },
      {
        txt: '*𝐂𝐨𝐧𝐟𝐨𝐧𝐝𝐢 𝐝𝐮𝐞 𝐜𝐨𝐥𝐥𝐢.*',
        opzioni: ['1️⃣ 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐢 𝐭𝐮𝐭𝐭𝐨', '2️⃣ 𝐒𝐩𝐞𝐝𝐢𝐬𝐜𝐢 𝐥𝐨 𝐬𝐭𝐞𝐬𝐬𝐨'],
        bonus: [8, -18]
      },
      {
        txt: '*𝐓𝐫𝐨𝐯𝐢 𝐮𝐧 𝐦𝐞𝐭𝐨𝐝𝐨 𝐩𝐢𝐮̀ 𝐯𝐞𝐥𝐨𝐜𝐞 𝐩𝐞𝐫 𝐬𝐢𝐬𝐭𝐞𝐦𝐚𝐫𝐞 𝐥𝐞 𝐬𝐜𝐚𝐭𝐨𝐥𝐞.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐮𝐬𝐢', '2️⃣ 𝐑𝐞𝐬𝐭𝐢 𝐧𝐞𝐥 𝐦𝐞𝐭𝐨𝐝𝐨 𝐜𝐥𝐚𝐬𝐬𝐢𝐜𝐨'],
        bonus: [15, 5]
      }
    ]
  },
  {
    nome: '🚕 𝐓𝐚𝐬𝐬𝐢𝐬𝐭𝐚',
    min: 70,
    max: 140,
    eventi: [
      {
        txt: '*𝐔𝐧 𝐩𝐚𝐬𝐬𝐞𝐠𝐠𝐞𝐫𝐨 𝐭𝐢 𝐜𝐡𝐢𝐞𝐝𝐞 𝐝𝐢 𝐚𝐧𝐝𝐚𝐫𝐞 𝐩𝐢𝐮̀ 𝐯𝐞𝐥𝐨𝐜𝐞.*',
        opzioni: ['1️⃣ 𝐀𝐜𝐜𝐞𝐭𝐭𝐢', '2️⃣ 𝐑𝐢𝐬𝐩𝐞𝐭𝐭𝐢 𝐢 𝐥𝐢𝐦𝐢𝐭𝐢'],
        bonus: [20, 8]
      },
      {
        txt: '*𝐒𝐛𝐚𝐠𝐥𝐢 𝐬𝐭𝐫𝐚𝐝𝐚.*',
        opzioni: ['1️⃣ 𝐂𝐡𝐢𝐞𝐝𝐢 𝐬𝐜𝐮𝐬𝐚', '2️⃣ 𝐅𝐚𝐢 𝐟𝐢𝐧𝐭𝐚 𝐝𝐢 𝐧𝐢𝐞𝐧𝐭𝐞'],
        bonus: [5, -15]
      },
      {
        txt: '*𝐈𝐥 𝐩𝐚𝐬𝐬𝐞𝐠𝐠𝐞𝐫𝐨 𝐭𝐢 𝐥𝐚𝐬𝐜𝐢𝐚 𝐮𝐧𝐚 𝐦𝐚𝐧𝐜𝐢𝐚.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐧𝐠𝐫𝐚𝐳𝐢', '2️⃣ 𝐋𝐚 𝐩𝐫𝐞𝐧𝐝𝐢 𝐞 𝐛𝐚𝐬𝐭𝐚'],
        bonus: [15, 10]
      }
    ]
  },
  {
    nome: '📚 𝐋𝐢𝐛𝐫𝐚𝐢𝐨',
    min: 45,
    max: 95,
    eventi: [
      {
        txt: '*𝐔𝐧 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐜𝐞𝐫𝐜𝐚 𝐮𝐧 𝐥𝐢𝐛𝐫𝐨 𝐫𝐚𝐫𝐨.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐚𝐢𝐮𝐭𝐢 𝐜𝐨𝐧 𝐩𝐚𝐳𝐢𝐞𝐧𝐳𝐚', '2️⃣ 𝐆𝐥𝐢 𝐝𝐢𝐜𝐢 𝐝𝐢 𝐜𝐞𝐫𝐜𝐚𝐫𝐞 𝐝𝐚 𝐬𝐨𝐥𝐨'],
        bonus: [18, -5]
      },
      {
        txt: '*𝐂𝐚𝐝𝐞 𝐮𝐧𝐚 𝐩𝐢𝐥𝐚 𝐝𝐢 𝐥𝐢𝐛𝐫𝐢.*',
        opzioni: ['1️⃣ 𝐒𝐢𝐬𝐭𝐞𝐦𝐢 𝐭𝐮𝐭𝐭𝐨', '2️⃣ 𝐋𝐚𝐬𝐜𝐢 𝐜𝐨𝐬𝐢̀ 𝐩𝐞𝐫 𝐝𝐨𝐩𝐨'],
        bonus: [8, -12]
      },
      {
        txt: '*𝐑𝐢𝐞𝐬𝐜𝐢 𝐚 𝐯𝐞𝐧𝐝𝐞𝐫𝐞 𝐮𝐧𝐚 𝐞𝐝𝐢𝐳𝐢𝐨𝐧𝐞 𝐬𝐩𝐞𝐜𝐢𝐚𝐥𝐞.*',
        opzioni: ['1️⃣ 𝐒𝐩𝐢𝐞𝐠𝐡𝐢 𝐛𝐞𝐧𝐞 𝐢𝐥 𝐯𝐚𝐥𝐨𝐫𝐞', '2️⃣ 𝐋𝐚 𝐦𝐨𝐬𝐭𝐫𝐢 𝐬𝐨𝐥𝐨'],
        bonus: [20, 5]
      }
    ]
  },
  {
    nome: '🎨 𝐆𝐫𝐚𝐟𝐢𝐜𝐨',
    min: 90,
    max: 180,
    eventi: [
      {
        txt: '*𝐈𝐥 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐯𝐮𝐨𝐥𝐞 𝐮𝐧𝐚 𝐯𝐞𝐫𝐬𝐢𝐨𝐧𝐞 𝐢𝐧 𝐩𝐢𝐮̀ 𝐝𝐞𝐥 𝐥𝐨𝐠𝐨.*',
        opzioni: ['1️⃣ 𝐋𝐚 𝐟𝐚𝐢', '2️⃣ 𝐂𝐡𝐢𝐞𝐝𝐢 𝐮𝐧 𝐬𝐮𝐩𝐩𝐥𝐞𝐦𝐞𝐧𝐭𝐨'],
        bonus: [10, 20]
      },
      {
        txt: '*𝐔𝐧 𝐛𝐨𝐳𝐳𝐞𝐭𝐭𝐨 𝐧𝐨𝐧 𝐩𝐢𝐚𝐜𝐞.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐟𝐚𝐢', '2️⃣ 𝐈𝐧𝐬𝐢𝐬𝐭𝐢 𝐜𝐨𝐧 𝐪𝐮𝐞𝐥𝐥𝐨'],
        bonus: [12, -18]
      },
      {
        txt: '*𝐓𝐫𝐨𝐯𝐢 𝐮𝐧’𝐢𝐝𝐞𝐚 𝐜𝐫𝐞𝐚𝐭𝐢𝐯𝐚 𝐢𝐦𝐩𝐫𝐞𝐯𝐢𝐬𝐭𝐚.*',
        opzioni: ['1️⃣ 𝐋𝐚 𝐩𝐫𝐨𝐩𝐨𝐧𝐢', '2️⃣ 𝐑𝐞𝐬𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐜𝐮𝐫𝐨'],
        bonus: [25, 8]
      }
    ]
  },
  {
    nome: '☕ 𝐁𝐚𝐫𝐢𝐬𝐭𝐚',
    min: 40,
    max: 90,
    eventi: [
      {
        txt: '*𝐂’è 𝐮𝐧𝐚 𝐜𝐨𝐦𝐚𝐧𝐝𝐚 𝐠𝐫𝐨𝐬𝐬𝐚 𝐝𝐚 𝐩𝐫𝐞𝐩𝐚𝐫𝐚𝐫𝐞.*',
        opzioni: ['1️⃣ 𝐓𝐢 𝐦𝐮𝐨𝐯𝐢 𝐯𝐞𝐥𝐨𝐜𝐞', '2️⃣ 𝐋𝐚𝐯𝐨𝐫𝐢 𝐜𝐨𝐧 𝐜𝐚𝐥𝐦𝐚'],
        bonus: [18, 6]
      },
      {
        txt: '*𝐕𝐞𝐫𝐬𝐢 𝐮𝐧 𝐜𝐚𝐟𝐟è.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐟𝐚𝐢 𝐬𝐮𝐛𝐢𝐭𝐨', '2️⃣ 𝐒𝐞𝐫𝐯𝐢 𝐪𝐮𝐞𝐥𝐥𝐨 𝐫𝐢𝐦𝐚𝐬𝐭𝐨'],
        bonus: [5, -12]
      },
      {
        txt: '*𝐔𝐧 𝐜𝐥𝐢𝐞𝐧𝐭𝐞 𝐚𝐩𝐩𝐫𝐞𝐳𝐳𝐚 𝐢𝐥 𝐭𝐮𝐨 𝐬𝐞𝐫𝐯𝐢𝐳𝐢𝐨.*',
        opzioni: ['1️⃣ 𝐋𝐨 𝐫𝐢𝐧𝐠𝐫𝐚𝐳𝐢 𝐜𝐨𝐫𝐝𝐢𝐚𝐥𝐦𝐞𝐧𝐭𝐞', '2️⃣ 𝐅𝐚𝐢 𝐬𝐨𝐥𝐨 𝐮𝐧 𝐜𝐞𝐧𝐧𝐨'],
        bonus: [12, 5]
      }
    ]
  }
]

const box = (emoji, title, body) => `╭━━━━━━━${emoji}━━━━━━━╮
*✦ ${title} ✦*
╰━━━━━━━${emoji}━━━━━━━╯

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

function getButtonId(m) {
  const msg = m.message || {}
  return (
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.templateButtonReplyMessage?.selectedId ||
    m.text ||
    ''
  ).trim()
}

async function sendEvent(conn, chat, quoted, event, step) {
  const text = box(
    '📌',
    `𝐄𝐕𝐄𝐍𝐓𝐎 ${step}`,
    `${event.txt}

*${event.opzioni[0]}*
*${event.opzioni[1]}*`
  )

  return conn.sendMessage(chat, {
    text,
    footer: '',
    buttons: [
      {
        buttonId: '.work1',
        buttonText: { displayText: '1️⃣ 𝐒𝐜𝐞𝐥𝐭𝐚 𝟏' },
        type: 1
      },
      {
        buttonId: '.work2',
        buttonText: { displayText: '2️⃣ 𝐒𝐜𝐞𝐥𝐭𝐚 𝟐' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted })
}

let handler = async (m, { conn }) => {
  const user = m.sender

  if (!global.db.data.users[user]) {
    global.db.data.users[user] = { euro: 0, xp: 0, level: 1, lastWork: 0 }
  }

  const u = global.db.data.users[user]

  if (typeof u.euro !== 'number') u.euro = 0
  if (typeof u.xp !== 'number') u.xp = 0
  if (typeof u.level !== 'number') u.level = 1
  if (typeof u.lastWork !== 'number') u.lastWork = 0

  const time = workCooldown - (Date.now() - u.lastWork)

  if (time > 0) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)

    return conn.reply(
      m.chat,
      box(
        '⏳',
        '𝐋𝐀𝐕𝐎𝐑𝐎',
        `*𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚:* ${minutes}𝐦 ${seconds}𝐬`
      ),
      m
    )
  }

  const job = random(jobs)
  const base = randomNum(job.min, job.max)
  const chosenEvents = shuffle([...job.eventi]).slice(0, 2)

  global.workSession[user] = {
    step: 0,
    job,
    base,
    events: chosenEvents,
    total: base
  }

  const intro = box(
    '💼',
    '𝐋𝐀𝐕𝐎𝐑𝐎',
    `*🧑‍💼 𝐋𝐚𝐯𝐨𝐫𝐨:* ${job.nome}
*💸 𝐏𝐚𝐠𝐚 𝐛𝐚𝐬𝐞:* ${formatNumber(base)}

*𝐒𝐭𝐚𝐢 𝐢𝐧𝐢𝐳𝐢𝐚𝐧𝐝𝐨 𝐢𝐥 𝐭𝐮𝐨 𝐭𝐮𝐫𝐧𝐨...*`
  )

  await conn.reply(m.chat, intro, m)
  return sendEvent(conn, m.chat, m, chosenEvents[0], 1)
}

handler.before = async (m, { conn }) => {
  const user = m.sender
  if (!global.workSession[user]) return

  const raw = getButtonId(m).toLowerCase()
  let input = null

  if (raw === '.work1' || raw === '1') input = 1
  if (raw === '.work2' || raw === '2') input = 2
  if (!input) return

  const session = global.workSession[user]
  const u = global.db.data.users[user]

  const ev = session.events[session.step]
  const choice = input - 1
  const bonus = ev.bonus[choice] || 0

  session.total += bonus

  await conn.reply(
    m.chat,
    box(
      '📌',
      '𝐒𝐂𝐄𝐋𝐓𝐀',
      `*✅ 𝐇𝐚𝐢 𝐬𝐜𝐞𝐥𝐭𝐨:* ${input}️⃣
*💸 𝐁𝐨𝐧𝐮𝐬:* ${formatNumber(bonus)}`
    ),
    m
  )

  session.step++

  if (session.step < session.events.length) {
    const next = session.events[session.step]
    return sendEvent(conn, m.chat, m, next, session.step + 1)
  }

  const total = session.total
  u.euro += total

  const xpGain = randomNum(5, 15)
  u.xp += xpGain
  u.lastWork = Date.now()

  let lvlUp = false
  const needed = u.level * 100

  if (u.xp >= needed) {
    u.level++
    u.xp = 0
    lvlUp = true
  }

  delete global.workSession[user]

  let msg = `*🧑‍💼 𝐋𝐚𝐯𝐨𝐫𝐨:* ${session.job.nome}
*💸 𝐆𝐮𝐚𝐝𝐚𝐠𝐧𝐨 𝐭𝐨𝐭𝐚𝐥𝐞:* ${formatNumber(total)}
*💼 𝐃𝐞𝐧𝐚𝐫𝐨:* ${formatNumber(u.euro)}
*🏅 𝐋𝐢𝐯𝐞𝐥𝐥𝐨:* ${u.level}
*⭐ 𝐄𝐗𝐏:* ${formatNumber(u.xp)}/${formatNumber(u.level * 100)}`

  if (lvlUp) {
    msg += `

*🎉 𝐋𝐄𝐕𝐄𝐋 𝐔𝐏!*`
  }

  return conn.reply(
    m.chat,
    box('✅', '𝐓𝐔𝐑𝐍𝐎 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐓𝐎', msg),
    m
  )
}

handler.help = ['work', 'lavora']
handler.tags = ['economy']
handler.command = /^(work|lavora)$/i

export default handler

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random())
}

function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num)
}