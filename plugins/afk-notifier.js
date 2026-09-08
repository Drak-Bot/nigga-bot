const handler = async (m, { conn }) => {
  try {
    // Inizializza il Map globale se non esiste
    if (!global.afkUsers) {
      global.afkUsers = new Map();
    }

    const userId = m.sender;

    // Controlla se l'utente era AFK
    if (global.afkUsers.has(userId)) {
      const afkData = global.afkUsers.get(userId);
      const timeAFK = Date.now() - afkData.timestamp;

      // Converte il tempo in formato leggibile
      const ore = Math.floor(timeAFK / (1000 * 60 * 60));
      const minuti = Math.floor((timeAFK % (1000 * 60 * 60)) / (1000 * 60));
      const secondi = Math.floor((timeAFK % (1000 * 60)) / 1000);

      let tempoFormattato = '';
      if (ore > 0) tempoFormattato += `${ore}h `;
      if (minuti > 0) tempoFormattato += `${minuti}m `;
      if (secondi > 0) tempoFormattato += `${secondi}s`;

      tempoFormattato = tempoFormattato.trim() || '0s';

      // Rimuove l'utente dalla lista AFK
      global.afkUsers.delete(userId);

      // Invia il messaggio di ritorno
      const nome = m.pushName || 'Utente';
      await conn.sendMessage(m.chat, {
        text: `✅ @${userId.split('@')[0]} *non è più AFK*\n\n⏱️ *Tempo AFK:* ${tempoFormattato}\n📝 *Motivo:* ${afkData.motivo}`,
        mentions: [userId]
      }, { quoted: m });
    }

  } catch (e) {
    console.error('Errore AFK Notifier:', e);
  }
};

handler.all = true;

export default handler;
