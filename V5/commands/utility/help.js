const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides a help message listing bot commands and functions'),
    async execute(interaction) {
        try{ 

            //console.log(client.commands);
            //console.log(client.commands[1].name);
            //client.commands.get(msgCommand)
            /* for (const [key, value] of client.commands) {
                console.log(`${value.name} = ${value.description}`);
            } */

            const commandsListEmbed = new EmbedBuilder()
	        .setColor(0x0099FF)
	        .setTitle(`Rogue's Commands`)
            //.addFields({ name: client.commands[1].name, value: client.commands[1].description})
	        /* .setURL('https://discord.js.org/')
	        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	        .setDescription('Some description here')
	        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	        .addFields(
                
		        { name: 'Regular field title', value: 'Some value here' },
		        { name: '\u200B', value: '\u200B' },
		        { name: 'Inline field title', value: 'Some value here', inline: true },
		        { name: 'Inline field title', value: 'Some value here', inline: true },
	        )
	        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	        .setImage('https://i.imgur.com/AfFp7pu.png') */
	        .setTimestamp()
	        //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
            
            console.log(interaction.client.commands)

            for (const [key, value] of interaction.client.commands) {
                commandsListEmbed.addFields({ name: '/' + value.data.name, value: value.data.description});
            }
            
            
            await interaction.reply({ embeds: [commandsListEmbed] });
            console.log(`[HELP REQUEST] {${interaction.user.username}}`);
        } catch(error) {
            console.error(error);
            console.log(`[HELP] -  !!ERROR!! \n {${interaction.user.username}}: ${interaction} \n ^ ${interaction.guild.name} -> ${interaction.channel.name} ^ \n ${interaction.url}`);
        };
    }, 
}