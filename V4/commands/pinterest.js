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

                var { title, link: web_link, dominant_color, story_pin_data, images, created_at } = data;
                var author_name = data.native_creator?.full_name;
                var author_icon = data.native_creator?.image_medium_url;
                var arrVideos = [];
                var arrImages = [];
                //story_pin_data.pages.forEach(element => {
                //    console.log(element);
                //});

                if (story_pin_data) {
                    story_pin_data.pages.forEach(page => {
                        for (const block of page.blocks) {
                            if (block.video) {
                                arrVideos.push(Object.values(block?.video?.video_list)[0]?.url)
                            } else if (block.image) {
                                arrImages.push(block?.image?.images?.originals?.url)
                            }
                        };
                    });
                };

                console.log(arrVideos, arrImages)

                //var storyImages = story_pin_data?.pages?.map?.(e => e.blocks[0]?.image?.images?.originals?.url) || [images.orig.url] || []


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

                var currentdate = new Date();
                var formattedDate = '';
                switch (msg.createdAt.getDate()) {
                    case currentdate.getDate():
                        formattedDate = 'Today at ';
                        break;
                    case (currentdate.getDate() - 1):
                        formattedDate = 'Yesterday at ';
                        break;
                    default:
                        formattedDate = currentdate.toDateString() + ' at ';
                }
                
                var outputDate = formattedDate + msg.createdAt.toTimeString();

                const pinterestEmbed = new EmbedBuilder()
                    .setColor(dominant_color || 0x0099FF)
                    .setTitle(title || 'Pinterest')
                    .setURL(inputUrl)
                    .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() }) //, url: 'https://discord.js.org' 
                    .setDescription(outputDate.replace(/( GMT\+[0-9]+ )+/, ' '))
                    /*.setThumbnail('https://i.imgur.com/AfFp7pu.png') // use image if video present
                    .addFields({ name: '\u200B', value: '\u200B' })
                    )*/
                    .setTimestamp(new Date(created_at) ?? new Date(now)) // post publish date
                    .setFooter({ text: author_name ?? 'Unnamed Author', iconURL: author_icon }); //pinterest post author? should that be under setAuthor?
                if (web_link) {
                    pinterestEmbed.addFields({ name: 'Website link', value: `[Guide](${web_link})`, inline: true })
                }
                if (arrImages.length > 0) {
                      if (arrImages.length > 1) {
                        pinterestEmbed.setImage(arrImages.shift());
                        msg.channel.send(arrImages.join(' '));
                    } else pinterestEmbed.setImage(arrImages[0]) //cant embed videos  (video ?? )
                }
                msg.delete();
                msg.channel.send({ embeds: [pinterestEmbed] }); //await waitMsg.edit
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