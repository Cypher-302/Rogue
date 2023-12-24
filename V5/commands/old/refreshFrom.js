const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshfrom')
        .setDescription('[Only past 100 messages] Refreshes all messages from the message you replied to -> current message'),
     async execute(interaction) {

        var { msgHandler } = require("../../index.js");
        console.log(await interaction.type)
        repliedMsg = await interaction.fetchReply();
        repliedMsgId = repliedMsg.id;

        await interaction.channel.messages.fetch({limit: 100}).then(messages => {
            try {

                const repliedMessage = messages.get(repliedMsgId);
                if (!repliedMessage) return msg.reply('Replied message not found.');

                const messagesAfterReplied = messages.filter(message => message.createdTimestamp >= repliedMessage.createdTimestamp);
                console.log(`[REFRESH FROM]: {${interaction.user.username}} (Amt: ${messagesAfterReplied.size})`);
                
                messagesAfterReplied.forEach(element => {
                    msgHandler(element);
                });

            } catch(error) {
                console.error(error);
                console.log(`[REFRESH FROM] !!ERROR!! \n {${interaction.user.username}}: ${interaction.content} \n ^ ${interaciton.guild.name} -> ${interaction.channel.name} ^ \n ${interaction.url}`);
            };
        });
    }, 
}