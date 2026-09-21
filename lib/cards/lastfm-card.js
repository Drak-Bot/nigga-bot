//grafica di lastf by bonzino

import fetch from 'node-fetch'
import { createCanvas, loadImage } from 'canvas'

const fmt=n=>new Intl.NumberFormat('it-IT').format(Number(n)||0)
const clean=t=>String(t||'').replace(/\s+/g,' ').trim()

const PALETTE=[
{name:'Emerald',bg1:'#102B21',bg2:'#061A13',bg3:'#020E0A',glow:'48,220,142',accent:'#28D58A',secondary:'#73F0B4',soft:'rgba(40,213,138,.16)',border:'rgba(40,213,138,.62)',panel:'rgba(12,48,35,.76)',status:'rgba(21,91,62,.92)',muted:'#91B9A7',avatar:'#123C2C'},
{name:'Gold',bg1:'#34240B',bg2:'#1A1104',bg3:'#0E0801',glow:'245,180,61',accent:'#F1B83D',secondary:'#FFD978',soft:'rgba(241,184,61,.16)',border:'rgba(241,184,61,.62)',panel:'rgba(62,42,11,.76)',status:'rgba(100,65,13,.92)',muted:'#C2AD7A',avatar:'#47310E'},
{name:'Purple',bg1:'#281742',bg2:'#130A25',bg3:'#090411',glow:'166,107,255',accent:'#A66BFF',secondary:'#D1A8FF',soft:'rgba(166,107,255,.16)',border:'rgba(166,107,255,.62)',panel:'rgba(49,27,78,.76)',status:'rgba(78,42,120,.92)',muted:'#B2A0C9',avatar:'#362050'},
{name:'Crimson',bg1:'#351217',bg2:'#1A080B',bg3:'#0E0305',glow:'241,73,88',accent:'#F0525D',secondary:'#FF9198',soft:'rgba(240,82,93,.16)',border:'rgba(240,82,93,.62)',panel:'rgba(68,20,27,.76)',status:'rgba(106,27,38,.92)',muted:'#C09A9E',avatar:'#46151D'},
{name:'Cyan',bg1:'#0D3037',bg2:'#061B20',bg3:'#020E11',glow:'39,199,216',accent:'#27C7D8',secondary:'#79E6F0',soft:'rgba(39,199,216,.16)',border:'rgba(39,199,216,.62)',panel:'rgba(12,53,60,.76)',status:'rgba(18,81,90,.92)',muted:'#91B5BA',avatar:'#103B42'},
{name:'Rose',bg1:'#351325',bg2:'#1C0913',bg3:'#0E0309',glow:'237,100,155',accent:'#ED649B',secondary:'#FFA3C5',soft:'rgba(237,100,155,.16)',border:'rgba(237,100,155,.62)',panel:'rgba(68,22,44,.76)',status:'rgba(105,31,65,.92)',muted:'#C3A0AE',avatar:'#48182F'},
{name:'Orange',bg1:'#38200D',bg2:'#1D0E04',bg3:'#0F0702',glow:'246,133,45',accent:'#F5822D',secondary:'#FFB36E',soft:'rgba(245,130,45,.16)',border:'rgba(245,130,45,.62)',panel:'rgba(71,34,10,.76)',status:'rgba(109,51,12,.92)',muted:'#C3A083',avatar:'#4C250B'}
]

const randomPalette=()=>PALETTE[Math.floor(Math.random()*PALETTE.length)]

async function fetchBuffer(url){
if(!url)return null
const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),5000)
try{
const r=await fetch(url,{signal:ctl.signal})
return r.ok?Buffer.from(await r.arrayBuffer()):null
}catch{return null}
finally{clearTimeout(timer)}
}

async function loadImageOrNull(url){
const b=await fetchBuffer(url)
if(!b)return null
try{return await loadImage(b)}catch{return null}
}

function rr(c,x,y,w,h,r){
r=Math.min(r,w/2,h/2)
c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()
}
function fillRR(c,x,y,w,h,r,color){rr(c,x,y,w,h,r);c.fillStyle=color;c.fill()}
function strokeRR(c,x,y,w,h,r,color,width=1){rr(c,x,y,w,h,r);c.strokeStyle=color;c.lineWidth=width;c.stroke()}

