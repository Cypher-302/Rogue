var Scraper = require('images-scraper');
const { truncate } = require('fs/promises');
const { SlashCommandBuilder } = require('discord.js');
const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

module.exports = {
    data: new SlashCommandBuilder()
    .setName("img")
    .setDescription("Replies with an image depending on user request"),
    execute(msg) {

        (async () => {     
            let args = msg.content.split(" ");
            const userInput = args.splice(1).join(" ");

            var amt = args[0].replace('!img', '');
            if (!amt){
                amt = 1
            }
            console.log(`${msg.author.username} requested ${amt} images of: ${userInput}`);
                    
            var results = await google.scrape(userInput, amt);
                
            var arrResults = Object.values(results);

            arrResults.forEach(result =>{
                msg.reply(`<${result.source}> ${result.url}`)
            }) 
    
            if (results.length == 0) {
                msg.reply("Couldn't find what you are searching for!");
                console.log("Failed - Couldn't find image!");
            } else {
                console.log('Success!');
            }                                              
                              
        })();
    },
};