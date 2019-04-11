const got = require('got');
const ow = require('ow');
const cheerio = require('cheerio');

module.exports = async input => {
    const [id] = input;
    // ow
    const response = await got(`https://nhentai.net/g/${id}/`);
    const $ = cheerio.load(response.body);

    const title = $('#info > h1').text();
    const images = $('#thumbnail-container img.lazyload')
        .map((_, ele) => $(ele).data('src'))
        .toArray();

    return {
        title,
        images
    };
};
