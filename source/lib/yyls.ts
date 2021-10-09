import {Manga, MangaParser} from '../types';

export class Parser implements MangaParser {
	async parse($: cheerio.Root): Promise<Manga> {
		// 默认标题是 漫画名 - 第几话 => 漫画名/第几话
		const title = $('h1.entry-title')
			.text()
			.replace(/\s/g, '')
			.replace('–', '/');
		let length: string | number = $('#pull > option')
			.last()
			.text();
		// 选页option拿最后一页
		length = parseInt(length.match(/[0-9]{1,}/g)?.shift() ?? '0');

		// 图片规则是 http://pic.8comic.se/wp-content/uploads/.../{000}.jpg 可能会有 png 或其它类型吧
		const firstImgUrl = $('#caonima').attr('src') ?? '';
		const [, imgUrl, , ext] = /(.*\/)([0-9]{1,}\.(jpg|jpeg|png))/g.exec(firstImgUrl) ?? [];

		const images = [];
		for (let index = 1; index <= length; index++) {
			images.push(`${imgUrl}/${index.toString().padStart(3, '0')}.${ext}`);
		}

		return {images, title, site: 'YYLS'};
	}
}
