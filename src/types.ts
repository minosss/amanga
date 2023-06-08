import type { Got } from 'got';

export interface AmOptions {
  force?: boolean;
  outdir?: string;
}

export interface Item {
  originUrl?: string;
  title: string;
  episode: string;
  httpClient: Got;
  thumbnailUrl?: string;
}

export interface MangaItem extends Item {
  urls: string[];
  ext?: string;
}

export interface VideoItem extends Item {
  videoUrl: string;
  videoExt?: string;
  subtitleUrl?: string;
  subtitleExt?: string;
  subtitleTransform?: (input: Buffer) => string;
}
