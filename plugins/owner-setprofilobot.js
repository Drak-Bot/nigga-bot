// setprofilobot by Bonzino

let handler = async (m,{conn,text,usedPrefix,command}) => {

if(!text){
return m.reply(
`*🤖 𝐂𝐀𝐌𝐁𝐈𝐀 𝐍𝐎𝐌𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏*

*📌 𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*
*${usedPrefix + command} 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
)
}

try{

await conn.updateProfileName(text)

return m.reply(
`*✅ 𝐍𝐎𝐌𝐄 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎*

*🤖 𝐍𝐮𝐨𝐯𝐨 𝐧𝐨𝐦𝐞:*
*${text}*

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`
)

}catch(e){

return m.reply(
`*❌ 𝐄𝐫𝐫𝐨𝐫𝐞*

\`\`\`
${e?.message||e}
\`\`\``
)

}
}

handler.help=['setprofilobot']
handler.tags=['owner']
handler.command=/^(setprofilobot)$/i
handler.owner=true

export default handler