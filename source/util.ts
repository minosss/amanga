import ky from 'ky-universal';

export async function getContent(url: string, options = {}): Promise<string> {
	const res = await ky(url, {timeout: 5000, ...options});
	return res.text();
}
