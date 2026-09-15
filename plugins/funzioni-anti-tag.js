import { axionSystem,axionFooter } from '../lib/axionsystem.js'

let handler=m=>m

handler.before=async function(m,{conn,isAdmin,isModerator,isBotAdmin,isOwner,isROwner}){
  if(!m.isGroup)return false
  if(m.fromMe||m.isBaileys)return true

  const chat=global.db.data.chats[m.chat]||{}
  if(!chat.antiTag)return true

  const botNumber=conn.decodeJid(conn.user?.jid||conn.user?.id||'')
  const userJid=conn.decodeJid(m.sender)

  if(userJid===botNumber)return false
  if(!m.mentionedJid||m.mentionedJid.length===0)return false
  if(isOwner||isROwner||isAdmin||isModerator)return true
  if(m.mentionedJid.length<=40)return false

  global.db.data.users=global.db.data.users||{}
  global.db.data.users[userJid]=global.db.data.users[userJid]||{}
  global.db.data.users[userJid].warnings=global.db.data.users[userJid].warnings||{}
  
  let currentWarns=global.db.data.users[userJid].warnings[m.chat]||0
  currentWarns+=1
  global.db.data.users[userJid].warnings[m.chat]=currentWarns

  const warnLimit=3
  const remaining=warnLimit-currentWarns
  const senderTag=global.cleanWarnNumber?global.cleanWarnNumber(userJid):userJid.split('@')[0]

  try{
    if(isBotAdmin){
      await conn.sendMessage(m.chat,{
        delete:{
          remoteJid:m.chat,
          fromMe:false,
          id:m.key.id,
          participant:m.key.participant||m.sender
        }
      })
    }
  }catch(e){
    console.error('Errore nella cancellazione del messaggio:',e)
  }

  if(currentWarns<warnLimit){
    await axionSystem(conn,m.chat,{
      text:axionFooter(`*@${senderTag}*

*⚠️ 𝐓𝐫𝐨𝐩𝐩𝐢 𝐭𝐚𝐠 𝐧𝐞𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨*

*📌 𝐀𝐯𝐯𝐢𝐬𝐨:* *${currentWarns}/${warnLimit}*
*⏳ 𝐑𝐢𝐦𝐚𝐧𝐞𝐧𝐭𝐢:* *${remaining}*

*🚫 𝐀𝐥𝐥𝐚 𝐩𝐫𝐨𝐬𝐬𝐢𝐦𝐚 𝐯𝐢𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞 𝐬𝐚𝐫𝐚𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐨*`),
      thumb:'antitag',
      mentions:[userJid],
      quoted:m
    })
    return true
  }

  global.db.data.users[userJid].warnings[m.chat]=0

  if(!isBotAdmin){
    await axionSystem(conn,m.chat,{
      text:axionFooter(`*@${senderTag}*

*⚠️ 𝐇𝐚 𝐫𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨 𝟑/𝟑 𝐚𝐯𝐯𝐢𝐬𝐢*

*❌ 𝐍𝐨𝐧 𝐩𝐨𝐬𝐬𝐨 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐥𝐨: 𝐢𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 è 𝐚𝐝𝐦𝐢𝐧*`),
      thumb:'antitag',
      mentions:[userJid],
      quoted:m
    })
    return true
  }

  try{
    await conn.groupParticipantsUpdate(m.chat,[userJid],'remove')
    await axionSystem(conn,m.chat,{
      text:axionFooter(`*@${senderTag}*

*🚫 𝐑𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨*

*❓️ 𝐌𝐨𝐭𝐢𝐯𝐨:* *𝐓𝐚𝐠 𝐞𝐜𝐜𝐞𝐬𝐬𝐢𝐯𝐢*`),
      thumb:'antitag',
      mentions:[userJid],
      quoted:m
    })
  }catch{
    await axionSystem(conn,m.chat,{
      text:axionFooter(`*@${senderTag}*

*⚠️ 𝐃𝐨𝐯𝐫𝐞𝐛𝐛𝐞 𝐞𝐬𝐬𝐞𝐫𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨, 𝐦𝐚 𝐢𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 è 𝐫𝐢𝐮𝐬𝐜𝐢𝐭𝐨 𝐚 𝐟𝐚𝐫𝐥𝐨*`),
      thumb:'antitag',
      mentions:[userJid],
      quoted:m
    })
  }

  return true
}

export default handler
