//grafica lastfm by bonzino mod by deadly

import fetch from 'node-fetch'
import { createCanvas, loadImage } from 'canvas'

const fmt = n =>
  new Intl.NumberFormat('it-IT').format(Number(n) || 0)

const clean = t =>
  String(t || '').replace(/\s+/g, ' ').trim()

const clamp = (n, min, max) =>
  Math.max(min, Math.min(max, n))

async function fetchBuffer(url) {
  if (!url) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NiggaBot/1.0'
      }
    })

    if (!response.ok) return null

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function loadImageOrNull(url) {
  const buffer = await fetchBuffer(url)

  if (!buffer) return null

  try {
    return await loadImage(buffer)
  } catch {
    return null
  }
}

function getTrackImage(track) {
  const images = Array.isArray(track?.image)
    ? track.image
    : []

  return (
    images.find(x => x.size === 'extralarge')?.['#text'] ||
    images.find(x => x.size === 'large')?.['#text'] ||
    images.find(x => x.size === 'medium')?.['#text'] ||
    images.find(x => x.size === 'small')?.['#text'] ||
    null
  )
}

function getUserImage(user) {
  const images = Array.isArray(user?.image)
    ? user.image
    : []

  return (
    images.find(x => x.size === 'extralarge')?.['#text'] ||
    images.find(x => x.size === 'large')?.['#text'] ||
    images.find(x => x.size === 'medium')?.['#text'] ||
    images.find(x => x.size === 'small')?.['#text'] ||
    null
  )
}

function getDuration(info) {
  const raw = Number(info?.duration || 0)

  if (!raw) return 'N/D'

  const seconds =
    raw > 10000
      ? Math.floor(raw / 1000)
      : Math.floor(raw)

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function trackTime(track) {
  const uts = Number(track?.date?.uts || 0)

  if (!uts) return 'Adesso'

  return new Date(uts * 1000).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function isNowPlaying(track) {
  return track?.['@attr']?.nowplaying === 'true'
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(v => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  )
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')

  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16)
  }
}

function mixColor(a, b, amount) {
  const A = hexToRgb(a)
  const B = hexToRgb(b)

  const r = Math.round(A.r + (B.r - A.r) * amount)
  const g = Math.round(A.g + (B.g - A.g) * amount)
  const bl = Math.round(A.b + (B.b - A.b) * amount)

  return rgbToHex(r, g, bl)
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

function extractDominantColor(image) {
  if (!image) return '#7C5CFF'

  try {
    const size = 32
    const sample = createCanvas(size, size)
    const ctx = sample.getContext('2d')

    ctx.drawImage(image, 0, 0, size, size)

    const data = ctx.getImageData(0, 0, size, size).data

    let r = 0
    let g = 0
    let b = 0
    let count = 0

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]

      if (alpha < 100) continue

      const rr = data[i]
      const gg = data[i + 1]
      const bb = data[i + 2]

      const brightness = (rr + gg + bb) / 3
      const saturation =
        Math.max(rr, gg, bb) - Math.min(rr, gg, bb)

      if (brightness < 20) continue
      if (saturation < 20) continue

      r += rr
      g += gg
      b += bb
      count++
    }

    if (!count) return '#7C5CFF'

    r /= count
    g /= count
    b /= count

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    r = clamp(r + (r - (max + min) / 2) * 0.35, 0, 255)
    g = clamp(g + (g - (max + min) / 2) * 0.35, 0, 255)
    b = clamp(b + (b - (max + min) / 2) * 0.35, 0, 255)

    return rgbToHex(r, g, b)
  } catch {
    return '#7C5CFF'
  }
}

