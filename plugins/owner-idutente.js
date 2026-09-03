let handler = async (m, { conn, mentionedJid }) => {
let jid =
mentionedJid?.[0] ||
m.quoted?.sender ||
m.sender

await conn.sendButton(
m.chat,
`*🆔 ID UTENTE:*\n\n\`${jid}\``,
'> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*',
null,
null,
[['📋 Copia ID', jid]],
null,
m
)
}

handler.help = ['id']
handler.tags = ['owner']
handler.command = /^id$/i
handler.owner = true

export default handler