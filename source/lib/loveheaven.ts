import cheerio = require('cheerio');
import {getContent} from '../util';
import {Manga} from '../types';

const SITE = 'loveheaven';

export async function parse(url: string): Promise<Manga> {
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

	return {images, title, site: SITE};
}
