var Scraper = require('images-scraper');
const google = new Scraper({
    puppeteer: {
      headless: true,
    },
});
const { EmbedBuilder } = require('discord.js');; 


module.exports = {
    name: "img",
    description: "Replies with image(s) depending on user request.\n Format: !img[number] input here \n Example: !img3 discord logo \n Example 2: !img party",
    execute(msg) {

        (async () => {   
 
            let args = msg.content.split(" ");
            const userInput = args.splice(1).join(" ");

            var amt = args[0].replace('!img', '')
            if (!amt){
                amt = 1
            }
            console.log(`[IMAGE REQUEST] {${msg.author.username}} (${amt}) : ${userInput}`)
                    
            var results = await google.scrape(userInput, amt);
                
            var arrResults = Object.values(results)

            arrResults.forEach((result,index) =>{
                const commandsEmbed = new EmbedBuilder()
	            .setColor(0x344c65)
	            .setTitle(`${userInput} (${index+1})`)
                .setImage(result.url) 
	            .setTimestamp()
                //commandsEmbed.addFields({ name: userInput+' ('+(index+1)+')', value: '<'+result.source+'>'});
                .setURL(result.source);
                msg.reply({ embeds: [commandsEmbed] });
            }) 
    
            if (results.length == 0) {
                msg.reply("Couldn't find what you are searching for!")
                console.log("Failed - Couldn't find image!")
            } else {
                console.log('Success!')
            }                                              
                              
        })();
    },
};