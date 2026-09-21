//by bonzino

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  createCurrentTrackCard,
  createHistoryCard,
  createLikesCard
} from '../lib/cards/lastfm-card.js'

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const USERS_FILE=path.join(__dirname,'..','lastfm_users.json')
const LIKES_FILE=path.join(__dirname,'..','song_likes.json')

if(!fs.existsSync(USERS_FILE))fs.writeFileSync(USERS_FILE,'{}')
if(!fs.existsSync(LIKES_FILE))fs.writeFileSync(LIKES_FILE,'{}')

const cache=new Map()
const CACHE_DURATION=300000
const RECENT_TRACK_CACHE_DURATION=30000
const LASTFM_API_KEY='36f859a1fc4121e7f0e931806507d5f9'
const FOOTER='\n\n> *𝑵𝑰𝑮𝑮𝑨 𝑩𝑶𝑻*'

const clean=text=>String(text||'').replace(/\s+/g,' ').trim()

const loadUsers=()=>{
  try{
    return JSON.parse(fs.readFileSync(USERS_FILE,'utf8'))
  }catch{
    return {}
  }
}

const loadLikes=()=>{
  try{
    return JSON.parse(fs.readFileSync(LIKES_FILE,'utf8'))
  }catch{
    return {}
  }
}

const saveUsers=data=>{
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(data,null,2)
  )
}

const saveLikes=data=>{
  fs.writeFileSync(
    LIKES_FILE,
    JSON.stringify(data,null,2)
  )
}

function getLastfmUsername(userId){
  return loadUsers()[userId]||null
}

function setLastfmUsername(userId,username){
  const users=loadUsers()
  users[userId]=username
  saveUsers(users)
}

function getUsernameFromId(userId){
  return loadUsers()[userId]||null
}

function getIdFromUsername(username){
  const users=loadUsers()

  return Object.keys(users).find(id=>
    users[id]?.toLowerCase()===username.toLowerCase()
  )||null
}

function generateSongId(username,artist,track){
  return `${username}_${artist}_${track}`
    .replace(/[^\w\s]/gi,'')
    .replace(/\s+/g,'_')
    .toLowerCase()
}

function getSongLikes(songId){
  const likes=loadLikes()
  return likes[songId]?.likes||0
}

function addSongLike(songId,userId){
  const likes=loadLikes()

  likes[songId]||={
    likes:0,
    likedBy:[]
  }

  likes[songId].likedBy||=[]

  if(likes[songId].likedBy.includes(userId)){
    return {
      success:false,
      total:likes[songId].likes||0
    }
  }

  likes[songId].likes++
  likes[songId].likedBy.push(userId)

  saveLikes(likes)

  return {
    success:true,
    total:likes[songId].likes
  }
}

function getUserLikesReceived(userId){
  const username=getLastfmUsername(userId)

  if(!username)return 0

  const prefix=`${username}_`.toLowerCase()
  const likes=loadLikes()

  return Object.entries(likes).reduce(
    (total,[songId,data])=>
      songId.toLowerCase().startsWith(prefix)
        ?total+(data.likes||0)
        :total,
    0
  )
}

function invalidateRecentCache(username){
  const encoded=encodeURIComponent(username)

  for(const key of cache.keys()){
    if(
      key.includes('user.getrecenttracks')&&
      key.includes(`user=${encoded}`)
    ){
      cache.delete(key)
    }
  }
}

async function fetchWithCache(
  url,
  duration=CACHE_DURATION
){
  const now=Date.now()
  const cached=cache.get(url)

  if(
    cached&&
    now-cached.timestamp<duration
  ){
    return cached.data
  }

  const controller=new AbortController()
  const timer=setTimeout(
    ()=>controller.abort(),
    10000
  )

  try{
    const res=await fetch(url,{
      signal:controller.signal
    })

    if(!res.ok){
      throw new Error(`HTTP ${res.status}`)
    }

    const data=await res.json()

    cache.set(url,{
      data,
      timestamp:now
    })

    return data
  }catch(e){
    console.error(
      '[LASTFM FETCH ERROR]',
      e?.message||e
    )

    return null
  }finally{
    clearTimeout(timer)
  }
}

async function getUserInfo(username){
  const data=await fetchWithCache(
    `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(username)}&api_key=${LASTFM_API_KEY}&format=json`
  )

  return data?.user||null
}

