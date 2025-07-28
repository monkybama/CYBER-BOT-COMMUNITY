module.exports.config = {
	name: "مسابقة",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "",
	commandCategory: "other",
	usages: "[create/details/join/roll/end] [IDGiveAway]",
	cooldowns: 5
};

module.exports.handleReaction = async ({ api, event, Users, handleReaction }) => {
	let data = global.data.GiveAway.get(handleReaction.ID);
	if (data.status == "close" || data.status == "ended") return;
	if (event.reaction == undefined) {
		data.joined.splice(data.joined.indexOf(event.userID), 1);
		global.data.GiveAway.set(handleReaction.ID, data);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.userID)).name;
		else value = (value.nicknames)[event.userID];
		return api.sendMessage(`${value} Đã rời giveaway có ID: #${handleReaction.ID}`, event.userID);
	}
	data.joined.push(event.userID);
	global.data.GiveAway.set(handleReaction.ID, data);
	var value = await api.getThreadInfo(event.threadID);
	if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.userID)).name;
	else value = (value.nicknames)[event.userID];
	return api.sendMessage(`${value} تم الدخول بنجاح في المسابقة ID: #${handleReaction.ID}`, event.userID);
}

module.exports.run = async ({ api, event, args, Users }) => {
	if (!global.data.GiveAway) global.data.GiveAway = new Map();
	if (args[0] == "انشاء") {
		let reward = args.slice(1).join(" ");
		let randomNumber = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.senderID]) value = (await Users.getInfo(event.senderID)).name;
		else value = (value.nicknames)[event.senderID];
		api.sendMessage(
			"====== Give Away ======" +
			"\n تم الإنشاء بواسطة: " + value +
			"\n جائزة: " + reward +
			"\nID يتبرع: #" + randomNumber +
			"\n رد على هذه الرسالة للانضمام إلى المسابقة"
			, event.threadID, (err, info) => {
				let dataGA = {
					"ID": randomNumber,
					"author": value,
					"authorID": event.senderID,
					"messageID": info.messageID,
					"reward": reward,
					"joined": [],
					"status": "open"
				}
				global.data.GiveAway.set(randomNumber, dataGA);
				client.handleReaction.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					ID: randomNumber
				})
			}
		)
	}
	else if (args[0] == "معلومات") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("يجب عليك إدخال معرف GiveAway الخاص بك لعرض معلومات الهدية.!", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("ID الهدية التي أدخلتها غير موجودة.!", event.threadID, event.messageID);
		return api.sendMessage(
			"====== يتبرع ======" +
			"\n تم الإنشاء بواسطة: " + data.author + "(" + data.authorID + ")" +
			"\n جائزة: " + data.reward +
			"\nID يتبرع: #" + data.ID +
			"\n إجمالي عدد الأعضاء الذين شاركوا في المسابقة: " + data.joined.length + " người" +
			"\n حالة: " + data.status
			, event.threadID, data.messageID
		);
	}
	else if (args[0] == "دخول") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("Bạn phải nhập ID GiveAway để có thể tham gia giveaway!", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("ID GiveAway bạn nhập không tồn tại!", event.threadID, event.messageID);
		if (data.joined.includes(event.senderID)) return api.sendMessage("Bạn đã tham gia giveaway này", event.threadID);
		data.joined.push(event.senderID);
		global.data.GiveAway.set(ID, data);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.senderID)).name;
		else value = (value.nicknames)[event.senderID];
		return api.sendMessage(`${value} Đã tham gia thành công giveaway có ID: #${ID}`, event.senderID);
	}
	else if (args[0] == "roll") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("يجب عليك إدخال معرف GiveAway الخاص بك لتتمكن من المشاركة في المسابقة.!", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("ID الهدية التي أدخلتها غير موجودة.!", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("أنت لست المضيف لمعرف GiveaWay هذا!", event.threadID, event.messageID);
		let winner = data.joined[Math.floor(Math.random() * data.joined.length)];
		let userInfo = await Users.getInfo(winner);
		var name = userInfo.name;
		return api.sendMessage({
			body: `Yahoo ${name}, لقد فزت بالهدية ID: #${data.ID}\n يرجى الاتصال: ${data.author}(https://fb.me/${data.authorID})`,
			mentions: [{
				tag: name,
				id: winner
			}]
		}, event.threadID, event.messageID);
	}
	else if (args[0] == "نهاية") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("يجب عليك إدخال معرف GiveAway الخاص بك لتتمكن من المشاركة في المسابقة.!", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("ID الهدية التي أدخلتها غير موجودة.!", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("أنت لست المضيف لمعرف GiveaWay هذا!", event.threadID, event.messageID);
		data["status"] = "ended";
		global.data.GiveAway.set(ID, data);
		api.unsendMessage(data.messageID);
		return api.sendMessage(`GiveAway.com ID: #${data.ID} انتهت بـ ${data.author}`, event.threadID, event.messageID);
	}
	else return global.utils.throwError(this.config.name, event.threadID, event.messageID);
}
