let handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  let keysToClear = {};
  let memoryToClear = {};

  const meJid = conn.user?.id || conn.user?.jid || '';
  const meUser = meJid ? meJid.split(':')[0].split('@')[0] : '';
  const meDevice = meJid.includes(':') ? meJid.split(':')[1].split('@')[0] : '0';

  try {
    if (meUser) {
      keysToClear[`${m.chat}::${meUser}::${meDevice}`] = null;
    }

    memoryToClear[m.chat] = null;

    if (conn.authState?.keys?.set) {
      await conn.authState.keys.set({
        'sender-key': keysToClear,
        'sender-key-memory': memoryToClear
      });
    }

    await conn.groupMetadata(m.chat).catch(() => null);

  } catch (e) {
    console.error('[guardami] Errore reset keys:', e);

    return conn.reply(
      m.chat,
      `『 ❌ 』 *Sincronizzazione fallita*\n\n> Non è stato possibile aggiornare la sessione del gruppo.\n\n_Riprova tra qualche secondo._`,
      m
    );
  }

  return conn.sendMessage(
    m.chat,
    {
      text: `『 ✅ 』 *Gruppo sincronizzato!*\n\n> La sessione del gruppo è stata aggiornata correttamente.\n> Le chiavi di comunicazione sono state risincronizzate.\n\n*✓ Operazione completata*`
    },
    {
      quoted: m
    }
  );
};

handler.command = ['fix', 'ntevedo', 'guardami'];
handler.tags = ['gruppo'];
handler.help = ['guardami'];
handler.group = true;
handler.admin = false;
handler.botAdmin = false;

export default handler;