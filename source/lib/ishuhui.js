const got = require('got');

module.exports = async input => {
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
    const images = contentImg.map(img => ({url: img.url, name: img.name}));

    return {
        title: `${animeName}/${
            numberStart === numberEnd
                ? numberStart
                : numberStart + '-' + numberEnd
        } ${title}`,
        images
    };
};
