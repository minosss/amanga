const supportedImageTypes = ['jpeg', 'png', 'webp', 'tiff'];
const supportedSites = {
	ishuhui: 'ishuhui',
	manhuagui: 'manhuagui',
	qq: 'qq',
	nhentai: 'nhentai',
	yyls: 'yyls',
};

const match1 = (text, regex) => {
	let r = new RegExp(regex).exec(text);
	if (r) {
		return r[1];
	}
	return '';
};
const getModule = url => {
	const host = match1(url, /https?:\/\/([^\/]+)\//);
	const domain = match1(host, /(\.[^.]+\.[^.]+)$/) || host;
	const key = match1(domain, /([^.]+)/);

	if (key in supportedSites) {
		return require(`./lib/${supportedSites[key]}`);
	}

	throw new Error('Site not supported ' + url);
};

module.exports = async (input, flags) => {
	const {list, ext} = flags;

	if (!supportedImageTypes.includes(ext)) {
		throw new TypeError(`Supported format are ${supportedImageTypes.join('|')}`);
	}

	const m = getModule(input);
	if (list) {
		await m.downloadList(input, flags);
	} else {
		await m.download(input, flags);
	}
};
