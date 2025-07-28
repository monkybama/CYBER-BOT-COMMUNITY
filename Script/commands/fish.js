module.exports.config = {
	name: "سمك",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "Sell own capital",
	commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1000000
    }
};

module.exports.languages = {
    
        
    "en": {
        "cooldown": "لقد عملت اليوم، لتجنب الإرهاق يرجى العودة بعد: %1 دقيقة(s) %2 ثانية(s).",
        "rewarded": "لقد حصلت على سمكة كبيرة مرة أخرى اليوم، وتم بيعها مقابل: %2$",
        "job1": "صيد-سمك",
    }
}

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 20000),
            seconds = ((time % 20000) / 500).toFixed(0);
        
		return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    }
    else {
        const job = [
            getText("Fishing"),
        ];
        const amount = Math.floor(Math.random() * 1000000);
        return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, async () => {
            await Currencies.increaseMoney(senderID, parseInt(amount));
            data.workTime = Date.now();
            await Currencies.setData(event.senderID, { data });
            return;
        }, messageID);
    }     
}
