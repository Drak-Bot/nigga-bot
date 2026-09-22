let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('Rispondi al messaggio da eliminare!')

  let chatId = m.chat
  let target = m.quoted

  let id = target.id || target.key?.id
  let participant = target.sender || target.participant || target.key?.participant
  let fromMe = target.fromMe ?? target.key?.fromMe ?? false
  let remoteJid = target.chat || target.key?.remoteJid || chatId

  let errors = []

  // METODO 1: Standard Baileys Moderno con chiavi complete
  try {
    await conn.sendMessage(chatId, { 
      delete: { 
        remoteJid: remoteJid, 
        fromMe: fromMe, 
        id: id, 
        participant: participant 
      } 
    })
    return
  } catch (e) {
    errors.push("Metodo 1 fallito: " + e.message)
  }

  // METODO 2: Usando direttamente l'oggetto .key nativo del messaggio citato
  try {
    if (target.key) {
      await conn.sendMessage(chatId, { delete: target.key })
      return
    }
  } catch (e) {
    errors.push("Metodo 2 fallito: " + e.message)
  }

  // METODO 3: Usando .fakeObj.key (comune in molti wrapper e bot basati su Baileys)
  try {
    if (target.fakeObj?.key) {
      await conn.sendMessage(chatId, { delete: target.fakeObj.key })
      return
    }
  } catch (e) {
    errors.push("Metodo 3 fallito: " + e.message)
  }

  // METODO 4: Chiamata diretta alla funzione di eliminazione integrata nel messaggio se esiste
  try {
    if (typeof target.delete === 'function') {
      await target.delete()
      return
    }
  } catch (e) {
    errors.push("Metodo 4 fallito: " + e.message)
  }

  // METODO 5: Forzatura con remoteJid impostato sulla chat corrente e fromMe a false
  try {
    await conn.sendMessage(chatId, { 
      delete: { 
        remoteJid: chatId, 
        fromMe: false, 
        id: id, 
        participant: participant 
      } 
    })
    return
  } catch (e) {
    errors.push("Metodo 5 fallito: " + e.message)
  }

  // METODO 6: Struttura conchiave semplificata senza participant (per messaggi normali o varianti)
  try {
    await conn.sendMessage(chatId, { 
      delete: { 
        remoteJid: chatId, 
        fromMe: fromMe, 
        id: id 
      } 
    })
    return
  } catch (e) {
    errors.push("Metodo 6 fallito: " + e.message)
  }

  // METODO 7: Tentativo tramite protocolMessage o funzioni di revoca interne di Baileys
  try {
    if (typeof conn.sendMessage === 'function' && id) {
      await conn.sendMessage(chatId, { delete: { id: id, remoteJid: chatId, fromMe: false } })
      return
    }
  } catch (e) {
    errors.push("Metodo 7 fallito: " + e.message)
  }

  // Se nessun metodo ha funzionato, stampa gli errori in console per debug
  console.error("Tutti i tentativi di eliminazione raid sono falliti:", errors)
  return m.reply("Impossibile eliminare questo tipo di messaggio speciale. Controlla la console per i dettagli tecnici.")
}

handler.command = /^eliminaraid$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
