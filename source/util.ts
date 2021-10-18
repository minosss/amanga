import got from 'got';

export async function getContent(url: string, options = {}): Promise<string> {
	const res = await got.get(url, {
		timeout: 20000,
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
		},
		...options,
	});
	return res.body;
}
