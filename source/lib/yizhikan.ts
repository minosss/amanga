import cheerio = require('cheerio');
import {getContent} from '../util';
import {Manga} from '../types';

export async function parse(url: string): Promise<Manga> {
	const html = await getContent(url);
	const $ = cheerio.load(html);

	const name = $('.aBox a[href*="/comic/"]')
		.text()
		.trim();
	const chapter = $('.aItem a.cur')
		.text()
		.trim();

	const images = $('.imgBox img')
		.toArray()
		.map(ele => ele.attribs.src);

	return {
		site: '一直看漫画',
		title: `${name}/${chapter}`,
		images,
	};
}
