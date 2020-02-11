import download = require('download');

export interface MangaOptions {
	[key: string]: any;
	info?: boolean;
	outputDir?: string;
	focus?: boolean;
	ext: string;
	retry: number;
}

export interface MangaModule {
	download: (url: string, flags: MangaOptions) => Promise<void>;
	downloadList: () => void;
}

export interface SupportedSitesMap {
	[key: string]: string;
}

export type Image = {url: string; index: number; filename: string};
export type ImageList = Image[];
export type UrlList = string[];

export interface DownloadOptions {
	images: UrlList | ImageList;
	title: string;
	site: string;
	flags: MangaOptions;
	downloadOptions?: download.DownloadOptions;
}
