var Scraper = require('images-scraper');
const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Replies with image(s) grabbed from google images.')
        .addStringOption(option =>
            option
                .setName('search')
                .setDescription('What you are searching for.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of images requested.')
        ),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });
        try {
            const userInput = interaction.options.get('search').value;
            const amount = interaction.options.get('amount')?.value ?? 1;

            console.log(`[IMAGE] {${interaction.user.username}} (${amount}) : ${userInput}`)

            let results = await google.scrape(userInput, amount);
            let arrResults = Object.values(results);

            arrResults.forEach((result, index) => {
                const commandsEmbed = new EmbedBuilder()
                    .setColor(0x344c65)
                    .setTitle(`${userInput} (${index + 1})`)
                    .setImage(result.url)
                    .setTimestamp()
                    //commandsEmbed.addFields({ name: userInput+' ('+(index+1)+')', value: '<'+result.source+'>'});
                    .setURL(result.source);
                interaction.followUp({ embeds: [commandsEmbed] });
            });

            if (results.length == 0) {
                interaction.reply(`Couldn't find what you are searching for!`);
                console.log(`Failed - Couldn't find image!`);
            } else {
                console.log('Success!');
            }
        } catch (error) {
            console.error(error);
            console.log(`[IMAGE] !!ERROR!! \n {${interaction.user.username}}: ${interaction.content} \n ^ ${interaction.guild.name} -> ${interaction.channel.name} ^ \n ${interaction.url}`);
        };
    },

};