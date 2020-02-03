import path = require('path');
import cheerio = require('cheerio');
import * as CryptoJS from 'crypto-js';
import {parseScript, Program} from 'esprima';
import {getContent, downloadUrls} from '../util';
import {MangaOptions} from '../types';

const RES_HOST = 'https://mhcdn.manhuazj.com';

export async function download(url: string, flags: MangaOptions) {
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
		if (text?.indexOf('chapterImages') !== -1) {
			const st: Program = parseScript(text ?? '', {});
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
	images = images.map((imgUrl: string) => decodeURI(path.join(RES_HOST, imagePath, imgUrl)));

	await downloadUrls({
		images,
		title,
		flags,
		site: 'manhuadui',
	});
}
