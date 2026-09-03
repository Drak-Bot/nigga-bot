let handler = async (m, { conn, args, command }) => {
await m.reply('`𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 ha abbandonato il gruppo correttamente*✅️`') 
await  conn.groupLeave(m.chat)}
handler.command = /^(out|leave|byebye)$/i
handler.group = true
handler.rowner = true
export default handler