async function getTrackInfo(
  username,
  artist,
  track
){
  const data=await fetchWithCache(
    `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${encodeURIComponent(username)}&format=json`
  )

  return data?.track||null
}

async function getRecentTrack(username){
  const data=await fetchWithCache(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${LASTFM_API_KEY}&format=json&limit=1`,
    RECENT_TRACK_CACHE_DURATION
  )

  return data?.recenttracks?.track?.[0]||null
}

async function getRecentTracks(
  username,
  limit=10
){
  const data=await fetchWithCache(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`,
    RECENT_TRACK_CACHE_DURATION
  )

  return data?.recenttracks?.track||[]
}

function cleanTrackTitle(title){
  return clean(title)
    .replace(
      /\s*[-–—]\s*(remaster(ed)?|live|radio edit|edit|version).*$/i,
      ''
    )
    .replace(
      /\s*(remaster(ed)?|live|radio edit|edit|version).*?\s*$/i,
      ''
    )
    .trim()
}

function cleanLyrics(lyrics){
  return String(lyrics||'')
    .replace(/\r/g,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim()
}

async function getLyrics(
  artist,
  title
){
  const controller=new AbortController()

  const timer=setTimeout(
    ()=>controller.abort(),
    10000
  )

  try{
    const query=new URLSearchParams({
      track_name:cleanTrackTitle(title),
      artist_name:clean(artist)
    })

    const res=await fetch(
      `https://lrclib.net/api/search?${query}`,
      {
        signal:controller.signal,
        headers:{
          'User-Agent':'NIGGABot/1.0'
        }
      }
    )

    if(!res.ok)return null

    const results=await res.json()

    if(
      !Array.isArray(results)||
      !results.length
    ){
      return null
    }

    const artistLower=
      clean(artist).toLowerCase()

    const titleLower=
      cleanTrackTitle(title).toLowerCase()

    const exact=results.find(x=>
      clean(x?.trackName).toLowerCase()===
        titleLower&&
      clean(x?.artistName).toLowerCase()===
        artistLower
    )

    const result=
      exact||
      results.find(x=>x?.plainLyrics)||
      results[0]

    return cleanLyrics(
      result?.plainLyrics
    )||null
  }catch(e){
    console.error(
      '[LYRICS ERROR]',
      e?.message||e
    )

    return null
  }finally{
    clearTimeout(timer)
  }
}

async function sendLyrics(
  conn,
  m,
  artist,
  title
){
  const lyrics=await getLyrics(
    artist,
    title
  )

  if(!lyrics){
    return conn.sendMessage(
      m.chat,
      {
        text:
`❌ *𝐓𝐞𝐬𝐭𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.*

🎵 *𝐁𝐫𝐚𝐧𝐨:* *${title}*
🎤 *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* *${artist}*${FOOTER}`
      },
      {quoted:m}
    )
  }

  const header=
`🎤 *𝐋𝐘𝐑𝐈𝐂𝐒*

🎵 *𝐁𝐫𝐚𝐧𝐨:* *${title}*
🎙️ *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* *${artist}*

`

  const max=3800

  if(
    (header+lyrics+FOOTER).length<=max
  ){
    return conn.sendMessage(
      m.chat,
      {
        text:
`${header}${lyrics}${FOOTER}`
      },
      {quoted:m}
    )
  }

  const parts=[]
  let remaining=lyrics

  while(remaining.length){
    let cut=Math.min(
      remaining.length,
      3000
    )

    if(cut<remaining.length){
      const newline=
        remaining.lastIndexOf('\n',cut)

      if(newline>1500){
        cut=newline
      }
    }

    parts.push(
      remaining
        .slice(0,cut)
        .trim()
    )

    remaining=
      remaining
        .slice(cut)
        .trim()
  }

  for(
    let i=0;
    i<parts.length;
    i++
  ){
    const text=i===0
      ?
`${header}${parts[i]}

*𝐏𝐚𝐫𝐭𝐞 ${i+1}/${parts.length}*${FOOTER}`
      :
`🎤 *𝐋𝐘𝐑𝐈𝐂𝐒 — 𝐏𝐚𝐫𝐭𝐞 ${i+1}/${parts.length}*

${parts[i]}${FOOTER}`

    await conn.sendMessage(
      m.chat,
      {text},
      {
        quoted:
          i===0
            ?m
            :undefined
      }
    )
  }
}

async function sendCurrentCard(
  conn,
  m,
  user,
  track,
  info,
  userInfo,
  likesReceived,
  songLikes,
  usedPrefix
){
  const title=clean(
    track?.name||
    'Brano sconosciuto'
  )

  const artist=clean(
    track?.artist?.['#text']||
    'Artista sconosciuto'
  )

  const lyricsData=
    Buffer
      .from(
        JSON.stringify({
          artist,
          title
        })
      )
      .toString('base64url')

  const spotifyUrl=
    `https://open.spotify.com/search/${encodeURIComponent(
      `${artist} ${title}`
    )}`

  const buttons=[
    [
      '🔥 Like',
      `${usedPrefix}like ${user}`
    ],
    [
      '🎧 Scarica MP3',
      `${usedPrefix}playaud ${artist} ${title}`
    ],
    [
      '🎤 Lyrics',
      `${usedPrefix}lyricsid ${lyricsData}`
    ]
  ]

  const urls=[
    [
      '🟢 Spotify',
      spotifyUrl
    ]
  ]

  try{
    const card=
      await createCurrentTrackCard({
        username:user,
        track,
        info,
        userInfo,
        likesReceived,
        songLikes
      })

    return conn.sendButton(
      m.chat,
      '‎',
      '',
      card,
      buttons,
      null,
      urls,
      null,
      m
    )
  }catch(e){
    console.error(
      '[CUR CARD ERROR]',
      e
    )

    const text=
`🎧 *${
  track?.['@attr']?.nowplaying==='true'
    ?'𝐈𝐧 𝐫𝐢𝐩𝐫𝐨𝐝𝐮𝐳𝐢𝐨𝐧𝐞'
    :'𝐔𝐥𝐭𝐢𝐦𝐨 𝐛𝐫𝐚𝐧𝐨'
} 𝐝𝐢 ${user}*

🎵 *𝐁𝐫𝐚𝐧𝐨:* *${title}*
🎤 *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* *${artist}*

▶️ *𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢:* *${info?.userplaycount||0}*
🌍 *𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢:* *${info?.playcount||0}*
👥 *𝐋𝐢𝐬𝐭𝐞𝐧𝐞𝐫𝐬:* *${info?.listeners||0}*
📊 *𝐒𝐜𝐫𝐨𝐛𝐛𝐥𝐞 𝐭𝐨𝐭𝐚𝐥𝐢:* *${userInfo?.playcount||0}*
🔥 *𝐋𝐢𝐤𝐞 𝐛𝐫𝐚𝐧𝐨:* *${songLikes}*
❤️ *𝐋𝐢𝐤𝐞 𝐫𝐢𝐜𝐞𝐯𝐮𝐭𝐢:* *${likesReceived}*${FOOTER}`

    return conn.sendButton(
      m.chat,
      text,
      '',
      null,
      buttons,
      null,
      urls,
      null,
      m
    )
  }
}

async function sendHistoryCard(
  conn,
  m,
  user,
  tracks,
  userInfo,
  usedPrefix
){
  const buttons=[
    {
      buttonId:`${usedPrefix}cur`,
      buttonText:{
        displayText:'🎧 Corrente'
      },
      type:1
    }
  ]

  try{
    const card=
      await createHistoryCard({
        username:user,
        tracks,
        userInfo
      })

    return conn.sendMessage(
      m.chat,
      {
        image:card,
        caption:'‎',
        buttons,
        headerType:4
      },
      {quoted:m}
    )
  }catch(e){
    console.error(
      '[HISTORY CARD ERROR]',
      e
    )

    return conn.sendMessage(
      m.chat,
      {
        text:
`❌ *𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥𝐥𝐚 𝐜𝐫𝐞𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥𝐥𝐚 𝐜𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚.*${FOOTER}`
      },
      {quoted:m}
    )
  }
}

async function sendLikesCard(
  conn,
  m,
  user,
  userInfo,
  likesReceived,
  currentTrack,
  info,
  usedPrefix
){
  const buttons=[
    {
      buttonId:`${usedPrefix}cur`,
      buttonText:{
        displayText:'🎧 Corrente'
      },
      type:1
    },
    {
      buttonId:`${usedPrefix}cronologia`,
      buttonText:{
        displayText:'📜 Cronologia'
      },
      type:1
    }
  ]

  try{
    const card=
      await createLikesCard({
        username:user,
        userInfo,
        likesReceived,
        currentTrack,
        info
      })

    return conn.sendMessage(
      m.chat,
      {
        image:card,
        caption:'‎',
        buttons,
        headerType:4
      },
      {quoted:m}
    )
  }catch(e){
    console.error(
      '[MYLIKES CARD ERROR]',
      e
    )

    return conn.sendMessage(
      m.chat,
      {
        text:
`❌ *𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥𝐥𝐚 𝐜𝐫𝐞𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐢 𝐥𝐢𝐤𝐞.*${FOOTER}`
      },
      {quoted:m}
    )
  }
}

const handler=async(
  m,
  {
    conn,
    usedPrefix,
    text,
    command
  }
)=>{
  command=command.toLowerCase()

  if(command==='lyricsid'){
    try{
      const data=
        JSON.parse(
          Buffer
            .from(
              clean(text),
              'base64url'
            )
            .toString()
        )

      if(
        !data?.artist||
        !data?.title
      ){
        throw new Error()
      }

      return sendLyrics(
        conn,
        m,
        data.artist,
        data.title
      )
    }catch{
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐃𝐚𝐭𝐢 𝐝𝐞𝐥 𝐛𝐫𝐚𝐧𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐢.*${FOOTER}`
        },
        {quoted:m}
      )
    }
  }

  if(
    command==='lyrics'||
    command==='testo'
  ){
    let artist
    let title

    if(text.includes(' - ')){
      ;[artist,title]=
        text
          .split(' - ',2)
          .map(clean)
    }else{
      const user=
        getLastfmUsername(m.sender)

      if(
        !clean(text)&&
        user
      ){
        const track=
          await getRecentTrack(user)

        if(track){
          artist=
            clean(
              track.artist?.['#text']
            )

          title=
            clean(track.name)
        }
      }
    }

    if(!artist||!title){
      return conn.sendMessage(
        m.chat,
        {
          text:
`🎤 *𝐔𝐬𝐚:* \`${usedPrefix}lyrics Artista - Titolo\`

*𝐎𝐩𝐩𝐮𝐫𝐞 𝐮𝐬𝐚 ${usedPrefix}lyrics 𝐬𝐞𝐧𝐳𝐚 𝐚𝐫𝐠𝐨𝐦𝐞𝐧𝐭𝐢 𝐩𝐞𝐫 𝐢𝐥 𝐭𝐮𝐨 𝐛𝐫𝐚𝐧𝐨 𝐜𝐨𝐫𝐫𝐞𝐧𝐭𝐞.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    return sendLyrics(
      conn,
      m,
      artist,
      title
    )
  }

  if(command==='setuser'){
    const username=clean(text)

    if(!username){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐔𝐬𝐚:* \`${usedPrefix}setuser username\`${FOOTER}`
        },
        {quoted:m}
      )
    }

    const userInfo=
      await getUserInfo(username)

    if(!userInfo?.name){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 𝐋𝐚𝐬𝐭.𝐟𝐦 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    setLastfmUsername(
      m.sender,
      username
    )

    return conn.sendMessage(
      m.chat,
      {
        text:
`✅ *𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 ${username} 𝐬𝐚𝐥𝐯𝐚𝐭𝐨!*${FOOTER}`
      },
      {quoted:m}
    )
  }

  if(command==='like'){
    const target=
      m.mentionedJid?.[0]||
      clean(text)

    if(!target){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐔𝐬𝐚 ${usedPrefix}like @utente 𝐨𝐩𝐩𝐮𝐫𝐞 ${usedPrefix}like username.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    let targetUsername
    let targetUserId

    if(target.includes('@')){
      targetUserId=target
      targetUsername=
        getUsernameFromId(target)

      if(!targetUsername){
        return conn.sendMessage(
          m.chat,
          {
            text:
`❌ *𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐜𝐨𝐥𝐥𝐞𝐠𝐚𝐭𝐨 𝐋𝐚𝐬𝐭.𝐟𝐦 𝐜𝐨𝐧 ${usedPrefix}setuser.*${FOOTER}`
          },
          {quoted:m}
        )
      }
    }else{
      targetUsername=target

      targetUserId=
        getIdFromUsername(
          targetUsername
        )

      if(!targetUserId){
        return conn.sendMessage(
          m.chat,
          {
            text:
`❌ *𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐜𝐨𝐧 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 ${targetUsername}.*${FOOTER}`
          },
          {quoted:m}
        )
      }
    }

    invalidateRecentCache(
      targetUsername
    )

    const track=
      await getRecentTrack(
        targetUsername
      )

    if(!track){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    const artist=
      track.artist?.['#text']||
      'unknown'

    const title=
      track.name||
      'unknown'

    const result=
      addSongLike(
        generateSongId(
          targetUsername,
          artist,
          title
        ),
        m.sender
      )

    if(!result.success){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐦𝐞𝐬𝐬𝐨 𝐥𝐢𝐤𝐞 𝐚 ${title}!*${FOOTER}`
        },
        {quoted:m}
      )
    }

    return conn.sendMessage(
      m.chat,
      {
        text:
`🔥 *𝐇𝐚𝐢 𝐦𝐞𝐬𝐬𝐨 𝐥𝐢𝐤𝐞 𝐚 ${title} 𝐝𝐢 ${targetUsername}!*

❤️ *𝐋𝐢𝐤𝐞 𝐭𝐨𝐭𝐚𝐥𝐢 𝐬𝐮𝐥 𝐛𝐫𝐚𝐧𝐨:* *${result.total}*${FOOTER}`
      },
      {quoted:m}
    )
  }

  if(command==='mylikes'){
    const user=
      getLastfmUsername(m.sender)

    if(!user){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐜𝐨𝐧 ${usedPrefix}setuser username.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    const likesReceived=
      getUserLikesReceived(
        m.sender
      )

    const [
      userInfo,
      currentTrack
    ]=await Promise.all([
      getUserInfo(user),
      getRecentTrack(user)
    ])

    const info=currentTrack
      ?await getTrackInfo(
        user,
        currentTrack.artist?.['#text']||'',
        currentTrack.name||''
      )
      :null

    return sendLikesCard(
      conn,
      m,
      user,
      userInfo,
      likesReceived,
      currentTrack,
      info,
      usedPrefix
    )
  }

  const user=
    getLastfmUsername(m.sender)

  if(!user){
    return conn.sendMessage(
      m.chat,
      {
        text:
`❌ *𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐜𝐨𝐧 ${usedPrefix}setuser username.*${FOOTER}`
      },
      {quoted:m}
    )
  }

  if(command==='cur'){
    invalidateRecentCache(user)

    const track=
      await getRecentTrack(user)

    if(!track){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    const artist=
      track.artist?.['#text']||
      'Artista sconosciuto'

    const title=
      track.name||
      'Brano sconosciuto'

    const [
      info,
      userInfo
    ]=await Promise.all([
      getTrackInfo(
        user,
        artist,
        title
      ),
      getUserInfo(user)
    ])

    return sendCurrentCard(
      conn,
      m,
      user,
      track,
      info,
      userInfo,
      getUserLikesReceived(
        m.sender
      ),
      getSongLikes(
        generateSongId(
          user,
          artist,
          title
        )
      ),
      usedPrefix
    )
  }

  if(command==='cronologia'){
    invalidateRecentCache(user)

    const [
      tracks,
      userInfo
    ]=await Promise.all([
      getRecentTracks(user,10),
      getUserInfo(user)
    ])

    if(!tracks.length){
      return conn.sendMessage(
        m.chat,
        {
          text:
`❌ *𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.*${FOOTER}`
        },
        {quoted:m}
      )
    }

    return sendHistoryCard(
      conn,
      m,
      user,
      tracks,
      userInfo,
      usedPrefix
    )
  }

  if(command==='refresh'){
    invalidateRecentCache(user)

    return conn.sendMessage(
      m.chat,
      {
        text:
`🔄 *𝐂𝐚𝐜𝐡𝐞 𝐝𝐢 ${user} 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐚!*${FOOTER}`
      },
      {quoted:m}
    )
  }
}

handler.command=[
  'setuser',
  'cur',
  'like',
  'cronologia',
  'mylikes',
  'refresh',
  'lyrics',
  'testo',
  'lyricsid'
]

handler.group=true
handler.tags=['lastfm']

export default handler