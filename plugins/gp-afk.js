const afkUsers = global.afkUsers || (global.afkUsers = new Map());

const handler = async (m, { text, conn }) => {
if (!text || !text.trim()) return;

const sender = conn.decodeJid(m.sender);
const reason = text.trim();

afkUsers.set(sender, {
reason,
time: Date.now()
});

await m.reply(
"💤 *AFK ATTIVATO*\n\n" +
"👤 @${sender.split('@')[0]}\n" +
"📝 Motivo: ${reason}\n" +
"⏰ Da: ${new Date().toLocaleTimeString('it-IT')}",
null,
{ mentions: [sender] }
);
};

handler.help = ['afk <motivo>'];
handler.tags = ['gruppo'];
handler.command = /^afk$/i;
handler.group = true;

export default handler;