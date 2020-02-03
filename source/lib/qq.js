const cheerio = require('cheerio');
const {getContent, listNotSupported, downloadUrls} = require('../util');

function decode(data, nonce) {
	var T = data.split(''),
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

	return JSON.parse(Buffer.from(T, 'base64').toString());
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
