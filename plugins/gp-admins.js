// richiamo admin by Bonzino

import fetch from 'node-fetch'
import fs from 'fs'

const handler = async (m, { conn, participants, groupMetadata, args, isOwner, isAdmin }) => {

    const cooldownInMilliseconds = 18 * 60 * 60 * 1000;

    if (!isOwner && !isAdmin) {
        const lastUsed = handler.cooldowns.get(m.sender) || 0;
        const now = Date.now();

        if (now - lastUsed < cooldownInMilliseconds) {
            const timeLeft = cooldownInMilliseconds - (now - lastUsed);

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const timeString =
                `${hours > 0 ? `${hours} 𝐨𝐫𝐞, ` : ''}` +
                `${minutes > 0 ? `${minutes} 𝐦𝐢𝐧𝐮𝐭𝐢 𝐞 ` : ''}` +
                `${seconds} 𝐬𝐞𝐜𝐨𝐧𝐝𝐢`;

            await m.reply(`*⏳ 𝐇𝐚𝐢 𝐠𝐢à 𝐜𝐡𝐢𝐚𝐦𝐚𝐭𝐨 𝐠𝐥𝐢 𝐚𝐝𝐦𝐢𝐧.*\n*𝐑𝐢𝐩𝐫𝐨𝐯𝐚 𝐭𝐫𝐚 ${timeString}.*`);
            return;
        }

        handler.cooldowns.set(m.sender, now);
    }

    const adminGruppo = participants.filter(p => p.admin);

    const mentionList = adminGruppo
        .map(p => conn.decodeJid(p.jid || p.id))
        .filter(jid => jid && jid.endsWith('@s.whatsapp.net'));

    const messaggioUtente = args.join(' ');

    const testo = `
*╭━━━━━━━🔔━━━━━━━╮*
*✦ 𝐑𝐈𝐂𝐇𝐈𝐄𝐒𝐓𝐀 𝐀𝐃𝐌𝐈𝐍 ✦*
*╰━━━━━━━🔔━━━━━━━╯*

*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${m.sender.split('@')[0]}

*📢 𝐀𝐝𝐦𝐢𝐧 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨:*
${mentionList.map((jid, i) => `➤ ${i + 1}. @${jid.split('@')[0]}`).join('\n')}

*━━━━━━━━━━━━━━━━━━*

*💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:*
*${messaggioUtente || '𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨'}*
`.trim();

    let userPfp;

    try {
        userPfp = await conn.profilePictureUrl(m.sender, 'image');
    } catch {
        userPfp = './media/default-avatar.png';
    }

    const displayName =
        m.pushName ||
        await conn.getName(m.sender) ||
        'Utente';

    const fakeContact = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: '𝑵𝑰𝑮𝑮𝑨'
        },
        message: {
            contactMessage: {
                displayName,
                vcard:
`BEGIN:VCARD
VERSION:3.0
FN:${displayName}
TEL;type=CELL;type=VOICE;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
END:VCARD`,
                jpegThumbnail: Buffer.isBuffer(userPfp)
                    ? userPfp
                    : userPfp.startsWith('./')
                        ? await fs.promises.readFile(userPfp)
                        : await (await fetch(userPfp)).buffer()
            }
        },
        participant: '0@s.whatsapp.net'
    };

    await conn.sendMessage(m.chat, {
        text: testo,
        mentions: [...mentionList, m.sender]
    }, { quoted: fakeContact });

};

handler.cooldowns = new Map();

handler.help = ['admins <messaggio>'];
handler.tags = ['gruppo'];
handler.command = /^(admins)$/i;
handler.group = true;

handler.cooldown = 18 * 60 * 60 * 1000;

export default handler;