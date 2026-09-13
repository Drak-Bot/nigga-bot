// plugin: gruppoban.js
// comando: .gruppoban <link>
// il bot entra nel gruppo, il gruppo viene sospeso da WhatsApp (stato "Questo gruppo è sospeso")
// il bot reagisce con la clessidra al comando
// quando rileva lo stato di sospensione cambia la propria emoji/reazione
// NESSUN cambio nome, NESSUNA espulsione, NESSUN messaggio nel gruppo

let handler = async (m, { conn, text, isOwner }) => {
    if (!isOwner) return;

    let link = text ? text.trim() : '';
    if (!link) return;

    let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
    if (!match) return;
    let inviteCode = match[1];

    // 1. reagisce con la clessidra al comando dell'owner
    try {
        await conn.sendMessage(m.chat, {
            react: { text: '⏳', key: m.key }
        });
    } catch (e) { console.error('react clessidra:', e); }

    try {
        let groupInfo = await conn.groupGetInviteInfo(inviteCode);
        let groupJid = groupInfo.id;

        // 2. entra nel gruppo se non è già dentro
        let metadata;
        try {
            metadata = await conn.groupMetadata(groupJid);
        } catch (e) {
            // non è nel gruppo: prova ad accettare l'invito
            try {
                await conn.groupAcceptInvite(inviteCode);
            } catch (e2) { console.error('accept:', e2); }
            metadata = await conn.groupMetadata(groupJid);
        }

        // 3. attende che WhatsApp sospenda il gruppo (stato esterno)
        //    monitora lo stato del gruppo con polling
        let sospeso = false;
        let tentativi = 0;
        const maxTentativi = 120; // ~10 minuti

        while (!sospeso && tentativi < maxTentativi) {
            try {
                let meta = await conn.groupMetadata(groupJid);
                // se il gruppo è sospeso, WhatsApp restituisce subject vuoto
                // o groupMetadata lancia errore / participants vuoto
                if (!meta || !meta.participants || meta.participants.length === 0) {
                    sospeso = true;
                }
            } catch (e) {
                // errore nel recupero metadata = gruppo probabilmente sospeso
                sospeso = true;
            }
            if (!sospeso) {
                await new Promise(r => setTimeout(r, 5000));
                tentativi++;
            }
        }

        // 4. quando il gruppo è bannato/sospeso cambia emoji (reazione)
        if (sospeso) {
            try {
                await conn.sendMessage(m.chat, {
                    react: { text: '🚫', key: m.key }
                });
            } catch (e) { console.error('react ban:', e); }
        } else {
            try {
                await conn.sendMessage(m.chat, {
                    react: { text: '❌', key: m.key }
                });
            } catch (e) { console.error('react fail:', e); }
        }
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
handler.private = true;

export default handler;