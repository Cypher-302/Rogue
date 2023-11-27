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
                

                let data = await getPinResource(id)

                var { title, link, dominant_color, story_pin_data, images, created_at } = data // renaming- images: arrImages
                var arrVideos = [];
                var arrImages = [];
                //console.log(story_pin_data.pages, story_pin_data.pages[0])
                if (story_pin_data) {
                    for (const block of story_pin_data.pages[0].blocks) {
                        if (block.video) {
                            arrVideos.push(Object.values(block?.video?.video_list)[0]?.url)
                        } else if (block.image) {
                            arrImages.push(block?.image?.images?.originals?.url)
                        }
                        //console.log(block)
                    }
                }
                //console.log('appear!')
                console.log(arrVideos, arrImages)

                //var storyImages = story_pin_data?.pages?.map?.(e => e.blocks[0]?.image?.images?.originals?.url) || [images.orig.url] || []
                var web_link = link;

                var author_name = data.native_creator?.full_name;
                var author_icon = data.native_creator?.image_medium_url;
                //console.log(story_pin_data?.pages?.map?.(e => e.blocks))
                if (images.orig.url) {
                    arrImages.push(images.orig.url)
                }
                var is_video = false

                var video = data.videos?.video_list.V_720P.url;
                if (video) {
                    arrVideos.push(video);
                }
                console.log(arrVideos.length, arrImages.length)

                if (arrVideos.length > 0) {
                    is_video = true
                }
                

                const commandsEmbed = new EmbedBuilder()
                    .setColor(dominant_color || 0x0099FF)
                    .setTitle(title || 'Pinterest')
                    .setURL(web_link)
                    .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() }) //, url: 'https://discord.js.org' 
                    //.setDescription('Some description here')
                    //.setThumbnail('https://i.imgur.com/AfFp7pu.png') // use image if video present
                    /* .addFields(
                        
                        { name: 'Regular field title', value: 'Some value here' },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                        { name: 'Inline field title', value: 'Some value here', inline: true },
                    )*/
                    //.addFields({ name: 'Inline field title', value: video }) 

                    .setTimestamp(new Date(created_at)) // post publish date
                    .setFooter({ text: author_name ?? 'Unnamed Author', iconURL: author_icon }); //post author? should that be under setAuthor?
                if (arrImages.length > 0) {
                     /* if (arrImages.length > 1) {
                        commandsEmbed.setImage(shift(arrImages));
                        arrImages.forEach(image_url => {
                            msg.channel.send(image_url);
                        });
                    } else  */commandsEmbed.setImage(arrImages.join("\n")) //cant embed videos  (video ?? )
                }

                msg.reply({ embeds: [commandsEmbed] }); //await waitMsg.edit
                if (is_video) {
                    arrVideos.forEach(video_url => {
                        msg.channel.send(`[720p Video](${video_url})`); //-------------------------grab thumbnail for videos without images, so the embed doesn't look weird
                    });
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