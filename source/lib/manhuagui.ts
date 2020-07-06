import {decompressFromBase64} from 'lz-string';
import {Manga, MangaParser} from '../types';
import {parseScript} from 'esprima';
import {ExpressionStatement, CallExpression, MemberExpression, Literal} from 'estree';

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

function parseData(statement: ExpressionStatement) {
	const data: (string | string[])[] = [];

	((statement.expression as CallExpression)?.arguments[0] as CallExpression).arguments.forEach(
		arg => {
			if (arg.type === 'Literal') {
				data.push(arg.value?.toString() ?? '');
			} else if (arg.type === 'CallExpression') {
				// 加密的图片数据
				const b64Data =
					((arg.callee as MemberExpression)?.object as Literal)?.value?.toString() ??
					'';
				data.push((decompressFromBase64(b64Data) || '').split('|'));
			} else if (arg.type === 'ObjectExpression') {
				// data.push({})
			}
		}
	);

	const [p, a, c, k, e] = data;
	const decodeData = decode(p, a, c, k, e, {}) + '';
	const [jsonData] = decodeData.match(/\{(.+)\}/g) || [];

	return jsonData ? JSON.parse(jsonData) : null;
}

export class Parser implements MangaParser {
	async parse($: CheerioStatic): Promise<Manga> {
		let data;
		const scripts = $('script').toArray();
		for (const ele of scripts) {
			const text = $(ele).html();
			if (text?.indexOf('window[') !== -1) {
				const st = parseScript(text || '', {});
				const statement = st.body[0];
				data = parseData(statement as ExpressionStatement);
			}
		}

		if (!data) {
			throw new Error('Invalid data');
		}

		// 把漫画名也加进去 漫画名/第几话
		const title = data.bname;
		const chapter = data.cname;

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

		return {images, title, chapter, site: '漫画柜'};
	}
}
