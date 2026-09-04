import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const API = 'https://api.chatunity.it/download/play';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚡ *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*\n\n` +
            `💡 Usa:\n` +
            `${usedPrefix}play nome canzone`
        );
    }

    let tempInput = null;
    let tempOutput = null;

    try {
        const cmd = command.toLowerCase();

        let youtubeUrl = text.trim();
        let title = 'YouTube';
        let duration = '';
        let thumbnail = null;

        /*
         * ==============================
         * RICERCA YOUTUBE
         * ==============================
         */

        if (!/^https?:\/\//i.test(youtubeUrl)) {
            const search = await yts(youtubeUrl);
            const vid = search.videos?.[0];

            if (!vid) {
                return m.reply('❌ *Nessun risultato trovato.*');
            }

            youtubeUrl = vid.url;
            title = vid.title || 'Senza titolo';
            duration = vid.timestamp || '';
            thumbnail = vid.thumbnail || null;
        } else {
            try {
                const search = await yts(youtubeUrl);

                const vid =
                    search.videos?.find(v => v.url === youtubeUrl) ||
                    search.videos?.[0];

                if (vid) {
                    title = vid.title || title;
                    duration = vid.timestamp || '';
                    thumbnail = vid.thumbnail || null;
                }
            } catch {}
        }

        /*
         * ==============================
         * MENU PLAY
         * ==============================
         */

        if (cmd === 'play') {
            const caption =
                `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                `   🎧 *𝙋𝙇𝘼𝙔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻* 🎧\n` +
                `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `◈ 📌 *Titolo:* ${title}\n` +
                `◈ ⏱️ *Durata:* ${duration || 'Sconosciuta'}\n\n` +
                `🎵 *Seleziona il formato:*`;

            if (thumbnail) {
                return await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: thumbnail },
                        caption,
                        footer: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
                        buttons: [
                            {
                                buttonId: `${usedPrefix}playaud ${youtubeUrl}`,
                                buttonText: {
                                    displayText: '🎵 𝗔𝗨𝗗𝗜𝗢 (𝗠𝗣𝟯)'
                                },
                                type: 1
                            },
                            {
                                buttonId: `${usedPrefix}playvid ${youtubeUrl}`,
                                buttonText: {
                                    displayText: '🎬 𝗩𝗜𝗗𝗘𝗢 (𝗠𝗣𝟰)'
                                },
                                type: 1
                            }
                        ],
                        headerType: 4
                    },
                    { quoted: m }
                );
            }

            return await conn.sendMessage(
                m.chat,
                {
                    text: caption,
                    footer: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',
                    buttons: [
                        {
                            buttonId: `${usedPrefix}playaud ${youtubeUrl}`,
                            buttonText: {
                                displayText: '🎵 𝗔𝗨𝗗𝗜𝗢 (𝗠𝗣𝟯)'
                            },
                            type: 1
                        },
                        {
                            buttonId: `${usedPrefix}playvid ${youtubeUrl}`,
                            buttonText: {
                                displayText: '🎬 𝗩𝗜𝗗𝗘𝗢 (𝗠𝗣𝟰)'
                            },
                            type: 1
                        }
                    ],
                    headerType: 1
                },
                { quoted: m }
            );
        }

        /*
         * ==============================
         * REAZIONE DOWNLOAD
         * ==============================
         */

        await conn.sendMessage(m.chat, {
            react: {
                text: '📥',
                key: m.key
            }
        });

        /*
         * ==============================
         * CHATUNITY API
         * ==============================
         */

        const apiUrl =
            `${API}?query=${encodeURIComponent(youtubeUrl)}`;

        console.log('[CHATUNITY]', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const raw = await response.text();

        console.log('[CHATUNITY STATUS]', response.status);
        console.log('[CHATUNITY RESPONSE]', raw);

        if (!response.ok) {
            let errorMessage = raw;

            try {
                const errorJson = JSON.parse(raw);

                errorMessage =
                    errorJson.message ||
                    errorJson.error ||
                    raw;
            } catch {}

            throw new Error(
                `API HTTP ${response.status}: ${errorMessage}`
            );
        }

        let data;

        try {
            data = JSON.parse(raw);
        } catch {
            throw new Error(
                'La risposta API non è JSON valido.'
            );
        }

        if (!data.success) {
            throw new Error(
                data.message ||
                data.error ||
                'Download API fallito.'
            );
        }

        if (!data.downloadUrl) {
            throw new Error(
                'L API non ha restituito downloadUrl.'
            );
        }

        const downloadUrl = data.downloadUrl;

        console.log('[DOWNLOAD URL]', downloadUrl);

        /*
         * ==============================
         * DOWNLOAD FILE
         * ==============================
         */

        const fileResponse = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!fileResponse.ok) {
            throw new Error(
                `Impossibile scaricare il file. HTTP ${fileResponse.status}`
            );
        }

        const arrayBuffer = await fileResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(
            '[FILE SIZE]',
            (buffer.length / 1024 / 1024).toFixed(2),
            'MB'
        );

        /*
         * ==============================
         * VIDEO MP4
         * ==============================
         */

        if (cmd === 'playvid') {
            if (buffer.length > 200 * 1024 * 1024) {
                throw new Error(
                    'Il video è troppo grande per essere inviato.'
                );
            }

            await conn.sendMessage(
                m.chat,
                {
                    video: buffer,
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`,
                    caption:
                        `✅ *Download completato!*\n\n` +
                        `🎬 *${title}*` +
                        (duration
                            ? `\n⏱️ ${duration}`
                            : '')
                },
                { quoted: m }
            );
        }

        /*
         * ==============================
         * AUDIO MP3
         * ==============================
         */

        else if (cmd === 'playaud') {
            tempInput = path.join(
                os.tmpdir(),
                `play-${Date.now()}.mp4`
            );

            tempOutput = path.join(
                os.tmpdir(),
                `play-${Date.now()}.mp3`
            );

            fs.writeFileSync(tempInput, buffer);

            console.log('[FFMPEG] Conversione MP4 -> MP3');

            await execFileAsync('ffmpeg', [
                '-y',
                '-i',
                tempInput,
                '-vn',
                '-acodec',
                'libmp3lame',
                '-b:a',
                '128k',
                tempOutput
            ]);

            if (!fs.existsSync(tempOutput)) {
                throw new Error(
                    'FFmpeg non ha generato il file MP3.'
                );
            }

            const audioBuffer =
                fs.readFileSync(tempOutput);

            console.log(
                '[MP3 SIZE]',
                (audioBuffer.length / 1024 / 1024).toFixed(2),
                'MB'
            );

            await conn.sendMessage(
                m.chat,
                {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    ptt: false
                },
                { quoted: m }
            );
        }

        /*
         * ==============================
         * REAZIONE OK
         * ==============================
         */

        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });

    } catch (error) {
        console.error('[PLAY ERROR]', error);

        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });

        return m.reply(
            `❌ *PLAY ERROR*\n\n` +
            `${error.message || 'Errore sconosciuto'}`
        );
    }

    /*
     * ==============================
     * PULIZIA FILE TEMPORANEI
     * ==============================
     */

    finally {
        try {
            if (tempInput && fs.existsSync(tempInput)) {
                fs.unlinkSync(tempInput);
            }
        } catch {}

        try {
            if (tempOutput && fs.existsSync(tempOutput)) {
                fs.unlinkSync(tempOutput);
            }
        } catch {}
    }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;