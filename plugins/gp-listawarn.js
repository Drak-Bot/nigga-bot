let handler=async(m,{conn,command,usedPrefix})=>{
  const chatId=m.chat
  const cleanJid=jid=>String(jid||'').replace(/[^0-9]/g,'')

  const getWarnsData = (chatId, userId) => {
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[chatId] = global.db.data.chats[chatId] || {}
    global.db.data.chats[chatId].warns = global.db.data.chats[chatId].warns || {}
    global.db.data.chats[chatId].warns[userId] = global.db.data.chats[chatId].warns[userId] || { warn: 0, lastWarnReason: '' }
    return global.db.data.chats[chatId].warns[userId]
  }

  const box=(emoji,title,body)=>`*${emoji} ${title}*

${body}

> *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*`

  if(/resetallwarn|delallwarn|unwarnallgroup/i.test(command)){
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[chatId] = global.db.data.chats[chatId] || {}
    global.db.data.chats[chatId].warns = {}

    return conn.sendMessage(chatId,{
      text:box('🧹','𝐑𝐄𝐒𝐄𝐓 𝐖𝐀𝐑𝐍','*𝐓𝐮𝐭𝐭𝐢 i warn sono stati azzerati con successo per questo gruppo.*'),
      headerType:1
    },{quoted:m})
  }

  const target =
    m.mentionedJid?.[0] ||
    (
      m.quoted &&
      cleanJid(m.quoted.sender) !== cleanJid(conn.user.jid)
        ? m.quoted.sender
        : null
    )

  const warnListButtons=()=>[
    {buttonId:`${usedPrefix}resetallwarn`,buttonText:{displayText:'🧹 Azzera tutti i warn'},type:1},
    {buttonId:`${usedPrefix}listawarn`,buttonText:{displayText:'🔄 Aggiorna lista'},type:1}
  ]

  const metadata=await conn.groupMetadata(chatId)
  const participants=metadata.participants||[]

  if (target) {
    const data = getWarnsData(chatId, target)
    const warn = Number(data.warn || 0)

    return conn.sendMessage(chatId,{
      text: box(
        '⚠️',
        '𝐖𝐀𝐑𝐍 𝐔𝐓𝐄𝐍𝐓𝐄',
`*👤 𝐔𝐭𝐞𝐧𝐭𝐞:* @${cleanJid(target)}

*⚠️ 𝐖𝐚𝐫𝐧:* *${warn}/𝟑*

*❓ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐦𝐨𝐭𝐢𝐯𝐨:* ${data.lastWarnReason || 'Nessuno'}`
      ),
      mentions:[target],
      buttons:[
        {
          buttonId:`${usedPrefix}unwarn ${cleanJid(target)}`,
          buttonText:{displayText:'➖ Unwarn'},
          type:1
        },
        {
          buttonId:`${usedPrefix}unwarnall ${cleanJid(target)}`,
          buttonText:{displayText:'🧹 Unwarn All'},
          type:1
        },
        {
          buttonId:`${usedPrefix}listawarn`,
          buttonText:{displayText:'📋 Lista Warn'},
          type:1
        },
        {
          buttonId:`${usedPrefix}resetallwarn`,
          buttonText:{displayText:'🧹 Reset Gruppo'},
          type:1
        }
      ],
      headerType:1
    },{quoted:m})
  }

  const warnedUsers=participants.map(p=>{
    const jid=p.jid||p.id||p.lid
    const data = getWarnsData(chatId, jid)

    return{
      jid,
      warn:Number(data.warn||0),
      reason:data.lastWarnReason||''
    }
  }).filter(u=>u.warn>0).sort((a,b)=>b.warn-a.warn)

  if(!warnedUsers.length){
    return conn.sendMessage(chatId,{
      text:box('✅','𝐋𝐈𝐒𝐓𝐀 𝐖𝐀𝐑𝐍','*𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐰𝐚𝐫𝐧𝐚𝐭𝐨 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.*'),
      buttons:warnListButtons(),
      headerType:1
    },{quoted:m})
  }

  const mentions=warnedUsers.map(u=>u.jid)

  const list=warnedUsers.map((u,i)=>{
    const tag='@'+cleanJid(u.jid)
    const reason=u.reason?`\n*❓ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐦𝐨𝐭𝐢𝐯𝐨:* *${u.reason}*`:''
    return `*${i+1}. 👤 𝐔𝐭𝐞𝐧𝐭𝐞:* ${tag}
*⚠️ 𝐖𝐚𝐫𝐧:* *${u.warn}/𝟑*${reason}`
  }).join('\n\n')

  return conn.sendMessage(chatId,{
    text:box('⚠️','𝐋𝐈𝐒𝐓𝐀 𝐖𝐀𝐑𝐍',list),
    mentions,
    buttons:warnListButtons(),
    headerType:1
  },{quoted:m})
}

handler.command=/^(listwarn|warnlist|listawarn|resetallwarn|delallwarn|unwarnallgroup)$/i
handler.group=true
handler.admin=true

export default handler
