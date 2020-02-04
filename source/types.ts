import download = require('download');

export interface MangaOptions {
	[key: string]: any;
	info?: boolean;
	outputDir?: string;
	focus?: boolean;
	ext: string;
}

export interface MangaModule {
	download: (url: string, flags: MangaOptions) => void;
	downloadList: () => void;
}

export interface SupportedSitesMap {
	[key: string]: string;
}

export interface DownloadOptions {
	images: string[];
	title: string;
	site: string;
	flags: MangaOptions;
	downloadOptions?: download.DownloadOptions;
}
