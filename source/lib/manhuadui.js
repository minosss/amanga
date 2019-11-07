const path = require('path');
const cheerio = require('cheerio');
const CryptoJS = require('crypto-js');
const esprima = require('esprima');
const {getContent, listNotSupported, downloadUrls} = require('../util');

const RES_HOST = 'https://mhcdn.manhuazj.com';

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

	let imagePath = '';
	let images = [];
	for (const ele of scripts) {
		const text = $(ele).html();
		if (text.indexOf('chapterImages') !== -1) {
			const st = esprima.parseScript(text, {});
			imagePath = st.body[2].declarations[0].init.value;
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
	images = images.map(url => decodeURI(path.join(RES_HOST, imagePath, url)));

	await downloadUrls({
		images,
		title,
		flags,
		site: 'manhuadui',
	});
}

exports.download = download;
exports.downloadList = listNotSupported('manhuadui');
