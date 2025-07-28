module.exports.config = {
	name: "بانكاي",
	version: "1.0.1", 
	hasPermssion: 1,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "the person you need to remove from the group by tag",
	commandCategory: "System", 
	usages: "[tag]", 
	cooldowns: 0,
};

module.exports.languages = {
	"vi": {
		"error": "حدث خطأ، يرجى المحاولة مرة أخرى لاحقًا",
		"needPermssion": "ارفع ادمن عشان اديهو في حنانو 🐸 !",
		"missingTag": "اعمل ليهو تاق الكب 🐸"
	},
	"en": {
		"error": "حدث خطأ، يرجى المحاولة مرة أخرى لاحقًا",
		"needPermssion": "ارفع ادمن عشان اديهو في حنانو 🐸 !",
		"missingTag": "اعمل ليهو تاق الكب 🐸"
	}
}

module.exports.run = async function({ api, event, getText, Threads }) {
	var mention = Object.keys(event.mentions);
	try {
		let dataThread = (await Threads.getData(event.threadID)).threadInfo;
		if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);
		if(!mention[0]) return api.sendMessage("You have to tag the need to kick",event.threadID);
		if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
			for (const o in mention) {
				setTimeout(() => {
					api.removeUserFromGroup(mention[o],event.threadID) 
				},3000)
			}
		}
	} catch { return api.sendMessage(getText("error"),event.threadID) }
}
