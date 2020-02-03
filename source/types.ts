import download = require('download');

export interface MangaOptions {
	info?: boolean;
	outputDir?: string;
	focus?: boolean;
	ext?: string;
}

export interface MangaModule {
	download: (url: string, args: {[key: string]: any}) => void;
	downloadList: () => void;
}

export interface SupportedSitesMap {
	[key: string]: string;
}

export interface DownloadOptions {
	images: string[];
	title: string;
	site: string;
	flags: {[key: string]: any};
	downloadOptions?: download.DownloadOptions;
}
