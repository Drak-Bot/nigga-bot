import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚡ *𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*\n\n` +
            `💡 _Scrivi:_ ${usedPrefix + command} nome canzone`
        );
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: '🔎', key: m.key }
        });

        // ==============================
        // RICERCA YOUTUBE
        // ==============================
        const search = await yts(text);
        const vid = search.videos?.[0];

        if (!vid) {
            return m.reply('⚠️ *Risultato non trovato.*');
        }

        const url = vid.url;
        const title = vid.title || 'Senza titolo';
        const duration = vid.timestamp || 'Sconosciuta';
        const thumbnail = vid.thumbnail;

        // ==============================
        // MENU PLAY
        // ==============================
        if (command.toLowerCase() === 'play') {

            const infoMsg =
                `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                `   🎧 *𝙋𝙡𝙖𝙮 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻* 🎧\n` +
                `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `◈ 📌 *𝗧𝗶𝘁𝗼𝗹𝗼:* ${title}\n` +
                `◈ ⏱️ *𝗗𝘂𝗿𝗮𝘁𝗮:* ${duration}\n\n` +
                `*Seleziona il formato:*`;

            return await conn.sendMessage(
                m.chat,
                {
                    image: { url: thumbnail },
                    caption: infoMsg,
                    footer: '𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻',

                    buttons: [
                        {
                            buttonId: `${usedPrefix}playaud ${url}`,
                            buttonText: {
                                displayText: '🎵 𝗔𝗨𝗗𝗜𝗢 (𝗠𝗣𝟯)'
                            },
                            type: 1
                        },
                        {
                            buttonId: `${usedPrefix}playvid ${url}`,
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

        // ==============================
        // DOWNLOAD
        // ==============================

        await conn.sendMessage(m.chat, {
            react: { text: '📥', key: m.key }
        });

        const isAudio = command.toLowerCase() === 'playaud';

        /*
         * API CHATUNITY
         *
         * Endpoint:
         * https://api.chatunity.it/downlaod/play
         *
         * Mandiamo la query YouTube all'API.
         */
        const apiUrl =
    `https://api.chatunity.it/download/play?q=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `API HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            '[CHATUNITY API]',
            JSON.stringify(data, null, 2)
        );

        // ==============================
        // CERCA URL MEDIA NELLA RISPOSTA
        // ==============================

        function findUrl(obj, keys = []) {
            if (!obj) return null;

            if (typeof obj === 'string') {
                if (
                    obj.startsWith('http://') ||
                    obj.startsWith('https://')
                ) {
                    return obj;
                }

                return null;
            }

            if (Array.isArray(obj)) {
                for (const item of obj) {
                    const result = findUrl(item, keys);
                    if (result) return result;
                }
            }

            if (typeof obj === 'object') {

                // Prima prova i nomi conosciuti
                for (const key of keys) {
                    if (obj[key]) {

                        if (
                            typeof obj[key] === 'string' &&
                            (
                                obj[key].startsWith('http://') ||
                                obj[key].startsWith('https://')
                            )
                        ) {
                            return obj[key];
                        }

                        const result = findUrl(obj[key], keys);
                        if (result) return result;
                    }
                }

                // Poi cerca ricorsivamente
                for (const key of Object.keys(obj)) {
                    const result = findUrl(obj[key], keys);
                    if (result) return result;
                }
            }

            return null;
        }

        // ==============================
        // URL AUDIO / VIDEO
        // ==============================

        let mediaUrl;

        if (isAudio) {

            mediaUrl = findUrl(data, [
                'audio',
                'audioUrl',
                'audio_url',
                'mp3',
                'mp3Url',
                'mp3_url',
                'download',
                'downloadUrl',
                'download_url',
                'url',
                'link'
            ]);

        } else {

            mediaUrl = findUrl(data, [
                'video',
                'videoUrl',
                'video_url',
                'mp4',
                'mp4Url',
                'mp4_url',
                'download',
                'downloadUrl',
                'download_url',
                'url',
                'link'
            ]);
        }

        if (!mediaUrl) {
            console.log(
                'Risposta API senza URL:',
                JSON.stringify(data, null, 2)
            );

            throw new Error(
                'L API non ha restituito un URL multimediale'
            );
        }

        // ==============================
        // AUDIO → VOCALE WHATSAPP
        // ==============================

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
                { quoted: m }
            );

        }

        // ==============================
        // VIDEO → MP4
        // ==============================

        else {

            await conn.sendMessage(
                m.chat,
                {
                    video: {
                        url: mediaUrl
                    },
                    mimetype: 'video/mp4',
                    caption:
                        `✅ *𝐒𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐝𝐚 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻*\n\n` +
                        `🎬 *${title}*`
                },
                { quoted: m }
            );
        }

        // ==============================
        // OK
        // ==============================

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {

        console.error(
            '[PLAY ERROR]',
            e
        );

        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        });

        return m.reply(
            `❌ *Errore Play*\n\n` +
            `Non sono riuscito a scaricare il contenuto.\n\n` +
            `> ${e.message || 'Errore sconosciuto'}`
        );
    }
};

// ==============================
// CONFIG
// ==============================

handler.help = [
    'play'
];

handler.tags = [
    'downloader'
];

handler.command = /^(play|playaud|playvid)$/i;

export default handler;