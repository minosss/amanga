import {MangaModule, SupportedSitesMap, Manga} from './types';

const supportedSites: SupportedSitesMap = {
	ishuhui: 'ishuhui',
	manhuagui: 'manhuagui',
	qq: 'qq',
	nhentai: 'nhentai',
	yyls: 'yyls',
	lhscan: 'lhscan',
	manhuadui: 'manhuadui',
};

function match1(text: string, regex: string | RegExp) {
	let r = new RegExp(regex).exec(text);
	if (r) {
		return r[1];
	}
	return '';
}

async function getMangaModule(url: string): Promise<MangaModule> {
	const host = match1(url, /https?:\/\/([^\/]+)\//);
	const domain = match1(host, /(\.[^.]+\.[^.]+)$/) || host;
	const key = match1(domain, /([^.]+)/);

	if (key in supportedSites) {
		return await import(`./lib/${supportedSites[key]}`);
	}

	throw new Error('Site not supported ' + url);
}

export default async function amanga(url: string): Promise<Manga> {
	const mm = await getMangaModule(url);
	return mm.parse(url);
}
