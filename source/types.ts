import {Options as RequestOptions} from 'ky';

// 漫画单话
export interface Manga {
	// 来源网站名称
	site: string;
	// 网站主页
	home?: string;
	// 当前话请求地址
	url?: string;
	// 漫画名称
	title: string;
	// 第几话
	chapter?: string;
	// 图片链接
	images: string[];
}

export interface MangaOptions {
	requestOptions?: RequestOptions;
}

export interface MangaParser {
	parse: ($: CheerioStatic, rawHtml: string) => Promise<Manga>;
}

export interface SupportedSitesMap {
	[key: string]: string;
}
