const path = require("node:path");
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require("../config.json");
const { maxHeaderSize } = require("node:http");
const { builtinModules } = require("node:module");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, () => {
    console.log("Ready!");                                                    
});

client.on(Events.MessageCreate, msgHandler);
async function msgHandler(msg) {
    if (msg.author.id == '918970233962758164') return;
    if (msg.content.includes("https://pin.it/")) {
        pinterest.execute(msg);
    }
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
module.exports = {msgHandler}
        
client.login(token);