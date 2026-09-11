import { createCanvas } from 'canvas'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execFileAsync = promisify(execFile)

const WIDTH = 720
const HEIGHT = 720
const FPS = 25
const DURATION = 3
const FRAMES = FPS * DURATION

function wrapText(ctx, text, maxWidth) {
    const words = text.split(/\s+/)
    const lines = []
    let line = ''

    for (const word of words) {
        const test = line ? `${line} ${word}` : word
        if (ctx.measureText(test).width <= maxWidth) {
            line = test
        } else {
            if (line) lines.push(line)
            line = word
        }
    }

    if (line) lines.push(line)
    return lines
}

function drawFrame(text, frame) {
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const progress = frame / (FRAMES - 1)

    const enter = Math.min(progress / 0.25, 1)
    const smooth = enter * enter * (3 - 2 * enter)

    const pulse = Math.sin(progress * Math.PI * 2.5) * 0.018
    const zoom = 0.96 + smooth * 0.04 + pulse

    const angle = Math.sin(progress * Math.PI * 4) * 0.012

    let fontSize = 92

    if (text.length > 35) fontSize = 78
    if (text.length > 60) fontSize = 66
    if (text.length > 90) fontSize = 56
    if (text.length > 130) fontSize = 48

    ctx.save()

    ctx.translate(WIDTH / 2, HEIGHT / 2)
    ctx.rotate(angle)
    ctx.scale(zoom, zoom)

    ctx.globalAlpha = smooth

    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxWidth = WIDTH - 90
    const lines = wrapText(ctx, text, maxWidth)

    const lineHeight = fontSize * 0.92
    const totalHeight = lines.length * lineHeight
    let y = -totalHeight / 2 + lineHeight / 2

    for (const line of lines) {
        ctx.fillText(line, 0, y)
        y += lineHeight
    }

    ctx.restore()

    return canvas.toBuffer('image/png')
}

const handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) return

    const input = text.trim()

    const tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'brat-')
    )

    const framesDir = path.join(tempDir, 'frames')
    await fs.promises.mkdir(framesDir)

    const output = path.join(tempDir, 'brat.mp4')

    try {
        for (let i = 0; i < FRAMES; i++) {
            const frame = drawFrame(input, i)
            const framePath = path.join(
                framesDir,
                `frame-${String(i).padStart(4, '0')}.png`
            )

            await fs.promises.writeFile(framePath, frame)
        }

        await execFileAsync('ffmpeg', [
            '-y',
            '-framerate',
            String(FPS),
            '-i',
            path.join(framesDir, 'frame-%04d.png'),
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-crf',
            '18',
            '-pix_fmt',
            'yuv420p',
            '-movflags',
            '+faststart',
            output
        ])

        await conn.sendMessage(
            m.chat,
            {
                video: await fs.promises.readFile(output),
                mimetype: 'video/mp4',
                fileName: 'brat.mp4'
            },
            { quoted: m }
        )
    } catch (e) {
        console.error('[BRAT ERROR]', e)
        await m.reply('❌ Errore nella creazione del video.')
    } finally {
        await fs.promises.rm(tempDir, {
            recursive: true,
            force: true
        }).catch(() => {})
    }
}

handler.help = ['brat <testo>']
handler.tags = ['fun']
handler.command = /^brat$/i

export default handler