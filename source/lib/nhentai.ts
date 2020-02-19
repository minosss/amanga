import cheerio = require('cheerio');
import {getContent} from '../util';
import {Manga} from '../types';

const SITE = 'nhentai';

export async function download(url: string): Promise<Manga> {
	const html = await getContent(url);
	const $ = cheerio.load(html);

	const title = $('#info > h1').text();
	const images = $('#thumbnail-container img.lazyload')
		.toArray()
		.map(ele =>
			$(ele)
				.data('src')
				// 1t.jpg 是缩略图
				?.replace(/([0-9]{1,})t/g, '$1')
				// 图片路径 https://i.nhentai.net/galleries/...
				.replace(/\/\/t/g, '//i')
		)
		.filter(imgUrl => !!imgUrl);

	return {images, title, site: SITE};
}
