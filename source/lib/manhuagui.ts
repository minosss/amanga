import cheerio = require('cheerio');
import {decompressFromBase64} from 'lz-string';
import {MangaOptions} from '../types';
import {getContent, downloadUrls} from '../util';

function decode(p: any, a: any, c: any, k: any, e: any, d: any) {
	e = function(c: any) {
		return (
			(c < a ? '' : e(Math.floor(c / a))) +
			((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
		);
	};

	if (true) {
		while (c--) d[e(c)] = k[c] || e(c);
		k = [
			function(e: any) {
				return d[e];
			},
		];
		e = function() {
			return '\\w+';
		};
		c = 1;
	}

	while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);

	return p;
}

export async function download(url: string, flags: MangaOptions) {
	const html = await getContent(url);
	const $ = cheerio.load(html);
	const rawData = $('body').html();
	const [, propMap, from, to, base64data] =
		/\}\(\'(.*)\'\,([0-9]{1,})\,([0-9]{1,})\,\'(.*)\'\[\'\\x73\\x70/g.exec(rawData ?? '') ??
		[];

	let data = decode(propMap, from, to, decompressFromBase64(base64data).split('|'), 0, {});

	// 解密完后去掉头和尾
	data = data.replace('SMH.imgData(', '');
	data = data.replace(').preInit();', '');
	data = JSON.parse(`${data}`);

	// 把漫画名也加进去 漫画名/第几话
	const title = `${data.bname}/${data.cname}`;
	// TODO 验证数据
	const images = [];

	// 组成图片链接
	for (const file of data.files) {
		images.push(
			decodeURI(
				`https://i.hamreus.com${data.path}${file}?cid=${data.cid}&md5=${data.sl.md5}`
			)
		);
	}

	const options = {
		headers: {
			// 最重要需要设置referer
			referer: url,
		},
	};

	await downloadUrls({images, title, flags, site: 'manhuagui', downloadOptions: options});
}
