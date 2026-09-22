let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('Rispondi al messaggio che vuoi eliminare!')

  try {
    let key = m.quoted.key || {
      remoteJid: m.chat,
      fromMe: m.quoted.fromMe,
      id: m.quoted.id,
      participant: m.quoted.sender
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
