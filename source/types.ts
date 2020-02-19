export interface Manga {
	site: string;
	title: string;
	images: string[];
}

export interface MangaModule {
	parse: (url: string) => Promise<Manga>;
}

export interface SupportedSitesMap {
	[key: string]: string;
}
