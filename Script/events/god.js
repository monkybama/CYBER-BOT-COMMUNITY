module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Record bot activity notifications!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
    var formReport =  "=== 🪙✨𝑽𝑬𝑹𝑮𝑰𝑳 | 𝑮𝑶𝑳𝑫 𝐁𝐎𝐓 |🪙✨ - Notification ===" +
                        "\n\n» Thread mang ID: " + event.threadID +
                        "\n» Action: {task}" +
                        "\n» Action created by userID: " + event.author +
                        "\n» " + Date.now() +" «",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "الاسم غير موجود",
                    newName = event.logMessageData.name || "الاسم غير موجود";
            task = "User changes group name from: '" + oldName + "' to '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "أضاف المستخدم البوت إلى مجموعة جديدة!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "قام المستخدم بطرد البوت من المجموعة!"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);
  var god = "61562119538523";

    return api.sendMessage(formReport, god, (error, info) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
}
