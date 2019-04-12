const got = require('got');
const ow = require('ow');
const cheerio = require('cheerio');

module.exports = async input => {
    ow(input, ow.array.minLength(1));
    const [id] = input;
    // ow
    const response = await got(`https://nhentai.net/g/${id}/`);
    const $ = cheerio.load(response.body);

    const title = $('#info > h1').text();
    const images = $('#thumbnail-container img.lazyload')
        .map((_, ele) =>
            $(ele)
                .data('src')
                // 1t.jpg 是缩略图
                .replace(/([0-9]{1,})t/g, '$1')
        )
        .toArray();

    return {
        title,
        images
    };
};
