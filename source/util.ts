import axios from 'axios';

axios.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4450.0 Safari/537.36'
    };
    return config;
});

export async function getContent(url: string, options = {}): Promise<string> {
	const res = await axios(url, {timeout: 5000, responseType: 'text', ...options});
	return res.data;
}
