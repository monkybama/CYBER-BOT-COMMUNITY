const axios = require('axios');

module.exports.config = {
 name: "رفع",
 version: "1.0.0",
 hasPermission: 0,
 credits: "Shaon",
 description: "Send a random sad video",
 commandCategory: "media",
 usages: "",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 try {
 const imageUrl = event.messageReply.attachments[0].url;
 const videoName = args.join(" ").trim(); 

 if (!videoName) {
 return api.sendMessage("الرجاء تقديم اسم للفيديو.", event.threadID, event.messageID);
 }
 const apis1 = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json')
 const Shaon1 = apis1.data.imgur
 

 const imgurResponse = await axios.get(`${Shaon1}/imgur?link=${encodeURIComponent(imageUrl)}`);
 const imgurLink = imgurResponse.data.uploaded.image;
 
 const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
 const Shaon = apis.data.api;

 const response = await axios.get(`${Shaon}/video/random?name=${encodeURIComponent(videoName)}&url=${encodeURIComponent(imgurLink)}`);
 
 api.sendMessage(`💌MESSAGE: URL ADDED SUCCESSFULLY\n🟡NAME: ${response.data.name}\n🖇️URL: ${response.data.url}`, event.threadID, event.messageID);

 } catch (e) {
 console.log(e);
 api.sendMessage(`حدث خطأ: ${e.message}`, event.threadID, event.messageID);
 }
};
