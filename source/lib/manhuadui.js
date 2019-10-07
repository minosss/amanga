const cheerio = require('cheerio');
const CryptoJS = require('crypto-js');
const esprima = require('esprima');
const {getContent, listNotSupported, downloadUrls} = require('../util');

async function download(url, flags) {
	const html = await getContent(url);
	const $ = cheerio.load(html);
	const mangaName = $('.head_title a')
		.text()
		.trim();
	const chapterName = $('.head_title h2')
		.text()
		.trim();
	const scripts = $('script').toArray();
	const title = `${mangaName}/${chapterName}`;

	let images = [];
	for (const ele of scripts) {
		const text = $(ele).html();
		if (text.indexOf('chapterImages') !== -1) {
			const st = esprima.parseScript(text, {});
			const raw = st.body[1].declarations[0].init.value;
			const key = CryptoJS.enc.Utf8.parse('123456781234567G');
			const iv = CryptoJS.enc.Utf8.parse('ABCDEF1G34123412');
			const decrypt = CryptoJS.AES.decrypt(raw, key, {
				iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
			});
			images = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8).toString());
			break;
		}
	}
	images = images.map(url => decodeURI(url));

	await downloadUrls({
		images,
		title,
		flags,
		site: 'manhuadui',
	});
}

exports.download = download;
exports.downloadList = listNotSupported('manhuadui');
