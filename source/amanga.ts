import chalk = require('chalk');
import {MangaModule, SupportedSitesMap, MangaOptions} from './types';

const supportedImageTypes = ['jpeg', 'png', 'webp', 'tiff'];
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

export default async function amanga(url: string, flags: MangaOptions) {
	const {ext} = flags;

	if (!ext || !supportedImageTypes.includes(ext)) {
		throw new TypeError(`Supported format are ${supportedImageTypes.join('|')}`);
	}

	try {
		const mm = await getMangaModule(url);
		await mm.download(url, flags);
	} catch (error) {
		console.log('Error: ' + chalk.red(error.message));
		console.log();
	}
}
