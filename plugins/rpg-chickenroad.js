import { createCanvas } from 'canvas'

const games = new Map()

const euro = n => Number(n).toFixed(2).replace('.', ',')

function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.closePath()
}

function drawChicken(ctx, x, y, scale = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.shadowColor = 'rgba(0,0,0,.55)'
    ctx.shadowBlur = 18
    ctx.shadowOffsetY = 10

    ctx.fillStyle = '#f5f1df'
    ctx.beginPath()
    ctx.ellipse(0, 0, 31, 40, -0.12, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(22, -32, 25, 25, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e74b3c'
    ctx.beginPath()
    ctx.arc(19, -56, 7, 0, Math.PI * 2)
    ctx.arc(28, -57, 7, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#f0a23a'
    ctx.beginPath()
    ctx.moveTo(44, -30)
    ctx.lineTo(62, -24)
    ctx.lineTo(44, -17)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#17191d'
    ctx.beginPath()
    ctx.arc(28, -38, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#d89b30'
    ctx.lineWidth = 7
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(-10, 34)
    ctx.lineTo(-14, 53)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(11, 34)
    ctx.lineTo(8, 53)
    ctx.stroke()

    ctx.strokeStyle = '#f0a23a'
    ctx.lineWidth = 4

    ctx.beginPath()
    ctx.moveTo(-18, 53)
    ctx.lineTo(-8, 53)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(3, 53)
    ctx.lineTo(13, 53)
    ctx.stroke()

    ctx.restore()
}

function drawCar(ctx, x, y, scale = 1) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.shadowColor = 'rgba(0,0,0,.7)'
    ctx.shadowBlur = 25
    ctx.shadowOffsetY = 12

    const body = ctx.createLinearGradient(0, -25, 0, 35)
    body.addColorStop(0, '#e8edf2')
    body.addColorStop(.45, '#69727c')
    body.addColorStop(1, '#20242a')

    ctx.fillStyle = body
    roundedRect(ctx, -58, -22, 116, 55, 16)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#171b20'
    ctx.beginPath()
    ctx.moveTo(-32, -22)
    ctx.lineTo(-14, -45)
    ctx.lineTo(26, -45)
    ctx.lineTo(42, -22)
    ctx.closePath()
    ctx.fill()

    const glass = ctx.createLinearGradient(0, -40, 0, -20)
    glass.addColorStop(0, '#b9d7e8')
    glass.addColorStop(1, '#344955')

    ctx.fillStyle = glass
    ctx.beginPath()
    ctx.moveTo(-10, -40)
    ctx.lineTo(22, -40)
    ctx.lineTo(34, -24)
    ctx.lineTo(-17, -24)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#ffe17a'
    roundedRect(ctx, -53, -8, 11, 12, 4)
    ctx.fill()

    roundedRect(ctx, 42, -8, 11, 12, 4)
    ctx.fill()

    ctx.fillStyle = '#111318'
    ctx.beginPath()
    ctx.arc(-38, 31, 13, 0, Math.PI * 2)
    ctx.arc(38, 31, 13, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
}

function drawCoin(ctx, x, y, r = 18) {
    ctx.save()

    ctx.shadowColor = 'rgba(255,190,50,.5)'
    ctx.shadowBlur = 20

    const g = ctx.createRadialGradient(
        x - r * .35,
        y - r * .35,
        2,
        x,
        y,
        r
    )

    g.addColorStop(0, '#fff4a8')
    g.addColorStop(.4, '#ffd84a')
    g.addColorStop(1, '#b97808')

    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = 'transparent'

    ctx.fillStyle = '#9a6505'
    ctx.font = `bold ${r}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('€', x, y + 1)

    ctx.restore()
}

function createGameImage(game) {
    const width = 1200
    const height = 700

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const sky = ctx.createLinearGradient(0, 0, 0, height)
    sky.addColorStop(0, '#07111d')
    sky.addColorStop(.45, '#142a3b')
    sky.addColorStop(1, '#20313a')

    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, height)

    const glow = ctx.createRadialGradient(
        600,
        250,
        20,
        600,
        250,
        450
    )

    glow.addColorStop(0, 'rgba(255,190,90,.25)')
    glow.addColorStop(1, 'rgba(255,190,90,0)')

    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#0c1519'
    ctx.fillRect(0, 440, width, 260)

    const roadTopY = 300
    const roadBottomY = 700

    ctx.fillStyle = '#292d31'

    ctx.beginPath()
    ctx.moveTo(330, roadTopY)
    ctx.lineTo(870, roadTopY)
    ctx.lineTo(1200, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    const roadGlow = ctx.createLinearGradient(0, 300, 0, 700)
    roadGlow.addColorStop(0, 'rgba(255,255,255,.08)')
    roadGlow.addColorStop(1, 'rgba(0,0,0,.22)')

    ctx.fillStyle = roadGlow
    ctx.beginPath()
    ctx.moveTo(330, roadTopY)
    ctx.lineTo(870, roadTopY)
    ctx.lineTo(1200, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    for (let i = 0; i < 7; i++) {
        const y = 340 + i * 55
        const progress = (y - roadTopY) / 400

        const left = 330 - 330 * progress
        const right = 870 + 330 * progress

        ctx.strokeStyle = 'rgba(255,255,255,.08)'
        ctx.lineWidth = 3

        ctx.beginPath()
        ctx.moveTo(left, y)
        ctx.lineTo(right, y)
        ctx.stroke()
    }

    for (let i = 0; i < 5; i++) {
        const xTop = 400 + i * 100
        const xBottom = -100 + i * 350

        ctx.strokeStyle = 'rgba(255,255,255,.06)'
        ctx.lineWidth = 4

        ctx.beginPath()
        ctx.moveTo(xTop, 300)
        ctx.lineTo(xBottom, 700)
        ctx.stroke()
    }

    ctx.fillStyle = '#f0c84b'
    ctx.fillRect(0, 505, 1200, 5)

    ctx.fillStyle = '#fff2a6'
    ctx.shadowColor = 'rgba(255,220,100,.8)'
    ctx.shadowBlur = 20
    ctx.fillRect(0, 505, 1200, 3)
    ctx.shadowColor = 'transparent'

    const progress = Math.min(game.step / 7, 1)

    const chickenX = 600
    const chickenY = 540 - progress * 220

    if (!game.crashed) {
        drawChicken(ctx, chickenX, chickenY, 1.1)
    }

    const obstacleY = 500 - progress * 180

    drawCar(
        ctx,
        850,
        obstacleY,
        .75
    )

    if (game.step > 0) {
        drawCoin(ctx, 420, 470, 20)
        drawCoin(ctx, 780, 405, 17)
    }

    ctx.fillStyle = 'rgba(5,8,12,.85)'
    roundedRect(ctx, 35, 30, 1130, 105, 25)
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,.08)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 34px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('CHICKEN ROAD', 65, 75)

    ctx.fillStyle = '#9da7b2'
    ctx.font = '20px Arial'
    ctx.fillText(
        `PUNTATA  €${euro(game.bet)}`,
        65,
        108
    )

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 31px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(
        `x${game.multiplier.toFixed(2)}`,
        1115,
        72
    )

    ctx.fillStyle = '#8f99a5'
    ctx.font = '19px Arial'
    ctx.fillText(
        `VINCITA  €${euro(game.bet * game.multiplier)}`,
        1115,
        105
    )

    ctx.textAlign = 'left'

    if (game.crashed) {
        ctx.fillStyle = 'rgba(5,7,10,.68)'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 70px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', 600, 340)

        ctx.fillStyle = '#d7dde4'
        ctx.font = '26px Arial'
        ctx.fillText(
            `Hai perso €${euro(game.bet)}`,
            600,
            390
        )

        ctx.textAlign = 'left'
    }

    return canvas.toBuffer('image/png')
}

async function sendGame(conn, m, game) {
    const image = createGameImage(game)

    await conn.sendMessage(
        m.chat,
        {
            image,
            caption:
                `🐔 *CHICKEN ROAD*\n\n` +
                `Puntata: €${euro(game.bet)}\n` +
                `Moltiplicatore: x${game.multiplier.toFixed(2)}\n` +
                `Vincita attuale: €${euro(game.bet * game.multiplier)}\n\n` +
                `Fai avanzare il pollo oppure ritira la vincita.`,
            buttons: [
                {
                    buttonId: 'chicken_salta',
                    buttonText: {
                        displayText: '🐔 SALTA'
                    },
                    type: 1
                },
                {
                    buttonId: 'chicken_prelievo',
                    buttonText: {
                        displayText: '💰 PRELIEVO'
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

    if (
        text.includes('chicken_salta') ||
        text.toLowerCase().includes('chicken_salta')
    ) {
        return 'salta'
    }

    if (
        text.includes('chicken_prelievo') ||
        text.toLowerCase().includes('chicken_prelievo')
    ) {
        return 'prelievo'
    }

    return null
}

const handler = async (m, { conn }) => {
    if (!m.isGroup) return

    const text = (m.text || '').trim()

    if (!/^\.chickenroad(?:\s|$)/i.test(text)) return

    const amountText = text
        .replace(/^\.chickenroad\s*/i, '')
        .replace(',', '.')

    const amount = Number(amountText)

    const user = global.db.data.users[m.sender]

    if (!user) return

    if (!Number.isFinite(amount) || amount <= 0) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `🐔 *CHICKEN ROAD*\n\n` +
                    `Usa:\n` +
                    `.chickenroad <importo>\n\n` +
                    `Esempio:\n` +
                    `.chickenroad 5`
            },
            { quoted: m }
        )
    }

    const balance = Number(user.euro || 0)

    if (amount > balance) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `❌ *Saldo insufficiente*\n\n` +
                    `Disponibile: €${euro(balance)}\n` +
                    `Puntata: €${euro(amount)}`
            },
            { quoted: m }
        )
    }

    if (games.has(m.sender)) {
        return conn.sendMessage(
            m.chat,
            {
                text:
                    `⚠️ Hai già una partita in corso.\n\n` +
                    `Usa *PRELIEVO* oppure continua la partita.`
            },
            { quoted: m }
        )
    }

    user.euro = balance - amount

    const game = {
        user: m.sender,
        chat: m.chat,
        bet: amount,
        step: 0,
        multiplier: 1,
        crashed: false
    }

    games.set(m.sender, game)

    await sendGame(conn, m, game)
}

handler.before = async function (m, { conn }) {
    const action = getAction(m.text || '')

    if (!action) return

    const game = games.get(m.sender)

    if (!game) return

    if (game.chat !== m.chat) return

    const user = global.db.data.users[m.sender]

    if (!user) return

    if (action === 'salta') {
        if (game.step >= 7) {
            game.multiplier += 0.5
        } else {
            game.multiplier += 0.25
        }

        game.step++

        const crashChance = Math.min(
            0.12 + game.step * 0.045,
            0.48
        )

        if (Math.random() < crashChance) {
            game.crashed = true

            games.delete(m.sender)

            const image = createGameImage(game)

            return conn.sendMessage(
                m.chat,
                {
                    image,
                    caption:
                        `💥 *GAME OVER*\n\n` +
                        `Il pollo è stato colpito.\n\n` +
                        `❌ Persi: €${euro(game.bet)}\n` +
                        `📈 Moltiplicatore: x${game.multiplier.toFixed(2)}`
                },
                { quoted: m }
            )
        }

        return sendGame(conn, m, game)
    }

    if (action === 'prelievo') {
        const winnings =
            game.bet * game.multiplier

        user.euro =
            Number(user.euro || 0) + winnings

        games.delete(m.sender)

        return conn.sendMessage(
            m.chat,
            {
                text:
                    `💰 *PRELIEVO COMPLETATO*\n\n` +
                    `🐔 Chicken Road\n` +
                    `📈 Moltiplicatore: x${game.multiplier.toFixed(2)}\n` +
                    `💵 Vincita: €${euro(winnings)}\n\n` +
                    `💳 Nuovo saldo: €${euro(user.euro)}`
            },
            { quoted: m }
        )
    }
}

handler.command = /^chickenroad$/i
handler.group = true

export default handler