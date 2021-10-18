import cheerio from 'cheerio';
import {MangaParser, SupportedSitesMap, Manga, MangaOptions} from './types';
import {getContent} from './util';

const supportedSites: SupportedSitesMap = {
	manhuagui: 'manhuagui',
	qq: 'qq',
	nhentai: 'nhentai',
	loveheaven: 'loveheaven',
    weloma: 'loveheaven',
};

function match1(text: string, regex: string | RegExp) {
	let r = new RegExp(regex).exec(text);
	if (r) {
		return r[1];
	}
	return '';
}

export async function getMangaParser(url: string): Promise<MangaParser> {
	const host = match1(url, /https?:\/\/([^\/]+)\//);
	const domain = match1(host, /(\.[^.]+\.[^.]+)$/) || host;
	const key = match1(domain, /([^.]+)/);

	if (key in supportedSites) {
		const {Parser} = await import(`./lib/${supportedSites[key]}`);
		return new Parser();
	}

	throw new Error('Site not supported ' + url);
}

async function amanga(url: string, content?: string, options?: MangaOptions): Promise<Manga> {
	const mm = await getMangaParser(url);
	const html = content || (await getContent(url, options?.requestOptions));
	const $ = cheerio.load(html);
	return mm.parse($, html);
}

export default amanga;
