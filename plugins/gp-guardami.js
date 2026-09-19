let handler = async (m, { conn }) => {
    console.log('━━━━━━━━━━━━━━━━━━━━');
    console.log('[GUARDAMI] RICEVUTO');
    console.log('[GUARDAMI] sender:', m.sender);
    console.log('[GUARDAMI] chat:', m.chat);
    console.log('━━━━━━━━━━━━━━━━━━━━');

    try {
        await conn.sendMessage(m.chat, {
            text: '👁️ 𝑮𝑼𝑨𝑹𝑫𝑨𝑴𝑰 𝑨𝑻𝑻𝑰𝑽𝑨𝑻𝑶'
        });
    } catch (e) {
        console.error('[GUARDAMI ERROR]', e);
    }
};

handler.command = ['guardami'];
handler.group = true;

export default handler;