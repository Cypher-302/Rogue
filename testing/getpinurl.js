const axios = require("axios");

(async () => {
    let input = 'https://pin.it/33hKLcI';
    let bigUrl = await getBigUrl(input);
    console.log(bigUrl);
})()

async function getBigUrl(shortUrl) {
    const req = await axios.get(shortUrl)
    var url = req.request.res.responseUrl.replace(/.{6}$/,'')
    return url
}