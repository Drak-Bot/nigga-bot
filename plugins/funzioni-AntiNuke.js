const handler = m => m;

const registeredAdmins = [
  '393204514107@s.whatsapp.net',
  '393516908130@s.whatsapp.net',
  '447598974929@s.whatsapp.net',
];

handler.before = async function (m, { conn, participants, isBotAdmin }) {
  if (!m.isGroup) return;

  const chat = global.db.data.chats[m.chat];
  if (!chat?.antinuke) return;

  if (![29, 30].includes(m.messageStubType)) return;

  const decode = jid => {
    try {
      return conn.decodeJid(jid);
    } catch {
      return jid;
    }
  };

  const sender = decode(
    m.key?.participant ||
    m.participant ||
    m.sender
  );

  const botJid = decode(conn.user.id);

  const BOT_OWNERS = (global.owner || [])
    .map(o => decode(
      o[0].includes('@')
        ? o[0]
        : o[0] + '@s.whatsapp.net'
    ));

  const dynamicAdmins = (chat.antinukeAdmins || [])
    .map(decode);

  let metadata;

  try {
    metadata = await conn.groupMetadata(m.chat);
  } catch {
    metadata = null;
  }

  const founderJid = metadata?.owner
    ? decode(metadata.owner)
    : null;

  const allowed = [
    botJid,
    ...BOT_OWNERS,
    ...registeredAdmins.map(decode),
    ...dynamicAdmins,
    founderJid
  ].filter(Boolean);

  if (allowed.includes(sender)) return;

  if (sender === botJid) {
    for (const owner of BOT_OWNERS) {
      try {
        await conn.sendMessage(owner, {
          text:
            `⚠️ *ANTI-NUKE ALERT*\n\n` +
            `Il bot è stato rimosso dagli amministratori di un gruppo.\n\n` +
            `👤 Azione eseguita da: @${sender.split('@')[0]}\n` +
            `💬 Gruppo: ${m.chat}\n\n` +
            `ℹ️ Il bot non può eseguire demote finché non dispone dei privilegi admin.`,
          mentions: [sender]
        });
      } catch {}
    }

    return;
  }

  if (!isBotAdmin) return;

  const groupParticipants =
    participants?.length
      ? participants
      : metadata?.participants || [];

  const usersToDemote = groupParticipants
    .filter(p => p.admin)
    .map(p => decode(p.jid || p.id))
    .filter(jid =>
      jid &&
      !allowed.includes(jid)
    );

  if (!usersToDemote.length) return;

  await Promise.all(
    usersToDemote.map(async jid => {
      try {
        await conn.groupParticipantsUpdate(
          m.chat,
          [jid],
          'demote'
        );
      } catch (e) {
        console.error(
          `[ANTINUKE] Errore demote ${jid}:`,
          e
        );
      }
    })
  );

  const action =
    m.messageStubType === 29
      ? 'Promozione'
      : 'Retrocessione';

  const text = `
⚡ *ANTI-NUKE*

🚨 *AZIONE NON AUTORIZZATA*

👤 @${sender.split('@')[0]}
ha eseguito una ${action.toLowerCase()} non autorizzata.

🔒 *AMMINISTRATORI DEMOTATI:*
${usersToDemote.map(j => `• @${j.split('@')[0]}`).join('\n')}
`.trim();

  try {
    await conn.sendMessage(m.chat, {
      text,
      mentions: [
        sender,
        ...usersToDemote,
        ...BOT_OWNERS
      ]
    });
  } catch (e) {
    console.error('[ANTINUKE] Errore invio messaggio:', e);
  }
};

export default handler;