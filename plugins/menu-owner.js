//MenuOwner by Bonzino

import { performance } from 'perf_hooks'

const handler = async (message, { conn, usedPrefix = '.' }) => {
  const userId = message.sender
  const uptimeMs = process.uptime() * 1000
  const uptimeStr = clockString(uptimeMs)
  const totalUsers = Object.keys(global.db?.data?.users || {}).length

  const menuBody = `
『 𝑵𝑰𝑮𝑮𝑨 • 𝐎𝐖𝐍𝐄𝐑 』
╼━━━━━━━━━━━━━━╾
  ◈ *ᴜsᴇʀ:* @${userId.split('@')[0]}
  ◈ *ᴜᴘᴛɪᴍᴇ:* ${uptimeStr}
  ◈ *ᴜᴛᴇɴᴛɪ:* ${totalUsers}
  ◈ *ᴀᴄᴄᴇssᴏ:* ᴏᴡɴᴇʀ
╼━━━━━━━━━━━━━━╾

╭━〔 👤 ɢᴇsᴛɪᴏɴᴇ ᴜᴛᴇɴᴛɪ 〕━⬣
┃ 👮‍♂️ ${usedPrefix}addmod
┃ ❌ ${usedPrefix}delmod
┃ 🗑️ ${usedPrefix}resetmod
┃ 🚫 ${usedPrefix}blocca/sblocca <utente>
┃ 📃 ${usedPrefix}blocklist
┃ ➕️ ${usedPrefix}addowner <user> <numero>
┃ ❌️ ${usedPrefix}delowner <user> <numero>
╰━━━━━━━━━━━━━━━━⬣

╭━〔 ⏳ ʀᴜᴏʟɪ ᴛᴇᴍᴘᴏʀᴀɴᴇɪ 〕━⬣
┃ 👑 ${usedPrefix}tempadmin <utente/tempo>
┃ 📋 ${usedPrefix}listatempadmin
┃ ❌ ${usedPrefix}rtadmin
╰━━━━━━━━━━━━━━━━⬣

╭━〔 📊 sᴛᴀᴛɪsᴛɪᴄʜᴇ ᴜᴛᴇɴᴛɪ 〕━⬣
┃ ➕️ ${usedPrefix}addmoney <quantità> <user>
┃ ➖️ ${usedPrefix}removemoney <quantità> <user>
┃ 🗑 ${usedPrefix}azzerasoldi <quantità> <user>
┃ ➕️ ${usedPrefix}addmsg <quantità> <user>
┃ ➖️ ${usedPrefix}removemsg <quantità> <user>
┃ 🗑 ${usedPrefix}azzeramsg <user>
┃ 💬 ${usedPrefix}resetallmsg
┃ 💸 ${usedPrefix}resetallmoney
┃ 🗑️ ${usedPrefix}resetuser <utente>
┃ 🔄 ${usedPrefix}migrate <vecchio> <nuovo>
╰━━━━━━━━━━━━━━━━⬣

╭━〔 👥 ɢᴇsᴛɪᴏɴᴇ ɢʀᴜᴘᴘɪ 〕━⬣
┃ ➕ ${usedPrefix}adduser <utente> <link/id>
┃ ➖ ${usedPrefix}kickuser <utente> <link/id>
┃ 📥 ${usedPrefix}join <link>
┃ 🆔 ${usedPrefix}getid <link>
┃ 🔗 ${usedPrefix}linktoid <link>
┃ 🔃 ${usedPrefix}idtolink <id>
┃ 🗃 ${usedPrefix}gruppi
┃ 🚪 ${usedPrefix}esci <numero>
┃ 👋 ${usedPrefix}out 
┃ 🚫 ${usedPrefix}bangp <link/id>
┃ ✅️ ${usedPrefix}unbangp <link/id>
╰━━━━━━━━━━━━━━━━⬣

╭━〔 🤖 ɢᴇsᴛɪᴏɴᴇ ʙᴏᴛ 〕━⬣
┃ 🌐 ${usedPrefix}aggiorna
┃ ⚙️ ${usedPrefix}reload
┃ 🔄 ${usedPrefix}restart
┃ 🔍 ${usedPrefix}check
┃ 💾 ${usedPrefix}backupdb
┃ 🤖 ${usedPrefix}nomebot
┃ 📂 ${usedPrefix}path
┃ 🏷 ${usedPrefix}setnomebot
┃ 🔄 ${usedPrefix}prefisso/.resetprefisso
┃ 🖼 ${usedPrefix}setpicbot
┃ 🗄 ${usedPrefix}backupbot
╰━━━━━━━━━━━━━━━━⬣

╭━〔 📦 ɢᴇsᴛɪᴏɴᴇ ᴘᴀᴄᴄʜᴇᴛᴛɪ 〕━⬣
┃ 📂 ${usedPrefix}pacchetti
┃ 📥 ${usedPrefix}installa <nome>
┃ 🚀 ${usedPrefix}installapush <nome>
┃ 📦 ${usedPrefix}installaall
┃ 🗑️ ${usedPrefix}rimuovi <nome>
┃ ❌ ${usedPrefix}rimuovipush <nome>
┃ 🔍 ${usedPrefix}npmver <nome>
┃ ⚙️ ${usedPrefix}npmi <nome>
┃ 📤 ${usedPrefix}npmipush <nome>
┃ 🧹 ${usedPrefix}npmrm <nome>
┃ 📉 ${usedPrefix}npmrmpush <nome>
┃ 📜 ${usedPrefix}npmdl
╰━━━━━━━━━━━━━━━━⬣

╭━〔 ⚙️ ɢᴇsᴛɪᴏɴᴇ ᴘʟᴜɢɪɴ 〕━⬣
┃ 🧩 ${usedPrefix}plugin
┃ 📃 ${usedPrefix}listaplugin
┃ 🗂️ ${usedPrefix}pluginlist
┃ 📥 ${usedPrefix}getpl
┃ 🆕 ${usedPrefix}nuovoplugin
┃ 💾 ${usedPrefix}salvaplugin
┃ ✏️ ${usedPrefix}modificaplugin
┃ 🗑️ ${usedPrefix}eliminaplugin
╰━━━━━━━━━━━━━━━━⬣

╭━〔 📁 ɢᴇsᴛɪᴏɴᴇ ғɪʟᴇ 〕━⬣
┃ 🖼️ .save <nome>
┃ 📂 .listmedia
┃ 🔎 .getfile <nome>
┃ 🗑️ .delfile <nome>
┃ 📄 .fileinfo <nome>
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⚡ ғᴜɴᴢɪᴏɴɪ sᴘᴇᴄɪᴀʟɪ 〕━⬣
┃ ⚠️ ${usedPrefix}bigtag
┃ 💬 ${usedPrefix}spam
┃ ✋ ${usedPrefix}stop
┃ 👑 ${usedPrefix}godmode
┃ 📢 ${usedPrefix}tuttigp
┃ ‼️ ${usedPrefix}tagallgp
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 📌 ɪɴғᴏ 〕━⬣
┃ ᴠᴇʀsɪᴏɴᴇ: ${global.versione}
┃ sᴛᴀᴛᴜs: ᴏɴʟɪɴᴇ ⚡
╰━━━━━━━━━━━━━━━━⬣
`.trim()

  await conn.sendMessage(message.chat, {
    text: menuBody,
    mentions: [userId],
    footer: '> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
    buttons: [
      {
        buttonId: `${usedPrefix}menu`,
        buttonText: { displayText: '⬅️ Menu Principale' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: message })
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['owner']
handler.tags = ['menu']
handler.command = /^(owner)$/i

export default handler