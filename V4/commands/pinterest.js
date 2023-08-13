module.exports = {
    name: "pinterest",
    description: "Provides an embedded image of an pinterest link. Triggers automatically.",
    execute(msg) {
        try{
            const cheerio = this.cheerio; // Access the cheerio dependency
            const axios = this.axios; // Access the axios dependency
            
            console.log(`[PINTEREST]: {${msg.author.username}}`);
            var url = msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)[0];

             axios.get(url)
                .then( async req=>{
                    const $ = cheerio.load(req.data);
                    msg.reply($("meta[property='og:image']").attr("content") || "No Image Found!");
                    console.log("[PINTEREST] Completed");
                })
                .catch( err=>{
                    console.error(err);
                });
        
        } catch (error) {
            console.error(error);
            console.log(`[PINTEREST] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        }
    },
}