function ellipsis(c,text,max){
let v=clean(text)
if(c.measureText(v).width<=max)return v
while(v.length&&c.measureText(v+'…').width>max)v=v.slice(0,-1)
return v+'…'
}

function fitText(c,text,max,size,weight='bold'){
while(size>18){
c.font=`${weight} ${size}px Sans`
if(c.measureText(text).width<=max)return size
size-=2
}
return size
}

function section(c,text,x,y,color){c.font='bold 24px Sans';c.fillStyle=color;c.fillText(text,x,y)}

function row(c,label,value,x,y,labelW=210,max=400,muted='#97a2b8'){
c.font='bold 24px Sans';c.fillStyle=muted;c.fillText(label,x,y)
c.font='bold 25px Sans';c.fillStyle='#fff';c.fillText(ellipsis(c,String(value),max),x+labelW,y)
}

function divider(c,x1,y,x2,color='rgba(255,255,255,.08)'){
c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.moveTo(x1,y);c.lineTo(x2,y);c.stroke()
}

function getTrackImage(t){
return t?.image?.find(x=>x.size==='extralarge')?.['#text']||
t?.image?.find(x=>x.size==='large')?.['#text']||
t?.image?.find(x=>x.size==='medium')?.['#text']||null
}

function getUserImage(u){
const i=Array.isArray(u?.image)?u.image:[]
return i.find(x=>x.size==='extralarge')?.['#text']||
i.find(x=>x.size==='large')?.['#text']||
i.find(x=>x.size==='medium')?.['#text']||
i.find(x=>x.size==='small')?.['#text']||null
}

