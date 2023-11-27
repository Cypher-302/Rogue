const path = require("node:path");
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { token } = require("../config.json");


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.name, command);
}

client.once(Events.ClientReady, () => {
    console.log("Ready!");
    //client.channels.cache.find(channel => channel.id === '950067867808858114').send(`Bot is online! [RUNNING ON: Cypher's PC]`) //random-stuff
});



client.on(Events.MessageCreate, msgHandler);

async function msgHandler(msg) {
    if (msg.author.bot) {
        return
    }
    var msgCommand;


    if (msg.content.includes('https://pin.it/') || msg.content.includes('pinterest.com/pin/')) {
        msgCommand = "pinterest";
    } else if (msg.content.includes('instagram.com/reel/')) {
        //---
    } else if (msg.content.includes('tiktok.com/')) {
        //msgCommand = 'tiktok'; result.url
    }

    if (msg.content.startsWith('!img')) {
        msgCommand = 'img';
    } else if (msg.content.startsWith('!')) {
        msgCommand = msg.content.split(' ').shift();
        msgCommand = msgCommand.substring(1);
    }

    const command = client.commands.get(msgCommand);

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
    client,
    isAuth
}

client.login(token);