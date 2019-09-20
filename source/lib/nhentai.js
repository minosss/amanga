const cheerio = require('cheerio');
const {getContent, listNotSupported, downloadUrls} = require('../util');

async function download(url, flags) {
	const html = await getContent(url);
	const $ = cheerio.load(html);

	const title = $('#info > h1').text();
	const images = $('#thumbnail-container img.lazyload')
		.map((_, ele) =>
			$(ele)
				.data('src')
				// 1t.jpg 是缩略图
				.replace(/([0-9]{1,})t/g, '$1')
				// 图片路径 https://i.nhentai.net/galleries/...
				.replace(/\/\/t/g, '//i')
		)
		.toArray();

	await downloadUrls({images, title, flags, site: 'nhentai'});
}

exports.download = download;
exports.downloadList = listNotSupported('nhentai');
