import { performance } from 'perf_hooks';

const handler = async (message, { conn, usedPrefix = '.' }) => {

    const userId = message.sender;
    const uptimeMs = process.uptime() * 1000;
    const uptimeStr = clockString(uptimeMs);
    const totalUsers = Object.keys(global.db?.data?.users || {}).length;

const menuBody = `
『 *𝑵𝑰𝑮𝑮𝑨 • 𝐌𝐄𝐍𝐔* 』

⌬ 🚀 ${usedPrefix}*ping*
⌬ ⚙️ ${usedPrefix}*sistema*
⌬ 📝 ${usedPrefix}*segnala*
⌬ 📦 ${usedPrefix}*repo*
⌬ 👥 ${usedPrefix}*staff*

⌬ • *ᴠᴇʀsɪᴏɴᴇ:* ${global.versione}
⌬ • *ᴜᴛᴇɴᴛɪ:* ${totalUsers}
⌬ • *ᴅᴇᴠ:* _Trio dei gay_
`.trim()

const buttons = [
  { buttonId: `${usedPrefix}utente`, buttonText: { displayText: '👤 UTENTE' }, type: 1 },
  { buttonId: `${usedPrefix}admin`, buttonText: { displayText: '🛡️ ADMIN' }, type: 1 },
  { buttonId: `${usedPrefix}mod`, buttonText: { displayText: '👮‍♂️ MOD' }, type: 1 },
  { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 },
  { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
  { buttonId: `${usedPrefix}strumenti`, buttonText: { displayText: '🛠️ STRUMENTI' }, type: 1 }
]

    await conn.sendMessage(message.chat, {
        image: { url: './media/main-menu.jpeg' },
        caption: menuBody,
        footer: 'sᴇʟᴇᴢɪᴏɴᴀ ᴜɴ ᴍᴏᴅᴜʟᴏ ᴅᴀʟʟ\'ɪɴᴛᴇʀғᴀᴄᴄɪᴀ',
        buttons: buttons,
        headerType: 4,
        mentions: [userId]
    }, { quoted: message });
};

function clockString(ms) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
}

handler.help = ['menu', 'comandi'];
handler.tags = ['menu'];
handler.command = /^(menu|comandi)$/i;

export default handler;