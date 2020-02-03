import cheerio = require('cheerio');
import {getContent, downloadUrls} from '../util';
import {MangaOptions} from '../types';

export async function download(url: string, flags: MangaOptions) {
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
		.toArray()
		.map(ele => $(ele).data('src'))
		.filter(url => url.indexOf('Credit_LHScan') === -1);

	await downloadUrls({images, title, flags, site: 'lhscan'});
}
