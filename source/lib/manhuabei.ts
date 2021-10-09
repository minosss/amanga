import * as CryptoJS from 'crypto-js';
import {parseScript} from 'esprima';
import {Manga, MangaParser} from '../types';

const RES_HOST = 'https://mhcdn.manhuazj.com/';

export class Parser implements MangaParser {
	async parse($: cheerio.Root): Promise<Manga> {
		const title = $('.head_title a')
			.text()
			.trim();
		const chapter = $('.head_title h2')
			.text()
			.trim();
		const scripts = $('script').toArray();

		let imagePath = '';
		let images = [];
		for (const ele of scripts) {
			const text = $(ele).html();
			if (text?.indexOf('chapterImages') !== -1) {
				const st = parseScript(text ?? '', {});
				// VariableDeclaration
				imagePath = (st.body[2] as any).declarations[0].init.value;
				const raw = (st.body[1] as any).declarations[0].init.value;
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

		images = images.map((imgUrl: string) => RES_HOST + imagePath + imgUrl);

		return {
			images,
			title,
			chapter,
			site: '漫画呗',
		};
	}
}
