module.exports = { //cant reply to messages with slash commands, thus this is a non-slash command
    name: "refreshFrom",
    description: "[Only past 100 messages] Refreshes all messages from the message you replied to -> current message",
     async execute(msg) {

        var { msgHandler } = require("../index.js");
        temp = await msg.fetchReference();
        repliedMessageId = temp.id;

        console.log(`[REFRESH FROM]: {${msg.author.username}}`);
        await msg.channel.messages.fetch({limit: 100}).then(messages => {
            try {

                const repliedMessage = messages.get(repliedMessageId);
                if (!repliedMessage) return msg.reply('Replied message not found.');

                const messagesAfterReplied = messages.filter(message => message.createdTimestamp >= repliedMessage.createdTimestamp);
                console.log(`[REFRESH FROM]: (Amt: ${messagesAfterReplied.size})`);
                
                messagesAfterReplied.forEach(element => {
                    if (element.content.includes("!ref")) {
                        return;
                    }

                    msgHandler(element);
                });

            } catch(error) {
                console.error(error);
                console.log(`[REFRESH FROM] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
            };
        });
    }, 
}