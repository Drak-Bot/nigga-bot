import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (message, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(message.chat, {
      text: `𝑼𝒔𝒂 𝒒𝒖𝒆𝒔𝒕𝒐 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒅𝒊𝒓𝒆𝒕𝒕𝒂𝒎𝒆𝒏𝒕𝒆 𝒏𝒆𝒍 𝒏𝒖𝒎𝒆𝒓𝒐 𝒅𝒆𝒍 𝒃𝒐𝒕.`
    }, { quoted: message });
  }

  try {
    const sessionFolder = "./session/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(message.chat, {
        text: `╭━〔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━╮
┃
┃  ❌ 𝑺𝑬𝑺𝑺𝑰𝑶𝑵𝑰 𝑵𝑶𝑵 𝑻𝑹𝑶𝑽𝑨𝑻𝑬
┃
┃  𝑳𝒂 𝒄𝒂𝒓𝒕𝒆𝒍𝒍𝒂 𝒅𝒆𝒍𝒍𝒆
┃  𝒔𝒆𝒔𝒔𝒊𝒐𝒏𝒊 𝒆̀ 𝒗𝒖𝒐𝒕𝒂
┃  𝒐 𝒏𝒐𝒏 𝒆𝒔𝒊𝒔𝒕𝒆.
┃
╰━━━━━━━━━━━━━━━╯`
      }, { quoted: message });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }

    await conn.sendMessage(message.chat, {
      text: `╭━〔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━╮
┃
┃  💨 𝑺𝑬𝑺𝑺𝑰𝑶𝑵𝑰 𝑷𝑼𝑳𝑰𝑻𝑬
┃
┃  𝑺𝒐𝒏𝒐 𝒔𝒕𝒂𝒕𝒆 𝒓𝒊𝒎𝒐𝒔𝒔𝒆
┃  𝒄𝒐𝒏 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒐:
┃
┃  🗑️ 𝑺𝒆𝒔𝒔𝒊𝒐𝒏𝒊 𝒓𝒊𝒎𝒐𝒔𝒔𝒆:
┃  ✦ ${deletedCount}
┃
╰━━━━━━━━━━━━━━╯`
    }, { quoted: message });

  } catch (error) {
    console.error('⚠️ Errore:', error);

    await conn.sendMessage(message.chat, {
      text: `╭━〔 𝑵𝑰𝑮𝑮𝑨-𝑩𝑶𝑻 〕━╮
┃
┃  ⚠️ 𝑺𝑰 𝑬̀ 𝑽𝑬𝑹𝑰𝑭𝑰𝑪𝑨𝑻𝑶
┃  𝑼𝑵 𝑬𝑹𝑹𝑶𝑹𝑬
┃
┃  ❌ 𝑬𝒍𝒊𝒎𝒊𝒏𝒂𝒛𝒊𝒐𝒏𝒆
┃  𝒅𝒆𝒍𝒍𝒆 𝒔𝒆𝒔𝒔𝒊𝒐𝒏𝒊 𝒇𝒂𝒍𝒍𝒊𝒕𝒂.
┃
┃  🔧 𝑪𝒐𝒏𝒕𝒓𝒐𝒍𝒍𝒂 𝒊 𝒍𝒐𝒈
┃  𝒅𝒆𝒍 𝒃𝒐𝒕 𝒑𝒆𝒓 𝒎𝒂𝒈𝒈𝒊𝒐𝒓𝒊
┃  𝒅𝒆𝒕𝒕𝒂𝒈𝒍𝒊.
┃
╰━━━━━━━━━━━━━━╯`
    }, { quoted: message });
  }
};

handler.help = ['.𝐝𝐬'];
handler.tags = ["admin"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;