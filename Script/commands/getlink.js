module.exports.config = {
	name: "رابط",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Get the URL Download from Video, Audio is sent from the group",
	commandCategory: "Tool",
	usages: "getLink",
	cooldowns: 5,
};

module.exports.languages = {
	"vi": {
		"تنسيق غير صالح": "❌ يجب أن تكون رسالة الرد الخاصة بك صوتية أو فيديو أو صورة."
	},
	"en": {
		"تنسيق غير صالح": "❌ يجب أن تحتوي رسالتك على صوت أو فيديو أو صورة"
	}
}

module.exports.run = async ({ api, event, getText }) => {
	if (event.type !== "message_reply") return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	if (event.messageReply.attachments.length > 1) return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	return api.sendMessage(event.messageReply.attachments[0].url, event.threadID, event.messageID);
}
