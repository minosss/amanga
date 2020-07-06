import {Manga, MangaParser} from '../types';

export class Parser implements MangaParser {
	async parse($: CheerioStatic): Promise<Manga> {
		const title = $('.aBox a[href*="/comic/"]')
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
			title,
			chapter,
			images,
		};
	}
}
