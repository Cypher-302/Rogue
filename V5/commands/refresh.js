const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Allows a user to run the bot for messages that were sent during downtime."),
    async execute(msg) {
        var { msgHandler } = require("../index.js");
        console.log(`[REFRESH] ${msg.author} for "amt msgs"`);
        msg = await msg.fetchReference();
        msgHandler(msg);
    },
}