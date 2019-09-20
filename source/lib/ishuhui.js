const {getContent, listNotSupported, downloadUrls} = require('../util');

async function download(url, flags) {
	const match = /\/detail\/(\d+)/g.exec(url);
	if (!match) {
		throw new Error('Invalid site URL ' + url);
	}
	const id = match[1];
	const json = await getContent(`https://prod-api.ishuhui.com/comics/detail?id=${id}`, {
		json: true,
	});
	const {animeName, title, numberStart, numberEnd, contentImg} = json.data;
	const images = contentImg
		// 去掉最后一页广告
		.filter(({name}) => /^[0-9]/.test(name))
		.map(({url}) => url);

	await downloadUrls({images, title, flags, site: 'ishuhui'});
}

exports.download = download;
exports.downloadList = listNotSupported('ishuhui');