function getDuration(info){
const ms=Number(info?.duration||0)
if(!ms)return'N/D'
const s=Math.floor(ms/1000)
return`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

function trackTime(t){
const uts=Number(t?.date?.uts||0)
return uts?new Date(uts*1000).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}):'Adesso'
}

function background(c,W,H,a,b,d,glow){
const g=c.createLinearGradient(0,0,W,H)
g.addColorStop(0,a);g.addColorStop(.52,b);g.addColorStop(1,d)
c.fillStyle=g;c.fillRect(0,0,W,H)
const l=c.createRadialGradient(220,220,20,220,220,650)
l.addColorStop(0,glow);l.addColorStop(1,'rgba(0,0,0,0)')
c.fillStyle=l;c.fillRect(0,0,W,H)
}

function liveLight(c,x,y){
const g=c.createRadialGradient(x,y,1,x,y,34)
g.addColorStop(0,'rgba(125,255,155,.95)')
g.addColorStop(.22,'rgba(70,255,115,.65)')
g.addColorStop(.55,'rgba(45,255,95,.22)')
g.addColorStop(1,'rgba(45,255,95,0)')
c.fillStyle=g;c.beginPath();c.arc(x,y,34,0,Math.PI*2);c.fill()
c.beginPath();c.arc(x,y,10,0,Math.PI*2);c.fillStyle='#48ff78';c.shadowColor='#48ff78';c.shadowBlur=16;c.fill();c.shadowBlur=0
}

function userIcon(c,x,y,color){
c.save();c.fillStyle=color
c.beginPath();c.arc(x,y-7,7,0,Math.PI*2);c.fill()
c.beginPath();c.arc(x,y+10,13,Math.PI,0);c.lineTo(x+13,y+16);c.lineTo(x-13,y+16);c.closePath();c.fill()
c.restore()
}

export async function createCurrentTrackCard({username,track,info,userInfo,likesReceived,songLikes}){
const p=randomPalette(),W=1280,H=820,cv=createCanvas(W,H),c=cv.getContext('2d')
const cover=await loadImageOrNull(getTrackImage(track)),avatar=await loadImageOrNull(getUserImage(userInfo))
const title=clean(track?.name||'Brano sconosciuto')
const artist=clean(track?.artist?.['#text']||'Artista sconosciuto')
const album=clean(track?.album?.['#text']||info?.album?.title||'Album sconosciuto')
const now=track?.['@attr']?.nowplaying==='true'

background(c,W,H,p.bg1,p.bg2,p.bg3,`rgba(${p.glow},.24)`)
fillRR(c,30,30,W-60,H-60,32,'rgba(4,10,18,.68)')
strokeRR(c,30,30,W-60,H-60,32,p.border,2)

const coverX=65,coverY=95,coverSize=390
fillRR(c,coverX,coverY,coverSize,coverSize,28,p.avatar)

if(cover){
c.save();rr(c,coverX,coverY,coverSize,coverSize,28);c.clip();c.drawImage(cover,coverX,coverY,coverSize,coverSize);c.restore()
}else{
c.font='bold 42px Sans';c.fillStyle='#fff';c.textAlign='center';c.fillText('NO COVER',coverX+coverSize/2,coverY+coverSize/2);c.textAlign='left'
}

fillRR(c,65,515,390,76,20,p.status)
if(now)liveLight(c,118,553)
c.font='bold 28px Sans';c.fillStyle='#fff';c.textAlign='center';c.fillText(now?'NOW PLAYING':'ULTIMO BRANO',278,561);c.textAlign='left'

const infoX=510,infoW=690
c.font='bold 18px Sans';c.fillStyle=p.accent;c.fillText('LAST.FM',infoX,105)

const titleSize=fitText(c,title,infoW,48)
c.font=`bold ${titleSize}px Sans`;c.fillStyle='#fff';c.fillText(ellipsis(c,title,infoW),infoX,165)

c.font='bold 32px Sans';c.fillStyle=p.accent;c.fillText(ellipsis(c,artist,infoW),infoX,215)
c.font='23px Sans';c.fillStyle=p.muted;c.fillText(ellipsis(c,album,infoW),infoX,258)

fillRR(c,510,345,340,215,24,p.panel);strokeRR(c,510,345,340,215,24,p.soft)
fillRR(c,865,345,335,215,24,p.panel);strokeRR(c,865,345,335,215,24,p.soft)
fillRR(c,510,575,690,150,24,p.panel);strokeRR(c,510,575,690,150,24,p.soft)

section(c,'♫  BRANO',535,385,p.accent)
divider(c,535,405,825,p.soft)
row(c,'Durata',getDuration(info),535,451,155,140,p.muted)
row(c,'Ascolti personali',fmt(info?.userplaycount||0),535,496,235,140,p.muted)
row(c,'Like brano',fmt(songLikes),535,541,155,140,p.muted)

section(c,'▥  LAST.FM',890,385,p.accent)
divider(c,890,405,1175,p.soft)
row(c,'Globali',fmt(info?.playcount||0),890,451,150,165,p.muted)
row(c,'Listeners',fmt(info?.listeners||0),890,496,150,165,p.muted)
row(c,'Utente',username,890,541,150,165,p.muted)

userIcon(c,655,613,p.accent)
section(c,'UTENTE',690,615,p.accent)
divider(c,535,635,1175,p.soft)
row(c,'Scrobble totali',fmt(userInfo?.playcount||0),535,680,220,280,p.muted)
row(c,'Like ricevuti',fmt(likesReceived),535,715,220,280,p.muted)

if(avatar){
c.save();c.beginPath();c.arc(1140,652,36,0,Math.PI*2);c.clip();c.drawImage(avatar,1104,616,72,72);c.restore()
c.beginPath();c.arc(1140,652,37,0,Math.PI*2);c.strokeStyle=p.accent;c.lineWidth=2;c.stroke()
}else{
fillRR(c,1104,616,72,72,36,p.avatar)
c.font='bold 20px Sans';c.fillStyle='#fff';c.textAlign='center';c.fillText('FM',1140,660);c.textAlign='left'
}

c.font='bold 16px Sans';c.fillStyle=p.muted;c.textAlign='right';c.fillText('AXION BOT',1190,765)
return cv.toBuffer('image/jpeg',{quality:.92})
}

export async function createHistoryCard({username,tracks,userInfo}){
const W=1280,H=980,cv=createCanvas(W,H),c=cv.getContext('2d')
const avatar=await loadImageOrNull(getUserImage(userInfo))
const accent='#ff9418',soft='rgba(255,148,24,.18)',panel='rgba(48,29,10,.70)'

background(c,W,H,'#1b1207','#241609','#080807','rgba(255,135,20,.22)')
fillRR(c,36,36,W-72,H-72,30,'rgba(13,10,6,.68)')
strokeRR(c,36,36,W-72,H-72,30,'rgba(255,148,24,.70)',2)

c.font='bold 46px Sans';c.fillStyle=accent;c.fillText(`CRONOLOGIA • ${username}`,66,92)
c.font='22px Sans';c.fillStyle='#c9b49c';c.fillText(`Ultime ${tracks.length} tracce ascoltate`,68,126)

if(avatar){
c.save();c.beginPath();c.arc(1180,95,42,0,Math.PI*2);c.clip();c.drawImage(avatar,1138,53,84,84);c.restore()
}

fillRR(c,68,166,1144,50,16,soft)
c.font='bold 19px Sans';c.fillStyle=accent
c.fillText('#',94,198);c.fillText('BRANO',150,198);c.fillText('ARTISTA',640,198);c.fillText('ORA',1100,198)

tracks.slice(0,10).forEach((t,i)=>{
const y=238+i*65,now=t?.['@attr']?.nowplaying==='true'
fillRR(c,68,y,1144,52,14,now?'rgba(255,148,24,.19)':i%2===0?panel:'rgba(41,27,13,.47)')
c.font='bold 18px Sans';c.fillStyle=accent;c.fillText(now?'▶':String(i+1).padStart(2,'0'),95,y+32)
c.font='bold 21px Sans';c.fillStyle='#fff';c.fillText(ellipsis(c,t?.name||'Brano sconosciuto',430),150,y+32)
c.font='18px Sans';c.fillStyle='#c7b29c';c.fillText(ellipsis(c,t?.artist?.['#text']||'Artista sconosciuto',385),640,y+32)
c.font='bold 18px Sans';c.fillStyle='#fff';c.fillText(trackTime(t),1100,y+32)
})

fillRR(c,68,900,1144,44,14,soft)
c.font='18px Sans';c.fillStyle='#b79d82';c.fillText(`Scrobble totali: ${fmt(userInfo?.playcount||0)}`,86,928)
c.font='bold 16px Sans';c.textAlign='right';c.fillText('AXION BOT',1195,928)

return cv.toBuffer('image/jpeg',{quality:.92})
}

export async function createLikesCard({username,userInfo,likesReceived,currentTrack,info}){
const W=1100,H=660,cv=createCanvas(W,H),c=cv.getContext('2d')
const cover=await loadImageOrNull(getTrackImage(currentTrack))
const avatar=await loadImageOrNull(getUserImage(userInfo))
const accent='#78dd4c',panel='rgba(16,54,24,.66)'

background(c,W,H,'#07150b','#0a2110','#070b08','rgba(55,190,80,.22)')
fillRR(c,34,34,W-68,H-68,30,'rgba(5,15,8,.68)')
strokeRR(c,34,34,W-68,H-68,30,'rgba(95,220,80,.68)',2)

fillRR(c,70,108,280,280,26,'#102619')
if(cover){
c.save();rr(c,70,108,280,280,26);c.clip();c.drawImage(cover,70,108,280,280);c.restore()
}

c.font='bold 44px Sans';c.fillStyle=accent;c.fillText(`MYLIKES • ${username}`,390,96)

fillRR(c,390,132,640,118,22,panel)
fillRR(c,390,270,640,118,22,panel)
fillRR(c,70,430,960,140,22,panel)

section(c,'♥  STATISTICHE',416,164,accent)
row(c,'Like ricevuti',fmt(likesReceived),416,202,180)
row(c,'Scrobble totali',fmt(userInfo?.playcount||0),416,234,180)

section(c,'♫  TRACCIA ATTUALE',416,302,accent)
row(c,'Brano',currentTrack?.name||'N/D',416,340,140,400)
row(c,'Artista',currentTrack?.artist?.['#text']||'N/D',416,372,140,400)

section(c,'▥  LAST.FM PROFILE',96,464,accent)
row(c,'Username',username,96,502,150,500)
row(c,'Playcount brano',fmt(info?.userplaycount||0),96,536,150,500)

if(avatar){
c.save();c.beginPath();c.arc(960,498,42,0,Math.PI*2);c.clip();c.drawImage(avatar,918,456,84,84);c.restore()
}

c.font='bold 16px Sans';c.fillStyle='#75a681';c.textAlign='right';c.fillText('NIGGA BOT',1030,605)
return cv.toBuffer('image/jpeg',{quality:.92})
}