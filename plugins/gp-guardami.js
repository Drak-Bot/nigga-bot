let handler = async (m, { conn }) => {
    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    try {
        if (!m.isGroup) {
            await conn.sendMessage(m.chat, {
                text: '❌ Questo comando deve essere utilizzato in un gruppo.'
            });
            return;
        }

        if (!conn.authState?.keys) {
            await m.reply('❌ Sistema Signal non disponibile.');
            return;
        }

        await conn.authState.keys.set({
            'sender-key-memory': {
                [m.chat]: null
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await conn.sendMessage(m.chat, {
            text: '🔄 𝑺𝒊𝒏𝒄𝒓𝒐𝒏𝒊𝒛𝒛𝒂𝒛𝒊𝒐𝒏𝒆 𝒓𝒊𝒑𝒓𝒊𝒔𝒕𝒊𝒏𝒂𝒕𝒂.\n\n📡 𝑳𝒂 𝒄𝒉𝒊𝒂𝒗𝒆 𝒅𝒊 𝒔𝒊𝒄𝒖𝒓𝒆𝒛𝒛𝒂 𝒅𝒆𝒍 𝒈𝒓𝒖𝒑𝒑𝒐 𝒗𝒆𝒓𝒓𝒂̀ 𝒓𝒊𝒅𝒊𝒔𝒕𝒓𝒊𝒃𝒖𝒊𝒕𝒂.\n\n👀 𝑷𝒓𝒐𝒗𝒂 𝒐𝒓𝒂 𝒂 𝒗𝒆𝒅𝒆𝒓𝒆 𝒊 𝒑𝒓𝒐𝒔𝒔𝒊𝒎𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊.'
        });

    } catch (e) {
        console.error('Errore .guardami:', e);
        await m.reply(`❌ Errore durante la sincronizzazione:\n${e.message}`);
    }
};

handler.command = ['guardami'];
handler.group = true;
handler.owner = true;

export default handler;