const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription(`Re-runs the bot's code for this message.`),
    async execute(interaction) {
        try{
            var { msgHandler } = require("../../index.js");
            interaction = await interaction.fetchReference();
            console.log(`[REFRESH] - (REPLY): {${msg.author.username}}`);
            msgHandler(msg);

        } catch(error) {
            console.error(error);
            console.log(`[REFRESH] !!ERROR!! \n {${interaction.user.username}}: ${interaction.content} \n ^ ${interaction.guild.name} -> ${interaction.channel.name} ^ \n ${interaction.url}`);
        };
    },
}