function buildTheme(image, fallback = '#7C5CFF') {
  const accent = image
    ? extractDominantColor(image)
    : fallback

  return {
    accent,
    accentBright: mixColor(accent, '#FFFFFF', 0.25),
    accentDark: mixColor(accent, '#000000', 0.45),
    bg0: '#050609',
    bg1: mixColor('#080A0F', accent, 0.16),
    bg2: mixColor('#0A0C12', accent, 0.09),
    white: '#FFFFFF',
    text: '#F7F7FA',
    muted: '#9CA3AF',
    dim: '#69707D',
    glass: 'rgba(255,255,255,.055)',
    glassStrong: 'rgba(255,255,255,.085)',
    glassBorder: 'rgba(255,255,255,.105)',
    shadow: 'rgba(0,0,0,.55)'
  }
}

function rr(c, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2)

  c.beginPath()
  c.moveTo(x + r, y)
  c.arcTo(x + w, y, x + w, y + h, r)
  c.arcTo(x + w, y + h, x, y + h, r)
  c.arcTo(x, y + h, x, y, r)
  c.arcTo(x, y, x + w, y, r)
  c.closePath()
}

function fillRR(c, x, y, w, h, radius, color) {
  rr(c, x, y, w, h, radius)
  c.fillStyle = color
  c.fill()
}

function strokeRR(c, x, y, w, h, radius, color, width = 1) {
  rr(c, x, y, w, h, radius)
  c.strokeStyle = color
  c.lineWidth = width
  c.stroke()
}

function glassCard(c, x, y, w, h, radius, theme, opacity = 1) {
  c.save()

  c.shadowColor = 'rgba(0,0,0,.35)'
  c.shadowBlur = 28
  c.shadowOffsetY = 12

  fillRR(
    c,
    x,
    y,
    w,
    h,
    radius,
    `rgba(255,255,255,${0.045 * opacity})`
  )

  c.shadowColor = 'transparent'

  strokeRR(
    c,
    x,
    y,
    w,
    h,
    radius,
    `rgba(255,255,255,${0.11 * opacity})`,
    1
  )

  c.restore()
}

function drawGlow(c, x, y, radius, color, alpha = 0.35) {
  const g = c.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    radius
  )

  g.addColorStop(0, rgba(color, alpha))
  g.addColorStop(0.35, rgba(color, alpha * 0.45))
  g.addColorStop(1, 'rgba(0,0,0,0)')

  c.fillStyle = g
  c.fillRect(
    x - radius,
    y - radius,
    radius * 2,
    radius * 2
  )
}

function drawBackground(c, W, H, theme) {
  const gradient = c.createLinearGradient(0, 0, W, H)

  gradient.addColorStop(0, theme.bg1)
  gradient.addColorStop(0.45, theme.bg0)
  gradient.addColorStop(1, theme.bg2)

  c.fillStyle = gradient
  c.fillRect(0, 0, W, H)

  drawGlow(
    c,
    W * 0.12,
    H * 0.15,
    480,
    theme.accent,
    0.30
  )

  drawGlow(
    c,
    W * 0.92,
    H * 0.85,
    420,
    theme.accent,
    0.15
  )

  c.save()

  for (let i = 0; i < 900; i++) {
    const x = Math.random() * W
    const y = Math.random() * H

    c.fillStyle =
      Math.random() > 0.5
        ? 'rgba(255,255,255,.018)'
        : 'rgba(0,0,0,.025)'

    c.fillRect(x, y, 1, 1)
  }

  c.restore()
}

function drawVignette(c, W, H) {
  const gradient = c.createRadialGradient(
    W / 2,
    H / 2,
    100,
    W / 2,
    H / 2,
    Math.max(W, H) * 0.72
  )

  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(0.7, 'rgba(0,0,0,.08)')
  gradient.addColorStop(1, 'rgba(0,0,0,.58)')

  c.fillStyle = gradient
  c.fillRect(0, 0, W, H)
}

