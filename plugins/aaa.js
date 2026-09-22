let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('Rispondi al messaggio che vuoi eliminare!')

  try {
    let participant = m.quoted.sender || m.quoted.participant || m.quoted.key?.participant
    let remoteJid = m.quoted.chat || m.chat
    let id = m.quoted.id || m.quoted.key?.id
    let fromMe = m.quoted.fromMe ?? m.quoted.key?.fromMe ?? false

    let key = {
      remoteJid: remoteJid,
      fromMe: fromMe,
      id: id,
      participant: participant
    }

    await conn.sendMessage(m.chat, { delete: key })
  } catch (e) {
    console.error(e)
  }
}

handler.command = /^eliminaraid$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
