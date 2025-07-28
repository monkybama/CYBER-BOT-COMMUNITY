module.exports.config = {
 name: "رسم",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Apply AI art style (anime)",
 commandCategory: "editing",
 usages: "reply to an image",
 cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
 const axios = require('axios');
 const fs = require('fs-extra');
 const FormData = require('form-data');
 const path = __dirname + `/cache/artify.jpg`;

 const { messageReply, threadID, messageID } = event;

 if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
 return api.sendMessage("❌ يرجى الرد بصورة.", threadID, messageID);
 }

 const url = messageReply.attachments[0].url;

 try {
 // ডাউনলোড করে লোকাল সেভ
 const response = await axios.get(url, { responseType: "مخزن المصفوفة" });
 fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

 // ফর্ম ডেটা তৈরি করে API তে পাঠানো
 const form = new FormData();
 form.append("image", fs.createReadStream(path));

 const apiRes = await axios.post(
 "https://art-api-97wn.onrender.com/artify?style=anime",
 form,
 { headers: form.getHeaders(), responseType: "مخزن المصفوفة" }
 );

 // রেসপন্স সেভ করে পাঠানো
 fs.writeFileSync(path, apiRes.data);

 api.sendMessage({
 body: "✅ AI artify منتهي.!",
 attachment: fs.createReadStream(path)
 }, threadID, () => fs.unlinkSync(path), messageID);

 } catch (err) {
 console.error(err);
 api.sendMessage("❌ حدث خطأ ما. يُرجى المحاولة مرة أخرى.", threadID, messageID);
 }
};
