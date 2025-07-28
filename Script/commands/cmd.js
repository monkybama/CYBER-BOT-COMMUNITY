module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "MAHBUB SHAON",
    description: "Manage/Control all bot modules",
    commandCategory: "System",
    usages: "[load/unload/loadAll/unloadAll/info] [name module]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID, api }) {
    const { execSync } = global.nodemodule["child_process"];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { configPath, mainPath } = global.client;
    const logger = require(mainPath + "/utils/log");

    var errorList = [];
    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 2), "utf8");

    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + "/" + nameModule + ".js";
            delete require.cache[require.resolve(dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error("[CMD] - الوحدة ليست منسقة بشكل صحيح!");

            global.client.eventRegistered = global.client.eventRegistered.filter(info => info != command.config.name);

            global.client.commands.set(command.config.name, command);
            logger.loader("Loaded command " + command.config.name + "!");

        } catch (error) {
            errorList.push("- " + nameModule + " reason: " + error);
        }
    }

    if (errorList.length > 0) {
        api.sendMessage("[CMD] » فشلت بعض الوحدات في التحميل: " + errorList.join(", "), threadID, messageID);
    } else {
        api.sendMessage("[CMD] » تم تحميل جميع الوحدات بنجاح: " + moduleList.join(", "), threadID, messageID);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
    unlinkSync(configPath + ".temp");
};

const unloadModule = function ({ moduleList, threadID, messageID, api }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), "utf8");

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Unloaded command ${nameModule}!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
    unlinkSync(configPath + ".temp");

    api.sendMessage(`[CMD] » تم التفريغ بنجاح ${moduleList.length} command(s)`, threadID, messageID);
};

module.exports.run = function ({ event, args, api }) {
    if (!api || !api.sendMessage) {
        console.error("[CMD] ERROR: API object is undefined!");
        return;
    }

    if (event.senderID != "61562119538523") {
        return api.sendMessage("[CMD] » ليس لديك الحق في استخدام هذا الأمر!", event.threadID, event.messageID);
    }

    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.slice(1);

    switch (args[0]) {
        case "احسب": {
            api.sendMessage(`[CMD] - الأوامر المحملة حاليًا: ${global.client.commands.size}`, threadID, messageID);
            break;
        }
        case "حمل": {
            if (moduleList.length == 0) return api.sendMessage("[CMD] » لا يمكن أن يكون اسم الوحدة فارغًا!", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID, api });
        }
        case "الغاء": {
            if (moduleList.length == 0) return api.sendMessage("[CMD] » لا يمكن أن يكون اسم الوحدة فارغًا!", threadID, messageID);
            return unloadModule({ moduleList, threadID, messageID, api });
        }
        case "تحميل-الكل": {
            moduleList = readdirSync(__dirname).filter(file => file.endsWith(".js") && !file.includes("example"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList, threadID, messageID, api });
        }
        case "الغاء-الكل": {
            moduleList = readdirSync(__dirname).filter(file => file.endsWith(".js") && !file.includes("example") && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList, threadID, messageID, api });
        }
        case "معلومات": {
            const command = global.client.commands.get(moduleList.join("") || "");

            if (!command) return api.sendMessage("[CMD] » الوحدة المحددة غير موجودة!", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            return api.sendMessage(
                `====== ${name.toUpperCase()} ======\n` +
                `- Created by: ${credits}\n` +
                `- Version: ${version}\n` +
                `- Required Permission: ${hasPermssion == 0 ? "User" : hasPermssion == 1 ? "Admin" : "Support"}\n` +
                `- Cooldown: ${cooldowns} second(s)\n` +
                `- Dependencies: ${(Object.keys(dependencies || {})).join(", ") || "None"}`,
                threadID, messageID
            );
        }
        default: {
            return api.sendMessage("[CMD] » Invalid command!", threadID, messageID);
        }
    }
};
