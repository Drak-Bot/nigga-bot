let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) return m.reply('Rispondi al messaggio che vuoi eliminare!')

  try {
    let delet = m.quoted.sender
    let bang = m.quoted.id
    let fromMe = m.quoted.fromMe

    await conn.sendMessage(m.chat, { 
      delete: { remoteJid: m.chat, fromMe: fromMe, id: bang, participant: delet } 
    })
  } catch (e) {
    console.error(e)
  }
}

handler.help = ['eliminaraid']
handler.tags = ['group']
handler.command = /^eliminaraid$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
