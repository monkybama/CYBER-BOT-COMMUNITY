module.exports.config = {
    name: "كنية-تلقائية",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Automatic setname for new members",
    commandCategory: "Box Chat",
    usages: "[add <name> /remove] ",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async function  ({ event, api, args, permssionm, Users })  {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
    switch (args[0]) {
        case "اضافة": {
            if (content.length == 0) return api.sendMessage("The configuration of the new member's name must not be vacated!", threadID, messageID);
            if (thisThread.nameUser.length > 0) return api.sendMessage("يرجى إزالة تكوين الاسم القديم قبل تسمية اسم جديد!!!", threadID, messageID); 
            thisThread.nameUser.push(content);
            const name = (await Users.getData(event.senderID)).name
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`تكوين اسم عضو جديد ناجح\n معاينة: ${content} ${name}`, threadID, messageID);
            break;
        }
        case "rm":
        case "ازالة":
        case "حذف": {
                if (thisThread.nameUser.length == 0) return api.sendMessage("لم تقم مجموعتك بتكوين اسم عضو جديد!!", threadID, messageID);
                thisThread.nameUser = [];
                api.sendMessage(`تم حذف تكوين اسم العضو الجديد بنجاح`, threadID, messageID);
                break;
        }
        default: {
                api.sendMessage(`استخدم: autosetname أضف لتكوين اسم مستعار لعضو جديد\n: إزالة autosetname لإزالة تكوين اللقب للعضو الجديد`, threadID, messageID);
        }
    }
    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
