const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pinterest',
    description: 'Provides an embedded image of an pinterest link. Triggers automatically.',
    execute(msg) {
        try {
            console.log(`[PINTEREST]: {${msg.author.username}}`);


            var inputUrl = msg.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)[0];

            (async () => {
                let waitEmbed = new EmbedBuilder().setTitle('Processing...');
                var waitMsg = await msg.reply({ embeds: [waitEmbed] });

                let startTime = Date.now();

                let id = await getPinterestId(inputUrl)
                let data = await getPinResource(id)

                var { title, link: web_link, dominant_color, story_pin_data, images, created_at } = data;
                var author_name = data.native_creator?.full_name;
                var author_icon = data.native_creator?.image_medium_url;
                var arrVideos = [];
                var arrImages = [];
                /* story_pin_data.pages.forEach(element => {
                    console.log(element);
                }); */
                var arrPageVideoLinks = [];

                if (story_pin_data) {
                    story_pin_data.pages.forEach(page => {
                        for (const block of page.blocks) {
                            if (block.video) {
                                arrPageVideoLinks = Object.values(block?.video?.video_list);
                                
                                for (let i = 0; i < arrPageVideoLinks; i++) {
                                    if (arrPageVideoLinks[i]?.url.includes('.mp4')) {
                                        console.log(arrPageVideoLinks[i])
                                        arrVideos.push(arrPageVideoLinks[i].url);
                                        return;    
                                    } else console.log(arrPageVideoLinks[i])
                                }
                                console.log(arrPageVideoLinks[1].url.includes('.mp4'))
                                
                                //arrVideos.push(Object.values(block?.video?.video_list)[0]?.url)

                            } else if (block.image) {
                                arrImages.push(block?.image?.images?.originals?.url)
                            }
                        };
                    });
                };

                //console.log(story_pin_data?.pages?.map?.(e => e.blocks))
                //console.log(arrVideos)

                if (images.orig.url) {
                    arrImages.push(images.orig.url);
                }
                
                var video = data.videos?.video_list.V_720P.url;
                if (video) {
                    arrVideos.push(video);
                }

                let vidSuffix = (arrVideos.length > 1) ? 's' : '';
                let imgSuffix = (arrImages.length > 1) ? 's' : '';

                //console.log(`--Video${vidSuffix}: ${arrVideos.length}, Image${imgSuffix}: ${arrImages.length}`)

                var is_video = false;

                if (arrVideos.length > 0) {
                    is_video = true;
                }

                let msgDate = messageDateFormatter();

                const pinterestEmbed = new EmbedBuilder()
                    .setColor(dominant_color || 0x0099FF)
                    .setTitle(title || 'Pinterest')
                    .setURL(inputUrl)
                    .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() }) //, url: 'https://discord.js.org' 
                    .setDescription(msgDate)
                    //.addFields({ name: '\u200B', value: '\u200B' }) --blank line
                    .setTimestamp(new Date(created_at) ?? new Date(now)) // post publish date
                    .setFooter({ text: author_name ?? 'Unnamed Author', iconURL: author_icon });
                if (web_link) {
                    let web_name = await axios.get(web_link, {
                        signal: AbortSignal.timeout(15000), // Aborts request after 15 seconds
                        validateStatus: function (status) {
                            return status != 404; // Resolve only if the HTTP status code is not 404
                        }
                    }).catch(function (error) {
                        console.log(error.toJSON());
                    });
                    pinterestEmbed.addFields({ name: 'Website of origin:', value: `[${web_name?.request?.socket?._host || 'Link'}](${web_link})`, inline: true })
                }
                if (arrImages.length > 0) {
                      /* if (arrImages.length > 1) {
                        pinterestEmbed.setImage(arrImages.shift());
                        msg.channel.send(arrImages.join(' '));
                    } else  */pinterestEmbed.setImage(arrImages[0]); //cant embed videos  (video ?? )
                } else if (images['60x60'].url) {
                    pinterestEmbed.setThumbnail(images['60x60'].url);
                }

                //msg.delete(); --this is fine when the bot is always online, current version (sometimes on, sometimes off) makes this a bit detrimental to user xp

                waitMsg.edit({ embeds: [pinterestEmbed] }); //--msg.channel.send

                if (is_video) {
                    arrVideos.forEach(video_url => {
                        msg.channel.send(`[720p Video](${video_url})`); //-------------------------grab thumbnail for videos without images, so the embed doesn't look weird
                    });
                }

                //console.log('[PINTEREST] Completed');

                let endTime = Date.now();
                let timeDiff = (endTime - startTime) / 1000;
                console.log(`[PINTEREST] Completed (${timeDiff.toFixed(2)}s)`);
            })()


            async function getPinterestId(url) {
                const req = await axios.get(url, {
                    signal: AbortSignal.timeout(15000), // Aborts request after 15 seconds
                }).catch(function (error) {
                    console.log(error.toJSON()); //still keeps running and will error later, figure out way to stop here if timeout
                });
                var url = new URL(req.request.res.responseUrl);
                var id = url.pathname.split('/')[2];
                return id
            }

            async function getPinResource(id) {
                let data = (await axios.get('https://za.pinterest.com/resource/PinResource/get/', {
                    params: {
                        'data': JSON.stringify({ 'options': { 'id': id, 'field_set_key': 'auth_web_main_pin', 'noCache': true, 'fetch_visual_search_objects': true }, 'context': {} })
                    }
                })).data.resource_response.data
                return data
            }

            function messageDateFormatter() {
                let currentDate = new Date();
                let currentDayOfMonth = currentDate.getDate();
                let msgDate = msg.createdAt.getDate();

                switch (msgDate) {
                    case currentDayOfMonth:
                        var formattedDate = 'Today at ';
                        break;
                    case (currentDayOfMonth - 1):
                        var formattedDate = 'Yesterday at ';
                        break;
                    default:
                        var formattedDate = currentDate.toDateString() + ' at '; // eg: Mon Dec 18 2023 at
                }
                console.log(msg.createdAt.toTimeString())
                let outputDate = formattedDate + msg.createdAt.toTimeString();
                return outputDate.replace(/(:[0-9]+ GMT\+[0-9]+ )+/, ' '); // the regex gets rid of the seconds & extra GMT info from outputted string
            }

        } catch (error) {
            console.error(error);
            console.log(`[PINTEREST] !!ERROR!! \n {${msg.author.username}}: ${msg.content} \n ^ ${msg.guild.name} -> ${msg.channel.name} ^ \n ${msg.url}`);
        }
    },
}