function drawImageCover(c, image, x, y, w, h, radius = 0) {
  if (!image) return

  const sourceRatio = image.width / image.height
  const targetRatio = w / h

  let sx = 0
  let sy = 0
  let sw = image.width
  let sh = image.height

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio
    sx = (image.width - sw) / 2
  } else {
    sh = image.width / targetRatio
    sy = (image.height - sh) / 2
  }

  c.save()

  if (radius > 0) {
    rr(c, x, y, w, h, radius)
    c.clip()
  }

  c.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    x,
    y,
    w,
    h
  )

  c.restore()
}

function fitFont(c, text, maxWidth, startSize, minSize = 18) {
  let size = startSize

  while (size > minSize) {
    c.font = `800 ${size}px Sans`

    if (c.measureText(text).width <= maxWidth) {
      return size
    }

    size -= 2
  }

  return minSize
}

function ellipsis(c, text, maxWidth) {
  let value = clean(text)

  if (!value) return ''

  if (c.measureText(value).width <= maxWidth) {
    return value
  }

  while (
    value.length &&
    c.measureText(value + '…').width > maxWidth
  ) {
    value = value.slice(0, -1)
  }

  return value + '…'
}

function text(c, value, x, y, size, color, weight = 600) {
  c.font = `${weight} ${size}px Sans`
  c.fillStyle = color
  c.fillText(value, x, y)
}

function centerText(c, value, x, y, size, color, weight = 600) {
  c.font = `${weight} ${size}px Sans`
  c.fillStyle = color
  c.textAlign = 'center'
  c.fillText(value, x, y)
  c.textAlign = 'left'
}

function drawMusicIcon(c, x, y, color, scale = 1) {
  c.save()

  c.strokeStyle = color
  c.fillStyle = color
  c.lineWidth = 4 * scale
  c.lineCap = 'round'

  c.beginPath()
  c.moveTo(x + 9 * scale, y)
  c.lineTo(x + 9 * scale, y + 25 * scale)
  c.stroke()

  c.beginPath()
  c.moveTo(x + 9 * scale, y)
  c.lineTo(x + 27 * scale, y - 5 * scale)
  c.stroke()

  c.beginPath()
  c.arc(
    x + 3 * scale,
    y + 28 * scale,
    7 * scale,
    0,
    Math.PI * 2
  )
  c.fill()

  c.beginPath()
  c.arc(
    x + 22 * scale,
    y + 23 * scale,
    7 * scale,
    0,
    Math.PI * 2
  )
  c.fill()

  c.restore()
}

function drawUserIcon(c, x, y, color, scale = 1) {
  c.save()

  c.fillStyle = color

  c.beginPath()
  c.arc(
    x,
    y - 8 * scale,
    7 * scale,
    0,
    Math.PI * 2
  )
  c.fill()

  c.beginPath()
  c.arc(
    x,
    y + 10 * scale,
    14 * scale,
    Math.PI,
    0
  )
  c.closePath()
  c.fill()

  c.restore()
}

function drawHeart(c, x, y, color, scale = 1) {
  c.save()

  c.fillStyle = color

  c.beginPath()
  c.moveTo(x, y + 12 * scale)

  c.bezierCurveTo(
    x - 22 * scale,
    y - 2 * scale,
    x - 10 * scale,
    y - 16 * scale,
    x,
    y - 6 * scale
  )

  c.bezierCurveTo(
    x + 10 * scale,
    y - 16 * scale,
    x + 22 * scale,
    y - 2 * scale,
    x,
    y + 12 * scale
  )

  c.fill()
  c.restore()
}

function badge(c, label, x, y, theme, options = {}) {
  const size = options.size || 15
  const color = options.color || theme.accent
  const paddingX = 13
  const h = options.height || 30

  c.font = `800 ${size}px Sans`

  const width =
    c.measureText(label).width + paddingX * 2

  fillRR(
    c,
    x,
    y,
    width,
    h,
    h / 2,
    rgba(color, 0.14)
  )

  strokeRR(
    c,
    x,
    y,
    width,
    h,
    h / 2,
    rgba(color, 0.40),
    1
  )

  centerText(
    c,
    label,
    x + width / 2,
    y + h / 2 + size * 0.34,
    size,
    color,
    800
  )

  return width
}

