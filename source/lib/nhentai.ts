import cheerio = require('cheerio');
import {getContent, downloadUrls} from '../util';
import {MangaOptions} from '../types';

export async function download(url: string, flags: MangaOptions) {
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

	await downloadUrls({images, title, flags, site: 'nhentai'});
}
