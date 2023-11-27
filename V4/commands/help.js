module.exports = {
    name: "help",
    description: "Provides a help message listing bot commands and functions",
    execute(msg) {
        try{ 

            const { client } = require("../index.js");
            const { EmbedBuilder } = require('discord.js');

            //console.log(client.commands);
            //console.log(client.commands[1].name);
            //client.commands.get(msgCommand)
            /* for (const [key, value] of client.commands) {
                console.log(`${value.name} = ${value.description}`);
            } */

            const commandsEmbed = new EmbedBuilder()
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

            for (const [key, value] of client.commands) {
                commandsEmbed.addFields({ name: '!'+value.name, value: value.description});
            }
            
            
            msg.reply({ embeds: [commandsEmbed] });
            console.log(`[HELP REQUEST] {${msg.author.username}}`);
        } catch(error) {
            console.error(error);
            console.log(`[HELP] -  !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        };
    }, 
}