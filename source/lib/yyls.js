const cheerio = require('cheerio');
const got = require('got');
const ow = require('ow');

module.exports = async input => {
    ow(input, ow.array.minLength(1));
    const [id] = input;

    const response = await got(`http://8comic.se/${id}/`);
    const $ = cheerio.load(response.body);

    // 默认标题是 漫画名 - 第几话 => 漫画名/第几话
    const title = $('h1.entry-title')
        .text()
        .replace(/\s/g, '')
        .replace('–', '/');
    let length = $('#pull > option')
        .last()
        .text();
    // 选页option拿最后一页
    length = parseInt(length.match(/[0-9]{1,}/g));

    // 图片规则是 http://pic.8comic.se/wp-content/uploads/.../{000}.jpg 可能会有 png 或其它类型吧
    const firstImgUrl = $('#caonima').attr('src');
    const [_, imgUrl, __, ext] = /(.*\/)([0-9]{1,}\.(jpg|jpeg|png))/g.exec(
        firstImgUrl
    );

    const images = [];
    for (let index = 1; index <= length; index++) {
        images.push(`${imgUrl}/${index.toString().padStart(3, '0')}.${ext}`);
    }

    return {
        title,
        images
    };
};
