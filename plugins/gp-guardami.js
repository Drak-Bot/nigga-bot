let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, {
            text: '⏳ 𝑰𝒏 𝒂𝒕𝒕𝒆𝒔𝒂 𝒅𝒆𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐...'
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await conn.sendMessage(m.chat, {
            text: '🔄 𝑹𝒊𝒑𝒓𝒐𝒗𝒐 𝒂 𝒓𝒊𝒑𝒓𝒊𝒔𝒕𝒊𝒏𝒂𝒓𝒆 𝒍𝒂 𝒗𝒊𝒔𝒊𝒐𝒏𝒆 𝒅𝒆𝒊 𝒎𝒊𝒆𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊...'
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await conn.sendMessage(m.chat, {
            text: '✅ 𝑭𝒂𝒕𝒕𝒐.\n\n𝑷𝒓𝒐𝒗𝒂 𝒂 𝒗𝒆𝒅𝒆𝒓𝒆 𝒏𝒖𝒐𝒗𝒂𝒎𝒆𝒏𝒕𝒆 𝒊 𝒎𝒊𝒆𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊.'
        });

    } catch (e) {
        console.error('Errore comando guardami:', e);
        await m.reply('❌ Si è verificato un errore durante il tentativo di ripristino.');
    }
};

handler.command = ['guardami'];

export default handler;