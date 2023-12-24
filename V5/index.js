const path = require('node:path');
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { token } = require('../config.json');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); //, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
            if (!filePath.includes('non-slash')) {
			    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
		}
	}
}

client.nonSlashCommands = new Collection();
const nonSlashCommandsPath = path.join(__dirname, 'commands/non-slash');
const nonSlashCommandsFiles = fs.readdirSync(nonSlashCommandsPath).filter(file => file.endsWith('.js'));

for (const file of nonSlashCommandsFiles) {
    const filePath = path.join(nonSlashCommandsPath, file);
    const nonSlashCommand = require(filePath);

    client.nonSlashCommands.set(nonSlashCommand.name, nonSlashCommand);
}

client.once(Events.ClientReady, () => {
    console.log('Ready!');
    //client.channels.cache.find(channel => channel.id === '950067867808858114').send(`Bot is online! [RUNNING ON: Cypher's PC]`) //random-stuff
});


client.on(Events.InteractionCreate, interactionHandler);

async function interactionHandler(interaction) {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found!`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}



client.on(Events.MessageCreate, msgHandler);

async function msgHandler(msg) {
    if (msg.author.bot) {
        return
    }
    var msgCommand;

    if (msg.content.includes('https://pin.it/') || msg.content.includes('pinterest.com/pin/')) {
        msgCommand = 'pinterest';
    } else if (msg.content.includes('instagram.com/reel/')) {
        //msgCommand = 'instagram'
    } else if (msg.content.includes('tiktok.com/')) {
        //msgCommand = 'tiktok'; result.url
    }

    const command = client.nonSlashCommands.get(msgCommand);

    if (!command) return;

    try {
        await command.execute(msg);
    } catch (error) {
        console.error(error);
        console.log(`Error: ! found, invalid command. \n ${msg.author.username}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        await msg.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

}

function isAuth(msg) {
    //                          Cypher                                  James
    if (msg.author.id == '708324794759774230' || msg.author.id == '590432724112637953' || msg.guildId == '934893639405043753') {
        return true;
    } else return false;
}
module.exports = {
    msgHandler,
    isAuth
}

client.login(token);