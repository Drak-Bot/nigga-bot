import { axionSystem,axionFooter } from '../lib/axionsystem.js'

const telegramRegex=/(?:https?:\/\/)?(?:www\.)?(t\.me|telegram\.me)\/[^\s]*/i

function getMessageText(m){
  return m.text||
  m.message?.conversation||
  m.message?.extendedTextMessage?.text||
  m.message?.imageMessage?.caption||
  m.message?.videoMessage?.caption||
  m.message?.documentMessage?.caption||
  ''
}

export async function before(m,{isAdmin,isModerator,isBotAdmin,conn}){
  if(m.isBaileys||m.fromMe)return true
  if(!m.isGroup)return false

  const chat=global.db.data.chats[m.chat]
  if(!chat?.antiTelegram)return false
  if(isAdmin||isModerator)return false

  const text=getMessageText(m)
  if(!telegramRegex.test(text))return false

  global.db.data.users=global.db.data.users||{}
  global.db.data.users[m.sender]=global.db.data.users[m.sender]||{}
  global.db.data.users[m.sender].warnings=global.db.data.users[m.sender].warnings||{}
  
  let currentWarns=global.db.data.users[m.sender].warnings[m.chat]||0
  currentWarns+=1
  global.db.data.users[m.sender].warnings[m.chat]=currentWarns

  const warnLimit=3
  const mention=`@${global.cleanWarnNumber?global.cleanWarnNumber(m.sender):m.sender.split('@')[0]}`

  if(isBotAdmin){
    try{
      await conn.sendMessage(m.chat,{
        delete:{
          remoteJid:m.chat,
          fromMe:false,
          id:m.key.id,
          participant:m.key.participant||m.sender
        }
      })
    }catch{}
  }

  if(currentWarns<warnLimit){
    await axionSystem(conn,m.chat,{
      text:axionFooter(`*❌ 𝐋𝐢𝐧𝐤 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 𝐫𝐢𝐥𝐞𝐯𝐚𝐭𝐨*

${mention}

*⚠️ 𝐖𝐚𝐫𝐧:* ${currentWarns}/${warnLimit}

*‼️ 𝐀𝐥 𝐭𝐞𝐫𝐳𝐨 𝐰𝐚𝐫𝐧 𝐬𝐚𝐫𝐚𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨*`),
      thumb:'antitelegram',
      mentions:[m.sender],
      quoted:m
    })
    return true
  }

  global.db.data.users[m.sender].warnings[m.chat]=0

  if(isBotAdmin){
    try{
      await conn.groupParticipantsUpdate(m.chat,[m.sender],'remove')
    }catch{}
  }

  await axionSystem(conn,m.chat,{
    text:axionFooter(isBotAdmin?`*🚫 𝐋𝐢𝐦𝐢𝐭𝐞 𝐫𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨*

${mention}

*📊 𝐖𝐚𝐫𝐧:* 3/3

*🚫 𝐔𝐭𝐞𝐧𝐭𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨*`:`*⚠️ 𝐋𝐢𝐦𝐢𝐭𝐞 𝐫𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨*

${mention}

*📊 𝐖𝐚𝐫𝐧:* 3/3

*❌ 𝐍𝐨𝐧 𝐩𝐨𝐬𝐬𝐨 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐥’𝐮𝐭𝐞𝐧𝐭𝐞 𝐩𝐞𝐫𝐜𝐡𝐞́ 𝐧𝐨𝐧 𝐬𝐨𝐧𝐨 𝐚𝐝𝐦𝐢𝐧*`),
    thumb:'antitelegram',
    mentions:[m.sender],
    quoted:m
  })

  return true
}
