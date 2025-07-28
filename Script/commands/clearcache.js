module.exports.config = {
	name: "شال",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Delete cache file/folder",
	commandCategory: "system",
	usages: "",
	cooldowns: 2
};

module.exports.run = async function ({ event, api, Currencies, args, Threads }) {
const { writeFileSync, readdirSync, existsSync, unlinkSync } = require('fs-extra');
const permission = ["61562119538523"];
             if (!permission.includes(event.senderID))
             return api.sendMessage("ULLASH only.", event.threadID, event.messageID);
  /*
  if(args[0] == "spam"){
      const { resolve } = require('path');
for(let i = 0; i < args[1]; i++){
          const path = resolve(__dirname, "cache", i + ".txt");
if (!existsSync(path)) writeFileSync(path, "tdungdeptrai", "utf-8");
  console.log(i)
}
  }
  */
  if(!args[0]){ return api.sendMessage('لم تقم بإدخال امتداد الملف المطلوب حذفه', event.threadID, event.messageID)}
   const listFile = readdirSync(__dirname + '/cache').filter(item => item.endsWith("." + args[0]));
  var msg = "";
  for(i in listFile){
    console.log(listFile[i])
    msg += `${listFile[i]}\n`
  }
  console.log(msg)
  return api.sendMessage(`${msg}\n\n الرجاء الضغط على Y لحذف الملفات التالية`, event.threadID, (error, info) =>{
    if(error) console.log(error)
    global.client.handleReply.push({
        step: 0,
        name: this.config.name,
        file_en: args[0],
        messageID: info.messageID,
        author: event.senderID,
      }),
     event.messageID
  })
}
module.exports.handleReply = async function ({ event, api, Currencies, handleReply, Threads }) {
  if(handleReply.author !== event.senderID) return
  if(event.body == "Y"){
    const { writeFileSync, readdirSync, existsSync, unlinkSync } = require('fs-extra');
   const listFile = readdirSync(__dirname + '/cache').filter(item => item.endsWith("." + handleReply.file_en));
  for(i in listFile){
    unlinkSync(__dirname + '/cache/' + listFile[i])
  }
  return  api.sendMessage(`Deleted ${listFile.length} file with the extension ${handleReply.file_en}`,event.threadID)
  }
  else {
    api.sendMessage(`fuck off`,event.threadID)
  }
}
