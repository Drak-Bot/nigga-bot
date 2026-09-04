import yts from 'yt-search';

const API = 'https://api.chatunity.it/download/play';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚡ *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*\n\n` +
            `💡 Usa:\n` +
            `${usedPrefix}play nome canzone`
        );
    }

    try {
        // =========================
        // RICERCA YOUTUBE
        // =========================

        const search = await yts(text);
        const vid = search.videos?.[0];

        if (!vid) {
            return m.reply('❌ *Nessun risultato trovato.*');
        }

        const youtubeUrl = vid.url;
        const title = vid.title || 'Senza titolo';
        const duration = vid.timestamp || 'Sconosciuta';
        const thumbnail = vid.thumbnail;

        // =========================
        // MENU
        // =========================

        if (command.toLowerCase() === 'play') {

            const caption =
                `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                `   🎧 *𝙋𝙇𝘼𝙔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻* 🎧\n` +
                `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `◈ 📌 *Titolo:* ${title}\n` +
                `◈ ⏱️ *Durata:* ${duration}\n\n` +
                `🎵 *Scegli il formato:*`;

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

        // =========================
        // DOWNLOAD
        // =========================

        const isAudio = command.toLowerCase() === 'playaud';

        await conn.sendMessage(m.chat, {
            react: {
                text: '📥',
                key: m.key
            }
        });

        // =========================
        // CHIAMATA API
        // =========================

        let data = null;
        let lastError = null;

        const parameters = [
            `url=${encodeURIComponent(youtubeUrl)}`,
            `q=${encodeURIComponent(youtubeUrl)}`,
            `query=${encodeURIComponent(youtubeUrl)}`
        ];

        for (const parameter of parameters) {

            try {

                const apiUrl = `${API}?${parameter}`;

                console.log('[CHATUNITY]', apiUrl);

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    }
                });

                const raw = await response.text();

                console.log(
                    '[CHATUNITY STATUS]',
                    response.status
                );

                console.log(
                    '[CHATUNITY RESPONSE]',
                    raw
                );

                if (!response.ok) {
                    lastError = `HTTP ${response.status}: ${raw}`;
                    continue;
                }

                try {
                    data = JSON.parse(raw);
                } catch {
                    data = raw;
                }

                break;

            } catch (err) {
                lastError = err.message;
            }
        }

        if (!data) {
            throw new Error(
                lastError ||
                'Nessuna risposta valida dall API'
            );
        }

        // =========================
        // TROVA URL MEDIA
        // =========================

        const findMediaUrl = (obj, wantedType) => {

            if (!obj) return null;

            if (typeof obj === 'string') {

                if (
                    obj.startsWith('https://') ||
                    obj.startsWith('http://')
                ) {
                    return obj;
                }

                return null;
            }

            if (Array.isArray(obj)) {

                for (const item of obj) {
                    const result = findMediaUrl(
                        item,
                        wantedType
                    );

                    if (result) return result;
                }

                return null;
            }

            if (typeof obj === 'object') {

                const audioKeys = [
                    'audio',
                    'audioUrl',
                    'audio_url',
                    'mp3',
                    'mp3Url',
                    'mp3_url',
                    'music',
                    'song',
                    'download'
                ];

                const videoKeys = [
                    'video',
                    'videoUrl',
                    'video_url',
                    'mp4',
                    'mp4Url',
                    'mp4_url',
                    'download'
                ];

                const keys =
                    wantedType === 'audio'
                        ? audioKeys
                        : videoKeys;

                // Prima cerca nei campi specifici
                for (const key of keys) {

                    if (obj[key]) {

                        const value = obj[key];

                        if (
                            typeof value === 'string' &&
                            (
                                value.startsWith('https://') ||
                                value.startsWith('http://')
                            )
                        ) {
                            return value;
                        }

                        const result = findMediaUrl(
                            value,
                            wantedType
                        );

                        if (result) return result;
                    }
                }

                // Cerca url/link generici
                for (const key of [
                    'url',
                    'link',
                    'downloadUrl',
                    'download_url',
                    'result'
                ]) {

                    if (obj[key]) {

                        const value = obj[key];

                        if (
                            typeof value === 'string' &&
                            (
                                value.startsWith('https://') ||
                                value.startsWith('http://')
                            )
                        ) {
                            return value;
                        }

                        const result = findMediaUrl(
                            value,
                            wantedType
                        );

                        if (result) return result;
                    }
                }

                // Ricerca ricorsiva
                for (const key of Object.keys(obj)) {

                    const result = findMediaUrl(
                        obj[key],
                        wantedType
                    );

                    if (result) return result;
                }
            }

            return null;
        };

        const mediaUrl = findMediaUrl(
            data,
            isAudio ? 'audio' : 'video'
        );

        if (!mediaUrl) {

            console.log(
                '❌ URL MEDIA NON TROVATO'
            );

            console.log(
                JSON.stringify(data, null, 2)
            );

            throw new Error(
                'L API non ha restituito un link audio/video.'
            );
        }

        console.log(
            '[MEDIA URL]',
            mediaUrl
        );

        // =========================
        // AUDIO → VOCALE
        // =========================

        if (isAudio) {

            await conn.sendMessage(
                m.chat,
                {
                    audio: {
                        url: mediaUrl
                    },

                    mimetype: 'audio/ogg; codecs=opus',

                    ptt: true
                },
                {
                    quoted: m
                }
            );

        }

        // =========================
        // VIDEO
        // =========================

        else {

            await conn.sendMessage(
                m.chat,
                {
                    video: {
                        url: mediaUrl
                    },

                    mimetype: 'video/mp4',

                    caption:
                        `✅ *Download completato!*\n\n` +
                        `🎬 *${title}*\n` +
                        `⏱️ ${duration}`
                },
                {
                    quoted: m
                }
            );
        }

        // =========================
        // SUCCESS
        // =========================

        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });

    } catch (error) {

        console.error(
            '[PLAY ERROR]',
            error
        );

        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });

        return m.reply(
            `❌ *PLAY ERROR*\n\n` +
            `Impossibile scaricare il contenuto.\n\n` +
            `📌 ${error.message || 'Errore sconosciuto'}`
        );
    }
};

// =========================
// CONFIGURAZIONE
// =========================

handler.help = [
    'play'
];

handler.tags = [
    'downloader'
];

handler.command =
    /^(play|playaud|playvid)$/i;

export default handler;