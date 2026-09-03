// aperto-chiuso by Bonzino

let handler=async(m,{conn,command})=>{
const aperto=/^aperto$/i.test(command)
await conn.groupSettingUpdate(
m.chat,
aperto?'not_announcement':'announcement'
)
await global.box(conn,m.chat,{
text:'\n> 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
title:aperto
?'ㅤ𝐂𝐡𝐚𝐭 𝐚𝐩𝐞𝐫𝐭𝐚 𝐚 𝐭𝐮𝐭𝐭𝐢 🟢'
:'ㅤ𝐂𝐡𝐚𝐭 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐚𝐝𝐦𝐢𝐧 🔴',
body:' ',
thumb:aperto?'aperto':'chiuso'
},{quoted:m})
}

handler.help=['aperto','chiuso']
handler.tags=['group']
handler.command=/^(aperto|chiuso)$/i
handler.group=true
handler.admin=true
handler.botAdmin=true

export default handler