function statBox(
  c,
  x,
  y,
  w,
  h,
  label,
  value,
  theme,
  icon = null
) {
  fillRR(
    c,
    x,
    y,
    w,
    h,
    18,
    'rgba(255,255,255,.045)'
  )

  strokeRR(
    c,
    x,
    y,
    w,
    h,
    18,
    'rgba(255,255,255,.075)',
    1
  )

  if (icon) {
    icon(c, x + 22, y + 28, theme.accent, 0.65)
  }

  const offset = icon ? 52 : 20

  text(
    c,
    label.toUpperCase(),
    x + offset,
    y + 25,
    11,
    theme.dim,
    800
  )

  text(
    c,
    String(value),
    x + offset,
    y + 53,
    22,
    theme.text,
    800
  )
}

function drawAvatar(c, avatar, x, y, size, theme) {
  c.save()

  c.shadowColor = rgba(theme.accent, 0.35)
  c.shadowBlur = 20

  c.beginPath()
  c.arc(
    x + size / 2,
    y + size / 2,
    size / 2,
    0,
    Math.PI * 2
  )
  c.clip()

  if (avatar) {
    drawImageCover(
      c,
      avatar,
      x,
      y,
      size,
      size
    )
  } else {
    c.fillStyle = theme.accentDark
    c.fillRect(x, y, size, size)

    drawUserIcon(
      c,
      x + size / 2,
      y + size / 2 + 6,
      '#FFFFFF',
      1.2
    )
  }

  c.restore()

  c.beginPath()
  c.arc(
    x + size / 2,
    y + size / 2,
    size / 2,
    0,
    Math.PI * 2
  )

  c.strokeStyle = rgba(theme.accent, 0.8)
  c.lineWidth = 2
  c.stroke()
}

