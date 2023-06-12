const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: "tiktok",
    description: "[DISABLED, NOT WORKING] Provides an embedded video of a tiktok link",
    async execute(msg) {
        try{
            //console.log("Tiktok detected: " + link)
            console.log(`[TIKTOK]: {${msg.author.username}}`);
            var url = msg.content.match(/\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/);
            if (url) {
                let waitMsg = msg.reply("Attempting to fetch tiktok...")
                try {
                    await axios.get(url, {
                        headers: { "Accept-Encoding": "gzip,deflate,compress" }
                    }).then(async req => {
                        const $ = cheerio.load(req.data); //JSON.parse($('script#SIGI_STATE').text()).ItemList.video.preloadList[0].url
                        console.log(JSON.parse($('script#SIGI_STATE').text()).ItemList);
                        (await waitMsg).edit({
                            content: null, files: [{
                            attachment: JSON.parse($('script#SIGI_STATE').text()).ItemList.video.preloadList[0].url,
                            name: 'video.mp4'
                            }]
                        })
                    })
                    console.log("[TIKTOK] Completed");
                } catch (error) {
                    (await waitMsg).edit({ content: "[ERROR]: Contact <@708324794759774230> for assistance"})
                    console.error(error)
                }
            
            }

            /* var link = msg.content.split(" ").find(s => s.match(/\bhttps?:\/\/(?:m|www|vm)\.tiktok\.com\/\S*?\b(?:(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+)|(?=\w{7})(\w*?[A-Z\d]\w*)(?=\s|\/$))\b/))
        if (link) {
            c
            let infoMsg = msg.reply("Attempting to fetch tiktok...")
            try {
                console.log(link)
                await axios.get(link, {
                    headers: { "Accept-Encoding": "gzip,deflate,compress" }
                }).then(async req => {
                    const $ = cheerio.load(req.data); //JSON.parse($('script#SIGI_STATE').text()).ItemList.video.preloadList[0].url
                    (await infoMsg).edit({
                        content: null, files: [{
                            attachment: JSON.parse($('script#SIGI_STATE').text()).ItemList.video.preloadList[0].url,
                            name: 'video.mp4'
                        }]
                    })
                })
            } catch (error) {
                (await infoMsg).edit({ content: "Something fucking broke >.>\nError: " + error.response.status })
                console.log(error)
            }
        } */
            
        } catch (error) {
            console.error(error);
            console.log(`[INSTAGRAM] !!ERROR!! \n [${msg.author.username}]: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        }
    },
}