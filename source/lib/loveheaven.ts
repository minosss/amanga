import {Manga, MangaParser} from '../types';

export class Parser implements MangaParser {
	async parse($: cheerio.Root): Promise<Manga> {
		const breadcrumb = $('ol.breadcrumb > li');
		const chapter = breadcrumb
			.last()
			.text()
			.trim();
		const title = breadcrumb
			.last()
			.prev()
			.text()
			.trim();

		const images = $('img.chapter-img')
			.toArray()
			.map(ele => $(ele).data('src'))
			.filter(url => url.indexOf('Credit_LHScan') === -1);

		return {images, title, chapter, site: 'LoveHeaven'};
	}
}
