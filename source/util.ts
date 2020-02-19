import got from 'got';

export async function getContent(url: string, options = {}) {
	const res = await got(url, {timeout: 5000, ...options});
	return res.body;
}

export const listNotSupported = (site: string) => (url: string) => {
	console.log(`(${site}) list not supported ${url}`);
};