export async function createCurrentTrackCard({
  username,
  track,
  info,
  userInfo,
  likesReceived,
  songLikes
}) {
  const W = 1400
  const H = 900

  const canvas = createCanvas(W, H)
  const c = canvas.getContext('2d')

  const cover = await loadImageOrNull(
    getTrackImage(track)
  )

  const avatar = await loadImageOrNull(
    getUserImage(userInfo)
  )

  const theme = buildTheme(cover)

  const title =
    clean(track?.name) ||
    'Brano sconosciuto'

  const artist =
    clean(track?.artist?.['#text']) ||
    'Artista sconosciuto'

  const album =
    clean(track?.album?.['#text']) ||
    clean(info?.album?.title) ||
    'Album sconosciuto'

  const now = isNowPlaying(track)

  drawBackground(c, W, H, theme)

  fillRR(
    c,
    36,
    36,
    W - 72,
    H - 72,
    38,
    'rgba(5,7,11,.70)'
  )

  strokeRR(
    c,
    36,
    36,
    W - 72,
    H - 72,
    38,
    'rgba(255,255,255,.09)',
    1
  )

  drawGlow(
    c,
    270,
    390,
    370,
    theme.accent,
    0.28
  )

  const coverX = 76
  const coverY = 104
  const coverSize = 410

  c.save()

  c.shadowColor = rgba(theme.accent, 0.38)
  c.shadowBlur = 45
  c.shadowOffsetY = 18

  fillRR(
    c,
    coverX,
    coverY,
    coverSize,
    coverSize,
    32,
    theme.accentDark
  )

  if (cover) {
    drawImageCover(
      c,
      cover,
      coverX,
      coverY,
      coverSize,
      coverSize,
      32
    )
  } else {
    centerText(
      c,
      'NO COVER',
      coverX + coverSize / 2,
      coverY + coverSize / 2,
      28,
      '#FFFFFF',
      800
    )
  }

  c.restore()

  strokeRR(
    c,
    coverX,
    coverY,
    coverSize,
    coverSize,
    32,
    'rgba(255,255,255,.18)',
    1
  )

  if (now) {
    fillRR(
      c,
      coverX,
      548,
      coverSize,
      62,
      20,
      rgba(theme.accent, 0.14)
    )

    c.beginPath()
    c.arc(
      coverX + 31,
      579,
      7,
      0,
      Math.PI * 2
    )

    c.fillStyle = '#66FF88'
    c.shadowColor = '#66FF88'
    c.shadowBlur = 16
    c.fill()
    c.shadowBlur = 0

    text(
      c,
      'NOW PLAYING',
      coverX + 53,
      587,
      16,
      '#FFFFFF',
      800
    )
  } else {
    fillRR(
      c,
      coverX,
      548,
      coverSize,
      62,
      20,
      'rgba(255,255,255,.055)'
    )

    text(
      c,
      'LAST PLAYED',
      coverX + 22,
      587,
      16,
      theme.muted,
      800
    )
  }

  text(
    c,
    'LAST.FM',
    550,
    105,
    15,
    theme.accentBright,
    800
  )

  drawAvatar(
    c,
    avatar,
    1180,
    70,
    58,
    theme
  )

  text(
    c,
    clean(username) || 'user',
    1060,
    106,
    15,
    theme.muted,
    700
  )

  const titleSize = fitFont(
    c,
    title,
    750,
    58,
    30
  )

  text(
    c,
    ellipsis(c, title, 750),
    550,
    190,
    titleSize,
    theme.text,
    800
  )

  text(
    c,
    ellipsis(c, artist, 750),
    550,
    240,
    30,
    theme.accentBright,
    800
  )

  text(
    c,
    ellipsis(c, album, 750),
    550,
    278,
    18,
    theme.muted,
    600
  )

  c.strokeStyle = rgba(theme.accent, 0.32)
  c.lineWidth = 2

  c.beginPath()
  c.moveTo(550, 310)
  c.lineTo(1280, 310)
  c.stroke()

  statBox(
    c,
    550,
    345,
    225,
    86,
    'Durata',
    getDuration(info),
    theme,
    drawMusicIcon
  )

  statBox(
    c,
    790,
    345,
    225,
    86,
    'I tuoi ascolti',
    fmt(info?.userplaycount),
    theme,
    null
  )

  statBox(
    c,
    1030,
    345,
    250,
    86,
    'Like',
    fmt(songLikes),
    theme,
    drawHeart
  )

  glassCard(
    c,
    550,
    465,
    730,
    170,
    26,
    theme
  )

  text(
    c,
    'LAST.FM',
    580,
    505,
    12,
    theme.accent,
    800
  )

  text(
    c,
    'ASCOLTI GLOBALI',
    580,
    545,
    11,
    theme.dim,
    800
  )

  text(
    c,
    fmt(info?.playcount),
    580,
    578,
    25,
    theme.text,
    800
  )

  text(
    c,
    'LISTENERS',
    840,
    545,
    11,
    theme.dim,
    800
  )

  text(
    c,
    fmt(info?.listeners),
    840,
    578,
    25,
    theme.text,
    800
  )

  text(
    c,
    'SCROBBLE',
    1080,
    545,
    11,
    theme.dim,
    800
  )

  text(
    c,
    trackTime(track),
    1080,
    578,
    25,
    theme.text,
    800
  )

  glassCard(
    c,
    550,
    660,
    730,
    120,
    26,
    theme
  )

  drawUserIcon(
    c,
    590,
    707,
    theme.accent,
    1
  )

  text(
    c,
    clean(username) || 'Utente',
    625,
    700,
    20,
    theme.text,
    800
  )

  text(
    c,
    `${fmt(userInfo?.playcount)} scrobble totali`,
    625,
    730,
    14,
    theme.muted,
    600
  )

  badge(
    c,
    `${fmt(likesReceived)} LIKE RICEVUTI`,
    1000,
    688,
    theme
  )

  text(
    c,
    'NIGGA BOT',
    1185,
    830,
    11,
    theme.dim,
    800
  )

  drawVignette(c, W, H)

  return canvas.toBuffer('image/jpeg', {
    quality: 0.94,
    progressive: true,
    chromaSubsampling: false
  })
}

