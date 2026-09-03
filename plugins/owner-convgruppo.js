// ConvertiGruppo by Bonzino

let handler=async(m,{conn,text,usedPrefix,command})=>{
const input=String(text||'').trim()
const isLinkToId=['linktoid','link2id'].includes(command)
const isIdToLink=['idtolink','id2link'].includes(command)

if(!input)return conn.reply(m.chat,`*╭━━━━━━━🔗━━━━━━━╮*
*✦ 𝐂𝐎𝐍𝐕𝐄𝐑𝐓𝐈𝐓𝐎𝐑𝐄 𝐆𝐑𝐔𝐏𝐏𝐈 ✦*
*╰━━━━━━━🔗━━━━━━━╯*

*📌 𝐋𝐢𝐧𝐤 → 𝐈𝐃*
*${usedPrefix}linktoid https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXX*

*📌 𝐈𝐃 → 𝐋𝐢𝐧𝐤*
*${usedPrefix}idtolink 1203630xxxxxxxxx@g.us*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,m)

if(isLinkToId){
const match=input.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/i)
if(!match)return conn.reply(m.chat,`*╭━━━━━━━❌━━━━━━━╮*
*✦ 𝐋𝐈𝐍𝐊 𝐍𝐎𝐍 𝐕𝐀𝐋𝐈𝐃𝐎 ✦*
*╰━━━━━━━❌━━━━━━━╯*

*𝐈𝐥 𝐥𝐢𝐧𝐤 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐧𝐨𝐧 è 𝐮𝐧 𝐥𝐢𝐧𝐤 𝐠𝐫𝐮𝐩𝐩𝐨 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐯𝐚𝐥𝐢𝐝𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,m)

try{
const info=await conn.groupGetInviteInfo(match[1])
const groupId=info.id||'Non trovato'
const testo=`*╭━━━━━━━🆔━━━━━━━╮*
*✦ 𝐆𝐑𝐎𝐔𝐏 𝐈𝐃 ✦*
*╰━━━━━━━🆔━━━━━━━╯*

*🏷 𝐍𝐨𝐦𝐞:* *${info.subject||'Sconosciuto'}*

*🆔 𝐈𝐃:*
\`${groupId}\``

return await global.sendCopy(conn,m,{text:testo,copy:groupId,button:'📋 𝐂𝐨𝐩𝐢𝐚 𝐈𝐃'})
}catch{
return conn.reply(m.chat,`*╭━━━━━━━⚠️━━━━━━━╮*
*✦ 𝐄𝐑𝐑𝐎𝐑𝐄 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍𝐄 ✦*
*╰━━━━━━━⚠️━━━━━━━╯*

*𝐍𝐨𝐧 𝐬𝐨𝐧𝐨 𝐫𝐢𝐮𝐬𝐜𝐢𝐭𝐨 𝐚 𝐫𝐢𝐜𝐚𝐯𝐚𝐫𝐞 𝐥'𝐈𝐃 𝐝𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐥𝐢𝐧𝐤.*
*𝐈𝐥 𝐥𝐢𝐧𝐤 𝐩𝐨𝐭𝐫𝐞𝐛𝐛𝐞 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐜𝐚𝐝𝐮𝐭𝐨 𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,m)
}
}

if(isIdToLink){
if(!/@g\.us$/i.test(input))return conn.reply(m.chat,`*╭━━━━━━━❌━━━━━━━╮*
*✦ 𝐈𝐃 𝐍𝐎𝐍 𝐕𝐀𝐋𝐈𝐃𝐎 ✦*
*╰━━━━━━━❌━━━━━━━╯*

*𝐃𝐞𝐯𝐢 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐮𝐧 𝐈𝐃 𝐠𝐫𝐮𝐩𝐩𝐨 𝐯𝐚𝐥𝐢𝐝𝐨.*
*𝐄𝐬𝐞𝐦𝐩𝐢𝐨:* \`1203630xxxxxxxxx@g.us\`

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,m)

try{
const code=await conn.groupInviteCode(input)
const metadata=await conn.groupMetadata(input).catch(()=>null)
const groupName=metadata?.subject||'Sconosciuto'
const inviteLink=`https://chat.whatsapp.com/${code}`
const testo=`*╭━━━━━━━🔗━━━━━━━╮*
*✦ 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐍𝐊 ✦*
*╰━━━━━━━🔗━━━━━━━╯*

*🏷 𝐍𝐨𝐦𝐞:* *${groupName}*

*📎 𝐋𝐢𝐧𝐤:*
${inviteLink}`

return await global.sendCopy(conn,m,{text:testo,copy:inviteLink,button:'📋 𝐂𝐨𝐩𝐢𝐚 𝐋𝐢𝐧𝐤'})
}catch{
return conn.reply(m.chat,`*╭━━━━━━━⚠️━━━━━━━╮*
*✦ 𝐄𝐑𝐑𝐎𝐑𝐄 𝐂𝐎𝐍𝐕𝐄𝐑𝐒𝐈𝐎𝐍𝐄 ✦*
*╰━━━━━━━⚠️━━━━━━━╯*

*𝐍𝐨𝐧 𝐬𝐨𝐧𝐨 𝐫𝐢𝐮𝐬𝐜𝐢𝐭𝐨 𝐚 𝐫𝐢𝐜𝐚𝐯𝐚𝐫𝐞 𝐢𝐥 𝐥𝐢𝐧𝐤 𝐝𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐈𝐃.*
*𝐈𝐥 𝐛𝐨𝐭 𝐩𝐨𝐭𝐫𝐞𝐛𝐛𝐞 𝐧𝐨𝐧 𝐞𝐬𝐬𝐞𝐫𝐞 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐨 𝐧𝐨𝐧 𝐚𝐯𝐞𝐫𝐞 𝐢 𝐩𝐞𝐫𝐦𝐞𝐬𝐬𝐢 𝐧𝐞𝐜𝐞𝐬𝐬𝐚𝐫𝐢.*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`,m)
}
}
}

handler.help=['linktoid <link>','idtolink <id>']
handler.tags=['tools']
handler.command=['idtolink','linktoid','id2link','link2id']
handler.owner=true

export default handler