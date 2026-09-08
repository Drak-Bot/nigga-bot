import { createCanvas } from 'canvas'

const games = new Map()

const money = n =>
    Number(n || 0)
        .toFixed(2)
        .replace('.', ',')

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.closePath()
}

function drawLamp(ctx, x, y, scale = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.strokeStyle = '#171b20'
    ctx.lineWidth = 8

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -190)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, -190)
    ctx.quadraticCurveTo(5, -215, 35, -215)
    ctx.stroke()

    const glow = ctx.createRadialGradient(38, -215, 5, 38, -215, 90)
    glow.addColorStop(0, 'rgba(255,235,160,.55)')
    glow.addColorStop(1, 'rgba(255,235,160,0)')

    ctx.fillStyle = glow
    ctx.fillRect(-60, -275, 190, 160)

    ctx.fillStyle = '#fff1b0'
    ctx.shadowColor = '#ffe49a'
    ctx.shadowBlur = 25

    ctx.beginPath()
    ctx.arc(38, -215, 7, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.restore()
}

function drawManhole(ctx, x, y, w, h) {
    ctx.save()

    ctx.shadowColor = 'rgba(0,0,0,.8)'
    ctx.shadowBlur = 18
    ctx.shadowOffsetY = 8

    const metal = ctx.createRadialGradient(
        x - w * .2,
        y - h * .2,
        2,
        x,
        y,
        w
    )

    metal.addColorStop(0, '#858b8f')
    metal.addColorStop(.35, '#4c5357')
    metal.addColorStop(.7, '#272c30')
    metal.addColorStop(1, '#111417')

    ctx.fillStyle = metal

    ctx.beginPath()
    ctx.ellipse(x, y, w, h, -0.08, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.strokeStyle = '#858b8f'
    ctx.lineWidth = 3

    for (let i = -4; i <= 4; i++) {
        ctx.beginPath()
        ctx.moveTo(x - w * .75, y + i * 7)
        ctx.lineTo(x + w * .75, y + i * 7)
        ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(0,0,0,.7)'
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.ellipse(x, y, w * .78, h * .72, -0.08, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
}

function drawPuddle(ctx, x, y, w, h) {
    ctx.save()

    const g = ctx.createRadialGradient(
        x,
        y,
        2,
        x,
        y,
        w
    )

    g.addColorStop(0, 'rgba(150,180,195,.35)')
    g.addColorStop(.5, 'rgba(55,78,90,.25)')
    g.addColorStop(1, 'rgba(20,30,35,0)')

    ctx.fillStyle = g

    ctx.beginPath()
    ctx.ellipse(x, y, w, h, -0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(190,220,230,.25)'
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.ellipse(x, y, w * .7, h * .55, -0.1, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
}

function drawCrack(ctx, x, y, length, direction = 1) {
    ctx.save()

    ctx.strokeStyle = 'rgba(5,7,8,.65)'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(
        x + length * .3 * direction,
        y + 7
    )
    ctx.lineTo(
        x + length * .55 * direction,
        y - 9
    )
    ctx.lineTo(
        x + length * direction,
        y + 4
    )
    ctx.stroke()

    ctx.restore()
}

function drawChicken(ctx, x, y, scale = 1) {
    ctx.save()

    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.shadowColor = 'rgba(0,0,0,.7)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 13

    const body = ctx.createRadialGradient(
        -10,
        -15,
        5,
        0,
        0,
        55
    )

    body.addColorStop(0, '#fffef7')
    body.addColorStop(.55, '#e9e5d8')
    body.addColorStop(1, '#a9a59b')

    ctx.fillStyle = body

    ctx.beginPath()
    ctx.ellipse(0, 5, 34, 45, -.12, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#faf9f2'

    ctx.beginPath()
    ctx.ellipse(24, -38, 27, 27, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#d9362e'

    ctx.beginPath()
    ctx.arc(16, -64, 8, 0, Math.PI * 2)
    ctx.arc(27, -66, 8, 0, Math.PI * 2)
    ctx.arc(37, -63, 7, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e89b2c'

    ctx.beginPath()
    ctx.moveTo(46, -39)
    ctx.lineTo(68, -31)
    ctx.lineTo(46, -21)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#111'

    ctx.beginPath()
    ctx.arc(31, -45, 4.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#d8d3c7'

    ctx.beginPath()
    ctx.ellipse(-17, 3, 18, 29, -.6, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#d99828'
    ctx.lineWidth = 7
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-11, 40)
    ctx.lineTo(-15, 62)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(12, 40)
    ctx.lineTo(9, 62)
    ctx.stroke()

    ctx.strokeStyle = '#f0a52e'
    ctx.lineWidth = 4

    ctx.beginPath()
    ctx.moveTo(-20, 62)
    ctx.lineTo(-7, 62)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(3, 62)
    ctx.lineTo(16, 62)
    ctx.stroke()

    ctx.restore()
}

function drawCar(ctx, x, y, scale = 1) {
    ctx.save()

    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.shadowColor = 'rgba(0,0,0,.8)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 18

    const body = ctx.createLinearGradient(
        0,
        -45,
        0,
        40
    )

    body.addColorStop(0, '#9ba5ad')
    body.addColorStop(.35, '#59636c')
    body.addColorStop(.75, '#30373d')
    body.addColorStop(1, '#111519')

    ctx.fillStyle = body

    roundRect(ctx, -70, -25, 140, 65, 18)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#14191d'

    ctx.beginPath()
    ctx.moveTo(-42, -25)
    ctx.lineTo(-20, -53)
    ctx.lineTo(30, -53)
    ctx.lineTo(48, -25)
    ctx.closePath()
    ctx.fill()

    const glass = ctx.createLinearGradient(
        0,
        -55,
        0,
        -25
    )

    glass.addColorStop(0, '#b7d4df')
    glass.addColorStop(.5, '#54707c')
    glass.addColorStop(1, '#25343d')

    ctx.fillStyle = glass

    ctx.beginPath()
    ctx.moveTo(-15, -48)
    ctx.lineTo(27, -48)
    ctx.lineTo(39, -27)
    ctx.lineTo(-26, -27)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#ffe7a0'
    ctx.shadowColor = '#ffe49b'
    ctx.shadowBlur = 18

    roundRect(ctx, -64, -8, 14, 13, 4)
    ctx.fill()

    roundRect(ctx, 50, -8, 14, 13, 4)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#111'

    ctx.beginPath()
    ctx.arc(-45, 38, 15, 0, Math.PI * 2)
    ctx.arc(45, 38, 15, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
}

function createImage(game) {
    const width = 1200
    const height = 700

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const sky = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    )

    sky.addColorStop(0, '#050a10')
    sky.addColorStop(.35, '#122431')
    sky.addColorStop(.7, '#26363b')
    sky.addColorStop(1, '#111719')

    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, height)

    const moon = ctx.createRadialGradient(
        940,
        135,
        5,
        940,
        135,
        100
    )

    moon.addColorStop(0, 'rgba(255,245,210,.9)')
    moon.addColorStop(.2, 'rgba(255,240,190,.35)')
    moon.addColorStop(1, 'rgba(255,240,190,0)')

    ctx.fillStyle = moon
    ctx.fillRect(820, 20, 250, 250)

    ctx.fillStyle = '#0a1115'

    for (let i = 0; i < 18; i++) {
        const x = i * 75 + 20
        const h = 55 + ((i * 31) % 90)

        ctx.fillRect(
            x,
            310 - h,
            55,
            h
        )

        ctx.fillStyle = 'rgba(255,210,100,.18)'

        for (let w = 0; w < 3; w++) {
            ctx.fillRect(
                x + 9 + w * 15,
                325 - h,
                6,
                10
            )
        }

        ctx.fillStyle = '#0a1115'
    }

    drawLamp(ctx, 125, 395, 1)
    drawLamp(ctx, 1070, 395, 1)

    ctx.fillStyle = '#101518'
    ctx.fillRect(0, 430, width, 270)

    const roadTop = 305

    ctx.fillStyle = '#303538'

    ctx.beginPath()
    ctx.moveTo(330, roadTop)
    ctx.lineTo(870, roadTop)
    ctx.lineTo(1200, 700)
    ctx.lineTo(0, 700)
    ctx.closePath()
    ctx.fill()

    const roadLight = ctx.createLinearGradient(
        0,
        300,
        0,
        700
    )

    roadLight.addColorStop(
        0,
        'rgba(255,255,255,.12)'
    )

    roadLight.addColorStop(
        .5,
        'rgba(255,255,255,.03)'
    )

    roadLight.addColorStop(
        1,
        'rgba(0,0,0,.3)'
    )

    ctx.fillStyle = roadLight

    ctx.beginPath()
    ctx.moveTo(330, roadTop)
    ctx.lineTo(870, roadTop)
    ctx.lineTo(1200, 700)
    ctx.lineTo(0, 700)
    ctx.closePath()
    ctx.fill()

    for (let i = 0; i < 25; i++) {
        const x = (i * 83) % 1200
        const y = 330 + ((i * 71) % 340)

        ctx.fillStyle = 'rgba(255,255,255,.035)'

        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
    }

    drawCrack(ctx, 160, 620, 100, 1)
    drawCrack(ctx, 910, 610, 130, -1)
    drawCrack(ctx, 480, 450, 80, 1)

    drawPuddle(ctx, 220, 550, 120, 25)
    drawPuddle(ctx, 980, 510, 100, 22)

    drawManhole(ctx, 270, 610, 75, 25)
    drawManhole(ctx, 930, 580, 65, 22)

    ctx.strokeStyle = 'rgba(255,255,255,.07)'
    ctx.lineWidth = 4

    for (let i = 0; i < 6; i++) {
        const y = 350 + i * 55
        const p = (y - 305) / 395

        const left = 330 - 330 * p
        const right = 870 + 330 * p

        ctx.beginPath()
        ctx.moveTo(left, y)
        ctx.lineTo(right, y)
        ctx.stroke()
    }

    const p = Math.min(game.step / 8, 1)

    const chickenX = 600
    const chickenY = 555 - p * 235

    if (!game.crashed) {
        drawChicken(
            ctx,
            chickenX,
            chickenY,
            1.15
        )
    }

    if (game.step >= 2) {
        drawManhole(
            ctx,
            510,
            chickenY + 45,
            38,
            13
        )
    }

    if (game.step >= 4) {
        drawManhole(
            ctx,
            730,
            chickenY - 50,
            35,
            12
        )
    }

    drawCar(
        ctx,
        835,
        455 - p * 80,
        .7
    )

    ctx.fillStyle = 'rgba(5,8,11,.88)'

    roundRect(
        ctx,
        35,
        28,
        1130,
        110,
        25
    )

    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 2

    roundRect(
        ctx,
        35,
        28,
        1130,
        110,
        25
    )

    ctx.stroke()

    ctx.fillStyle = '#fff'
    ctx.textAlign = 'left'
    ctx.font = 'bold 35px Arial'

    ctx.fillText(
        'CHICKEN ROAD',
        65,
        76
    )

    ctx.fillStyle = '#aeb7bf'
    ctx.font = '19px Arial'

    ctx.fillText(
        `PUNTATA  €${money(game.bet)}`,
        65,
        108
    )

    ctx.textAlign = 'right'

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 34px Arial'

    ctx.fillText(
        `x${game.multiplier.toFixed(2)}`,
        1115,
        73
    )

    ctx.fillStyle = '#aeb7bf'
    ctx.font = '19px Arial'

    ctx.fillText(
        `VINCITA  €${money(game.bet * game.multiplier)}`,
        1115,
        106
    )

    if (game.crashed) {
        ctx.fillStyle = 'rgba(0,0,0,.72)'
        ctx.fillRect(0, 0, width, height)

        ctx.textAlign = 'center'

        ctx.fillStyle = '#fff'
        ctx.font = 'bold 72px Arial'

        ctx.fillText(
            'GAME OVER',
            600,
            345
        )

        ctx.fillStyle = '#d4dbe0'
        ctx.font = '26px Arial'

        ctx.fillText(
            `Hai perso €${money(game.bet)}`,
            600,
            395
        )
    }

    return canvas.toBuffer('image/png')
}

async function sendGame(conn, m, game) {
    const image = createImage(game)

    await conn.sendMessage(
        m.chat,
        {
            image,
            caption:
                `🐔 *CHICKEN ROAD*\n\n` +
                `💵 Puntata: €${money(game.bet)}\n` +
                `📈 Moltiplicatore: x${game.multiplier.toFixed(2)}\n` +
                `💰 Vincita: €${money(game.bet * game.multiplier)}\n\n` +
                `🐔 Fai avanzare il pollo oppure ritira la vincita.\n\n` +
                `Usa i pulsanti oppure:\n` +
                `• *.salta*\n` +
                `• *.ritira*`,
            buttons: [
                {
                    buttonId: 'chicken_salta',
                    buttonText: {
                        displayText: '🐔 SALTA'
                    },
                    type: 1
                },
                {
                    buttonId: 'chicken_ritira',
                    buttonText: {
                        displayText: '💰 RITIRA'
                    },
                    type: 1
                }
            ],
            headerType: 4
        },
        { quoted: m }
    )
}

function getAction(text) {
    if (!text) return null

    const t = text
        .trim()
        .toLowerCase()

    if (
        t === '.salta' ||
        t === 'salta' ||
        t.includes('chicken_salta')
    ) {
        return 'salta'
    }

    if (
        t === '.ritira' ||
        t === 'ritira' ||
        t.includes('chicken_ritira')
    ) {
        return 'ritira'
    }

    return null
}

async function playJump(conn, m, game) {
    const user =
        global.db.data.users[m.sender]

    if (!user) return

    game.step++

    if (game.step <= 2) {
        game.multiplier += 0.20
    } else if (game.step <= 5) {
        game.multiplier += 0.35
    } else {
        game.multiplier += 0.55
    }

    const crashChance =
        Math.min(
            0.10 + game.step * 0.055,
            0.55
        )

    if (Math.random() < crashChance) {
        game.crashed = true

        const image =
            createImage(game)

        games.delete(m.sender)

        await conn.sendMessage(
            m.chat,
            {
                image,
                caption:
                    `💥 *GAME OVER*\n\n` +
                    `🐔 Il pollo è stato colpito!\n\n` +
                    `❌ Persi: €${money(game.bet)}\n` +
                    `📈 Moltiplicatore raggiunto: x${game.multiplier.toFixed(2)}`
            },
            { quoted: m }
        )

        return
    }

    await sendGame(
        conn,
        m,
        game
    )
}

async function cashout(conn, m, game) {
    const user =
        global.db.data.users[m.sender]

    if (!user) return

    const winnings =
        game.bet * game.multiplier

    user.euro =
        Number(user.euro || 0) + winnings

    games.delete(m.sender)

    await conn.sendMessage(
        m.chat,
        {
            text:
                `💰 *RITIRO COMPLETATO*\n\n` +
                `🐔 Chicken Road\n\n` +
                `💵 Puntata: €${money(game.bet)}\n` +
                `📈 Moltiplicatore: x${game.multiplier.toFixed(2)}\n` +
                `💰 Vincita: €${money(winnings)}\n\n` +
                `💳 Saldo attuale: €${money(user.euro)}`
        },
        { quoted: m }
    )
}

const handler = async (m, { conn }) => {
    if (!m.isGroup) return

    const text =
        (m.text || '').trim()

    if (!/^\.chickenroad(?:\s|$)/i.test(text)) {
        return
    }

    const raw =
        text
            .replace(/^\.chickenroad\s*/i, '')
            .replace(',', '.')

    const amount =
        Number(raw)

    const user =
        global.db.data.users[m.sender]

    if (!user) return

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `🐔 *CHICKEN ROAD*\n\n` +
                    `Inserisci una puntata valida.\n\n` +
                    `Esempio:\n` +
                    `*.chickenroad 5*`
            },
            { quoted: m }
        )
    }

    const balance =
        Number(user.euro || 0)

    if (amount > balance) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `❌ *SALDO INSUFFICIENTE*\n\n` +
                    `💳 Disponibile: €${money(balance)}\n` +
                    `💵 Puntata: €${money(amount)}`
            },
            { quoted: m }
        )
    }

    if (games.has(m.sender)) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `⚠️ Hai già una partita Chicken Road in corso.\n\n` +
                    `Usa *.salta* oppure *.ritira*.`
            },
            { quoted: m }
        )
    }

    user.euro =
        balance - amount

    const game = {
        user: m.sender,
        chat: m.chat,
        bet: amount,
        step: 0,
        multiplier: 1,
        crashed: false
    }

    games.set(
        m.sender,
        game
    )

    await sendGame(
        conn,
        m,
        game
    )
}

handler.before = async function (m, { conn }) {
    const action =
        getAction(m.text || '')

    if (!action) return

    const game =
        games.get(m.sender)

    if (!game) return

    if (game.chat !== m.chat) return

    if (action === 'salta') {
        await playJump(
            conn,
            m,
            game
        )

        return
    }

    if (action === 'ritira') {
        await cashout(
            conn,
            m,
            game
        )

        return
    }
}

handler.command =
    /^chickenroad$/i

handler.group = true

export default handler