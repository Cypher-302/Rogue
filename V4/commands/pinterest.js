const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "pinterest",
    description: "Provides an embedded image of an pinterest link. Triggers automatically.",
    execute(msg) {
        try {

            console.log(`[PINTEREST]: {${msg.author.username}}`);
            //var waitMsg = msg.reply('Processing...'); not work

            var inputUrl = msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)[0];

            (async () => {

                let id = await getPinterestId(inputUrl)
                console.log(`Pinterest Id: ${id}`)

                let data = await getPinResource(id)

                var { title, link, dominant_color, story_pin_data, images } = data
                var storyImages = story_pin_data?.pages?.map?.(e => e.blocks[0].image.images.originals.url) || [images.orig.url] || []
                var web_link = link;

                var is_video = false
                var video = data.videos?.video_list.V_720P.url; // could use nullish coalescance (X ?? Y) here to combine video and storyImages into media,
                if (video != null) {                            //  implement when doing / commands
                    is_video = true
                }

                /* console.log(`Title: ${title}`)
                console.log(`Website Link: ${web_link}`)
                console.log(`Dominant Color: ${dominant_color}`)
                console.log(`Is Video: ${is_video}`)
                console.log(`Video: ${video}`)
                console.log(`Images: ${storyImages.join("\n")}`) */

                const commandsEmbed = new EmbedBuilder()
                .setColor(dominant_color || 0x0099FF)
                .setTitle(title || 'Pinterest')
                .setURL(web_link)
                //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                //.setDescription('Some description here')
                //.setThumbnail('https://i.imgur.com/AfFp7pu.png') // use image if video present
                /* .addFields(
                    
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )*/
                //.addFields({ name: 'Inline field title', value: video }) 
                .setImage(storyImages.join("\n") ) //cant embed videos  (video ?? )
                //.setTimestamp() // post publish date
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' }); //post author? should that be under setAuthor?
                msg.reply({ embeds: [commandsEmbed] }); //await waitMsg.edit
                if (is_video) {
                    msg.channel.send(`[720p Video](${video})`);
                }
                console.log("[PINTEREST] Completed");
            })()

            async function getPinterestId(url) {
                const req = await axios.get(url)
                var url = new URL(req.request.res.responseUrl)
                var id = url.pathname.split("/")[2]
                return id
            }

            async function getPinResource(id) {
                let data = (await axios.get('https://za.pinterest.com/resource/PinResource/get/', {
                    params: {
                        'data': JSON.stringify({ "options": { "id": id, "field_set_key": "auth_web_main_pin", "noCache": true, "fetch_visual_search_objects": true }, "context": {} })
                    }
                })).data.resource_response.data
                return data
            }

        } catch (error) {
            console.error(error);
            console.log(`[PINTEREST] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        }
    },
}