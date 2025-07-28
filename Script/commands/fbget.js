module.exports.config = {
    name: "تنزيل",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Download video or record from fb",
  commandCategory: "utilities",
  usages: "audio/video [link]",
  cooldowns: 0
};
module.exports.run = async function ({api,event,args})  {
const axios = global.nodemodule['axios'];  
const fs = global.nodemodule["fs-extra"];
try { 
  if(args[0] == 'صوت'){
        api.sendMessage(`طلب المعالجة!!!`, event.threadID, (err, info) => 
            
    setTimeout(() => {
        api.unsendMessage(info.messageID) } , 20000),event.messageID);
        const path = __dirname+`/cache/2.mp3`;
 let getPorn = (await axios.get(event.attachments[0].playableUrl,{ responseType:'arraybuffer'} )).data;
  fs.writeFileSync(path, Buffer.from(getPorn, "utf-8"));
return api.sendMessage({body : `نجاح تحميل 🥱`, 
    attachment: fs.createReadStream(path)}, event.threadID, () => fs.unlinkSync(path),event.messageID);
    }; 
  }catch {return api.sendMessage(`غير قادر على معالجة الطلب`,event.threadID,event.messageID)}
    try { 
      if(args[0] == 'فيديو'){
            api.sendMessage(`طلب المعالجة!!!`, event.threadID, (err, info) =>


    setTimeout(() => {
        api.unsendMessage(info.messageID) } , 20000),event.messageID);
            const path1 = __dirname+`/cache/1.mp4`;
 let getPorn = (await axios.get(event.attachments[0].playableUrl,{ responseType:'arraybuffer'} )).data;
  fs.writeFileSync(path1, Buffer.from(getPorn, "utf-8"));
return api.sendMessage({body : `نجاح تحميل 🥱`, 
    attachment: fs.createReadStream(path1)}, event.threadID, () => fs.unlinkSync(path1),event.messageID);
    }; 
  }catch {return api.sendMessage(`غير قادر على معالجة الطلب`,event.threadID,event.messageID)}
}
