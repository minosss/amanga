const got = require('got');
const ow = require('ow');

module.exports = async input => {
    ow(input, ow.array.minLength(1));
    const [id] = input;

    const data = await got(
        `https://prod-api.ishuhui.com/comics/detail?id=${id}`,
        {json: true}
    );

    const {
        animeName,
        title,
        numberStart,
        numberEnd,
        contentImg
    } = data.body.data;
    const images = contentImg
        // 去掉最后一页广告
        .filter(({name}) => /^[0-9]/.test(name))
        .map(({url}) => url);

    return {
        title: `${animeName}/${
            numberStart === numberEnd
                ? numberStart
                : numberStart + '-' + numberEnd
        } ${title}`,
        images
    };
};