export async function createHistoryCard({
  username,
  tracks,
  userInfo
}) {
  const W = 1400
  const H = 1050

  const canvas = createCanvas(W, H)
  const c = canvas.getContext('2d')

  const list = Array.isArray(tracks)
    ? tracks.slice(0, 10)
    : []

  const avatar = await loadImageOrNull(
    getUserImage(userInfo)
  )

  const firstCover = list.length
    ? await loadImageOrNull(
        getTrackImage(list[0])
      )
    : null

  const theme = buildTheme(
    firstCover,
    '#FF9F1C'
  )

  drawBackground(c, W, H, theme)

  fillRR(
    c,
    36,
    36,
    W - 72,
    H - 72,
    38,
    'rgba(5,7,11,.74)'
  )

  strokeRR(
    c,
    36,
    36,
    W - 72,
    H - 72,
    38,
    'rgba(255,255,255,.09)',
    1
  )

  text(
    c,
    'LISTENING HISTORY',
    76,
    105,
    15,
    theme.accentBright,
    800
  )

  text(
    c,
    clean(username) || 'user',
    76,
    155,
    44,
    theme.text,
    800
  )

  text(
    c,
    `Ultime ${list.length} tracce ascoltate`,
    78,
    190,
    17,
    theme.muted,
    600
  )

  drawAvatar(
    c,
    avatar,
    1260,
    80,
    72,
    theme
  )

  c.strokeStyle = rgba(theme.accent, 0.30)
  c.lineWidth = 2

  c.beginPath()
  c.moveTo(76, 225)
  c.lineTo(1324, 225)
  c.stroke()

  text(c, '#', 92, 260, 11, theme.dim, 800)
  text(c, 'BRANO', 150, 260, 11, theme.dim, 800)
  text(c, 'ARTISTA', 700, 260, 11, theme.dim, 800)
  text(c, 'ASCOLTO', 1190, 260, 11, theme.dim, 800)

  list.forEach((track, index) => {
    const y = 285 + index * 68
    const current = isNowPlaying(track)

    const rowColor = current
      ? rgba(theme.accent, 0.13)
      : index % 2 === 0
        ? 'rgba(255,255,255,.035)'
        : 'rgba(255,255,255,.018)'

    fillRR(
      c,
      76,
      y,
      1248,
      55,
      16,
      rowColor
    )

    if (current) {
      fillRR(
        c,
        76,
        y,
        4,
        55,
        2,
        theme.accent
      )
    }

    text(
      c,
      current
        ? '▶'
        : String(index + 1).padStart(2, '0'),
      96,
      y + 34,
      current ? 14 : 13,
      current ? theme.accent : theme.dim,
      800
    )

    text(
      c,
      ellipsis(
        c,
        track?.name || 'Brano sconosciuto',
        500
      ),
      150,
      y + 34,
      17,
      theme.text,
      700
    )

    text(
      c,
      ellipsis(
        c,
        track?.artist?.['#text'] ||
          'Artista sconosciuto',
        390
      ),
      700,
      y + 34,
      15,
      theme.muted,
      600
    )

    text(
      c,
      trackTime(track),
      1190,
      y + 34,
      15,
      current ? theme.accentBright : theme.text,
      700
    )
  })

  const bottomY = 975

  text(
    c,
    'SCROBBLE TOTALI',
    78,
    bottomY,
    11,
    theme.dim,
    800
  )

  text(
    c,
    fmt(userInfo?.playcount),
    78,
    bottomY + 30,
    20,
    theme.text,
    800
  )

  c.textAlign = 'right'

  text(
    c,
    'NIGGA BOT  •  LAST.FM',
    1320,
    bottomY + 20,
    11,
    theme.dim,
    