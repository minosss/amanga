const cheerio = require('cheerio');
const {getContent, listNotSupported, downloadUrls} = require('../util');

// ac.qq.com 同样使用了 lz-string 来加密 js
function decode(data, nonce) {
	function Base() {
		_keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
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
			return (a = _utf8_decode(a));
		};
		_utf8_decode = function(c) {
			for (var a = '', b = 0, d = (c1 = c2 = 0); b < c.length; )
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

async function download(url, flags) {
	let nonce;
	let data;
	let done = false;
	while (!done) {
		const html = await getContent(url);
		const $ = cheerio.load(html);
		// 拿出所有的 script 解析
		const scripts = $('body script').toArray();

		nonce = undefined;
		data = undefined;
		for (const script of scripts) {
			let h = $(script)
				.html()
				.trim();
			if (h.startsWith('window')) {
				h = h.substr(h.indexOf(']') + 3);
				if (h.indexOf('document') !== -1 || h.indexOf('window') !== -1) {
					break;
				}
				nonce = eval(h);
			} else if (h.startsWith('var DATA')) {
				h = h.replace(/\s/g, '');
				const [_, base64data] = /\'(.*)\'/g.exec(h);
				data = base64data;
			}
		}

		done = nonce && data;
	}

	// 解码
	data = decode(data, nonce);

	// 成功解析已经有标题和图片数据，不需要在页面数据获取
	const {
		comic: {title},
		chapter: {cTitle},
		picture,
	} = data;
	const images = picture.map(({url}) => url);

	await downloadUrls({images, title: title + '/' + cTitle, flags, site: 'qq'});
}

exports.download = download;
exports.downloadList = listNotSupported('qq');
