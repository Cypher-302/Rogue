const axios = require("axios");
const inputUrl = 'https://za.pinterest.com/pin/79587118407452809/feedback/?invite_code=b0ee5c427a8049b7b6fe715f4c97d536&sender_id=819444232107397335';//  https://pin.it/ynRsVwa     https://pin.it/5JAAi0h          https://pin.it/3iGEvyP



(async () => {

    let id = await getPinterestId(inputUrl)
    console.log(`Pinterest Id: ${id}`)

    let data = await getPinResource(id)

    var { title, link, dominant_color, story_pin_data, images } = data
    var storyImages = story_pin_data?.pages?.map?.(e => e.blocks[0].image.images.originals.url) || [images.orig.url] || []
    web_link = link;

    var is_video = false
    var video = data.videos?.video_list.V_720P.url; // could use nullish coalescance (X ?? Y) here to combine video and storyImages into media,
    if (video != null) {                            //  implement when doing / commands
        is_video = true
    }

    console.log(`Title: ${title}`)
    console.log(`Website Link: ${web_link}`)
    console.log(`Dominant Color: ${dominant_color}`)
    console.log(`Is Video: ${is_video}`)
    console.log(`Video: ${video}`)
    console.log(`Images: ${storyImages.join("\n")}`)
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