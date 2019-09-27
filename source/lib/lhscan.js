const cheerio = require('cheerio');
const {getContent, downloadUrls} = require('../util');

async function download(url, flags) {
	const html = await getContent(url);
	const $ = cheerio.load(html);
	const breadcrumb = $('ol.breadcrumb > li');
	const chap = breadcrumb
		.last()
		.text()
		.trim();
	const name = breadcrumb
		.last()
		.prev()
		.text()
		.trim();
	const title = `${name}/${chap}`;

	const images = $('img.chapter-img')
		.map((_, ele) => $(ele).data('src'))
		.filter((_, url) => url.indexOf('Credit_LHScan') === -1)
		.toArray();

	await downloadUrls({images, title, flags, site: 'lhscan'});
}

exports.download = download;
