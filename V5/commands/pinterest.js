const cheerio = require('cheerio');
const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pinterest")
    .setDescription("Provides an embedded image of the pinterest link"),
    execute(msg) {
        console.log(`[PINTEREST] ${msg.author.username} req: ${msg.content}`);
        var url = msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)[0];
        axios.get(url).then(req=>{
            const $ = cheerio.load(req.data);
            console.log("[PINTEREST] Success");
            msg.reply($("meta[property='og:image']").attr("content") || "No Image Found!");
        })
},
}