const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "hd",
  version: "2.2",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "hd",
  commandCategory: "no prefix",
  usages: "Reply to a photo to enhance image ",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.indexOf("hd") === 0 || event.body.indexOf("Hd") === 0)) return;
  const args = event.body.split(/\s+/);
  args.shift();

  const pathie = __dirname + `/cache/zombie.jpg`;
  const { threadID, messageID } = event;

  const photoUrl = event.messageReply.attachments[0] ? event.messageReply.attachments[0].url : args.join(" ");

  if (!photoUrl) {
    api.sendMessage("•┄┅════❁🌺❁════┅┄•\n\n السلام عليكم.-!!🖤💫\n قم بالرد بالصورة التي تريد جعلها عالية الدقة وأرسل رسالة نصية قصيرة.\n\n•┄┅════❁🌺❁════┅┄•", threadID, messageID);
    return;
  }

  api.sendMessage("╭•┄┅════❁🌺❁════┅┄•╮\n\n يرجى الانتظار، يتم تحويل صورتك إلى HD-!!⌛\n\n╰•┄┅════❁🌺❁════┅┄•╯", threadID, async () => {
    try {
      const response = await axios.get(`https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data.image_data;
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: "╭•┄┅════❁🌺❁════┅┄•╮\n\n لقد تم تغيير صورتك إلى HD.\n\n╰•┄┅════❁🌺❁════┅┄•╯",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(` 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾: ${error}`, threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};
