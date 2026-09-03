const handler = async (m, { conn, args, usedPrefix, command }) => {
    const rawCommand = (args[0] || command).toLowerCase();

    const actions = {
        apri: 'aperto',
        aperto: 'aperto',
        chiudi: 'chiuso',
        chiuso: 'chiuso'
    };

    const action = actions[rawCommand];

    // ─────────────────────────────────────────────
    // 📖 MENU
    // ─────────────────────────────────────────────
    if (!action) {
        const menu = `
╭━〔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━╮
┃
┃  ⚙️  𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐆𝐑𝐔𝐏𝐏𝐎
┃
┃  Scegli un'azione:
┃
┃  🔓  ${usedPrefix}apri
┃  └─ 𝑨𝒑𝒓𝒊 𝒊𝒍 𝒈𝒓𝒖𝒑𝒑𝒐
┃
┃  🔒  ${usedPrefix}chiudi
┃  └─ 𝑪𝒉𝒊𝒖𝒅𝒊 𝒊𝒍 𝒈𝒓𝒖𝒑𝒑𝒐
┃
╰━━━━━━━━━━━━━━━━╯

        𓆩 ⚡ 𝑺𝑬𝑳𝑬𝒁𝑰𝑶𝑵𝑨 𝑼𝑵'𝑨𝒁𝑰𝑶𝑵𝑬 ⚡ 𓆪
`;

        const buttons = [
            {
                buttonId: `${usedPrefix}apri`,
                buttonText: { displayText: '🔓 𝐀𝐏𝐑𝐈 𝐆𝐑𝐔𝐏𝐏𝐎' },
                type: 1
            },
            {
                buttonId: `${usedPrefix}chiudi`,
                buttonText: { displayText: '🔒 𝐂𝐇𝐈𝐔𝐃𝐈 𝐆𝐑𝐔𝐏𝐏𝐎' },
                type: 1
            }
        ];

        return conn.sendMessage(
            m.chat,
            {
                text: menu,
                buttons,
                headerType: 1,
                contextInfo: global.fake
            },
            { quoted: m }
        );
    }

    // ─────────────────────────────────────────────
    // 🔐 CAMBIO STATO
    // ─────────────────────────────────────────────

    const setting =
        action === 'aperto'
            ? 'not_announcement'
            : 'announcement';

    await conn.groupSettingUpdate(m.chat, setting);

    const isOpen = action === 'aperto';

    const title = isOpen
        ? '🔓 𝑮𝑹𝑼𝑷𝑷𝑶 𝑨𝑷𝑬𝑹𝑻𝑶'
        : '🔒 𝑮𝑹𝑼𝑷𝑷𝑶 𝑪𝑯𝑰𝑼𝑺𝑶';

    const state = isOpen
        ? '𝐀𝐏𝐄𝐑𝐓𝐎'
        : '𝐂𝐇𝐈𝐔𝐒𝐎';

    const description = isOpen
        ? 'Tutti i membri possono inviare messaggi.'
        : 'Solo gli amministratori possono inviare messaggi.';

    const nextCommand = isOpen ? 'chiudi' : 'apri';

    const nextButton = isOpen
        ? '🔒 𝐂𝐇𝐈𝐔𝐃𝐈 𝐆𝐑𝐔𝐏𝐏𝐎'
        : '🔓 𝐀𝐏𝐑𝐈 𝐆𝐑𝐔𝐏𝐏𝐎';

    const confirmMessage = `
╭━〔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━╮
┃
┃       ${title}
┃
┃  ╭───────────────╮
┃  │  𝑺𝑻𝑨𝑻𝑼𝑺 : ${state}
┃  ╰───────────────╯
┃
┃  ✦ ${description}
┃
┃  ─────────────────
┃
┃  ⚡ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑶
┃  └─ ${usedPrefix}${nextCommand}
┃
╰━━━━━━━━━━━━━━━━╯
`;

    await conn.sendMessage(
        m.chat,
        {
            text: confirmMessage,
            buttons: [
                {
                    buttonId: `${usedPrefix}${nextCommand}`,
                    buttonText: { displayText: nextButton },
                    type: 1
                }
            ],
            headerType: 1,
            contextInfo: global.fake
        },
        { quoted: m }
    );
};

handler.help = [
    'aperto',
    'chiuso',
    'apri',
    'chiudi'
];

handler.tags = ['gruppo'];

handler.command = /^(aperto|chiuso|apri|chiudi)$/i;

handler.admin = true;
handler.botAdmin = true;

export default handler;