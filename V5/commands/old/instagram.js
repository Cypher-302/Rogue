const axios = require('axios');

module.exports = {
    name: "instagram",
    description: "Provides an embedded video of an instagram link",
    execute(msg) {
        try {
            console.log(`[INSTAGRAM]: {${msg.author.username}}`);
            var url = msg.content.match(/((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/)[2];
            let waitMsg = msg.reply("Attempting to fetch Reel...")
            axios.get(`https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e64&variables={"shortcode":"${url}"}`).then(async req => {
                (await waitMsg).edit({
                    content: null, files: [{
                        attachment: req.data.data["shortcode_media"].video_url,
                        name: 'video.mp4'
                    }]
                })
            })
            console.log("[INSTAGRAM] Completed");

        } catch (error) {
            console.error(error);
            console.log(`[INSTAGRAM] !!ERROR!! \n [${msg.author.username}]: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        }
    },
}