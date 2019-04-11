const got = require('got');
const ow = require('ow');
const cheerio = require('cheerio');
const {decompressFromBase64} = require('lz-string');

function decode(p, a, c, k, e, d) {
    e = function(c) {
        return (
            (c < a ? '' : e(parseInt(c / a))) +
            ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
        );
    };

    if (true) {
        while (c--) d[e(c)] = k[c] || e(c);
        k = [
            function(e) {
                return d[e];
            }
        ];
        e = function() {
            return '\\w+';
        };
        c = 1;
    }

    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);

    return p;
}

module.exports = async input => {
    ow(input, ow.array.minLength(2));
    const [id, cid] = input;
    const pageUrl = `https://www.manhuagui.com/comic/${id}/${cid}.html`;
    const response = await got(pageUrl);
    const $ = cheerio.load(response.body);
    const rawData = $('body').html();
    const [
        _,
        propMap,
        from,
        to,
        base64data
    ] = /\}\(\'(.*)\'\,([0-9]{1,})\,([0-9]{1,})\,\'(.*)\'\[\'\\x73\\x70/g.exec(
        rawData
    );

    let data = decode(
        propMap,
        from,
        to,
        decompressFromBase64(base64data).split('|'),
        0,
        {}
    );

    // 解密完后去掉头和尾
    data = data.replace('SMH.imgData(', '');
    data = data.replace(').preInit();', '');
    data = JSON.parse(`${data}`);

    const title = data.cname;
    // TODO 验证数据
    const images = [];

    // 组成图片链接
    for (const file of data.files) {
        images.push(
            `https://i.hamreus.com${data.path}${file}?cid=${data.cid}&md5=${
                data.sl.md5
            }`
        );
    }

    const options = {
        headers: {
            // 最重要需要设置referer
            referer: pageUrl
        }
    };

    return {
        title,
        images,
        options
    };
};
