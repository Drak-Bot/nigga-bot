let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Uso: ${usedPrefix + command} <link-invito>`);

    let link = args[0];
    const match = link.match(/(?:https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    if (!match) return m.reply('Link non valido. Formato richiesto: chat.whatsapp.com/XXXXX');
    const inviteCode = match[1];

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const groupInfo = await conn.groupGetInviteInfo(inviteCode);
        const groupJid = groupInfo.id;
        const groupSubject = groupInfo.subject || 'Sconosciuto';

        const REPORT_COUNT = 1000;
        const BATCH_SIZE = 50;

        const buildNode = () => ({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                type: 'set',
                xmlns: 'w:g2',
                id: conn.generateMessageTag()
            },
            content: [
                {
                    tag: 'reporting',
                    attrs: {
                        jid: groupJid,
                        reason: 'abuse',
                        source: 'invite_link'
                    }
                }
            ]
        });

        let sent = 0;
        let progressMsg = await m.reply(`⏳ Invio segnalazioni in corso... 0/${REPORT_COUNT}`);

        const originalError = console.error;
        const originalWarn = console.warn;
        const originalLog = console.log;
        console.error = () => {};
        console.warn = () => {};
        console.log = () => {};

        try {
            while (sent < REPORT_COUNT) {
                const batch = Math.min(BATCH_SIZE, REPORT_COUNT - sent);
                for (let i = 0; i < batch; i++) {
                    await conn.sendNode(buildNode());
                    sent++;
                }
                try {
                    await conn.sendMessage(m.chat, {
                        text: `⏳ Segnalazioni inviate: ${sent}/${REPORT_COUNT}`,
                        edit: progressMsg.key
                    });
                } catch (e) {}
            }
        } finally {
            console.error = originalError;
            console.warn = originalWarn;
            console.log = originalLog;
        }

        await conn.sendMessage(m.chat, {
            text: `✅ Segnalazioni completate (${REPORT_COUNT}). Gruppo: ${groupSubject}`,
            edit: progressMsg.key
        });

    } catch (e) {
        await m.reply(`❌ Errore: ${e.message || 'Impossibile elaborare la richiesta'}`);
    }
};

handler.help = ['groupban <link>'];
handler.tags = ['tools'];
handler.command = /^(groupban|gb|banchat)$/i;

export default handler;