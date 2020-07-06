import {Manga, MangaParser} from '../types';

interface QQManga {
	comic: {
		title: string;
	};
	chapter: {
		cTitle: string;
	};
	picture: {url: string}[];
}

function Base() {
	var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	// @ts-ignore
	this.decode = function(c) {
		var a = '',
			b,
			d,
			h,
			f,
			g,
			e = 0;
		for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g, ''); e < c.length; )
			(b = _keyStr.indexOf(c.charAt(e++))),
				(d = _keyStr.indexOf(c.charAt(e++))),
				(f = _keyStr.indexOf(c.charAt(e++))),
				(g = _keyStr.indexOf(c.charAt(e++))),
				(b = (b << 2) | (d >> 4)),
				(d = ((d & 15) << 4) | (f >> 2)),
				(h = ((f & 3) << 6) | g),
				(a += String.fromCharCode(b)),
				64 != f && (a += String.fromCharCode(d)),
				64 != g && (a += String.fromCharCode(h));
		// @ts-ignore
		return (a = _utf8_decode(a));
	};
	// @ts-ignore
	var _utf8_decode = function(c) {
		// @ts-ignore
		for (var a = '', b = 0, d = 0, c1 = 0, c2 = 0, c3 = 0; b < c.length; )
			(d = c.charCodeAt(b)),
				128 > d
					? ((a += String.fromCharCode(d)), b++)
					: 191 < d && 224 > d
					? ((c2 = c.charCodeAt(b + 1)),
					  (a += String.fromCharCode(((d & 31) << 6) | (c2 & 63))),
					  (b += 2))
					: ((c2 = c.charCodeAt(b + 1)),
					  (c3 = c.charCodeAt(b + 2)),
					  (a += String.fromCharCode(
							((d & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
					  )),
					  (b += 3));
		return a;
	};
}

// @ts-ignore
function decode(data, nonce) {
	// @ts-ignore
	var B = new Base(),
		T = data.split(''),
		N = nonce,
		len,
		locate,
		str;
	N = N.match(/\d+[a-zA-Z]+/g);
	len = N.length;
	while (len--) {
		locate = parseInt(N[len]) & 255;
		str = N[len].replace(/\d+/g, '');
		T.splice(locate, str.length);
	}
	T = T.join('');
	return JSON.parse(B.decode(T));
}

function isNonceLike(nonce: string): boolean {
	return /^[0-9a-z]{32}$/.test(nonce);
}

export class Parser implements MangaParser {
	async parse($: CheerioStatic, _rawHtml: string): Promise<Manga> {
		const scripts = $('script').toArray();

		let nonce, data;
		for (const script of scripts) {
			const text = $(script).html() || '';
			if (text.trim().startsWith('window')) {
				const n = eval(text);
				if (isNonceLike(n)) {
					nonce = n;
				}
			} else if (text.trim().startsWith('var DATA')) {
				const [, d] = text.match(/'(.*?)'/) || [];
				if (d) {
					data = d;
				}
			}
		}

		const result = decode(data, nonce) as QQManga;

		if (!result) {
			throw new Error('Invalid data');
		}

		const title = result.comic.title;
		const chapter = result.chapter.cTitle;
		const images = result.picture.map(p => p.url);

		return {title, images, chapter, site: 'QQ'};
	}
}
