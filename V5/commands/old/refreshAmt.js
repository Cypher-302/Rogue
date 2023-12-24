const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshamount')
        .setDescription('Fetch the amount of msgs from the command, then refreshes that amt of messages')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of messages prior to refresh.')
        ),
    async execute(interaction) {
        const { msgHandler } = require("../../index.js");
        let msgAmt = interaction.options.get('amount')?.value ?? 1;

        interaction.reply('Consider it done...')
        console.log(`[REFRESH AMT] - (${msgAmt} msgs): [${interaction.user.username}] `);
        await interaction.channel.messages.fetch({ limit: ++msgAmt }).then(messages => {
            messages.reverse();
            try {

                messages.forEach(element => {
                    if (element.content.includes("!ref")) {
                        return;
                    }
                    msgHandler(element);
                });

            } catch (error) {
                console.error(error);
                console.log(`[REFRESH AMT] !!ERROR!! \n {${interaction.user.username}}: ${interaction.content} \n ^ ${interaction.guild.name} -> ${interaction.channel.name} ^ \n ${interaction.url}`);
            };
        });
    },
}