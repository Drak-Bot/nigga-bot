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
        const cmd = command.toLowerCase();

        let youtubeUrl = text;
        let title = 'YouTube';
        let duration = '';
        let thumbnail = null;

        if (!/^https?:\/\//i.test(text)) {
            const search = await yts(text);
            const vid = search.videos?.[0];

            if (!vid) {
                return m.reply('❌ *Nessun risultato trovato.*');
            }

            youtubeUrl = vid.url;
            title = vid.title || 'Senza titolo';
            duration = vid.timestamp || '';
            thumbnail = vid.thumbnail;
        } else {
            try {
                const search = await yts(text);
                const vid = search.videos?.find(v => v.url === text) || search.videos?.[0];

                if (vid) {
                    title = vid.title || title;
                    duration = vid.timestamp || '';
                    thumbnail = vid.thumbnail;
                }
            } catch {}
        }

        if (cmd === 'play') {
            const caption =
                `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                `   🎧 *𝙋𝙇𝘼𝙔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻* 🎧\n` +
                `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                `◈ 📌 *Titolo:* ${title}\n` +
                `◈ ⏱️ *Durata:* ${duration || 'Sconosciuta'}\n\n` +
                `🎵 *Seleziona il formato:*`;

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

        await conn.sendMessage(m.chat, {
            react: {
                text: '📥',
                key: m.key
            }
        });

        const apiUrl = `${API}?query=${encodeURIComponent(youtubeUrl)}`;

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
            throw new Error('La risposta API non è JSON valido.');
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

        if (cmd === 'playvid') {
            await conn.sendMessage(
                m.chat,
                {
                    video: {
                        url: downloadUrl
                    },
                    mimetype: 'video/mp4',
                    caption:
                        `✅ *Download completato!*\n\n` +
                        `🎬 *${title}*` +
                        (duration ? `\n⏱️ ${duration}` : '')
                },
                { quoted: m }
            );
        } else if (cmd === 'playaud') {
            await conn.sendMessage(
                m.chat,
                {
                    audio: {
                        url: downloadUrl
                    },
                    mimetype: 'audio/mp4',
                    ptt: false
                },
                { quoted: m }
            );
        }

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
            `❌ *PLAY ERROR*\n\n${error.message || 'Errore sconosciuto'}`
        );
    }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
