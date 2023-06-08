import type { AmOptions, MangaItem } from '../../types.js';
import { load as $ } from 'cheerio';
import { getHttpClient } from '../../http.js';
import { downloadManga } from '../../utils.js';

export const host = 'https://nhentai.net';
export const name = 'nhentai';

// https://nhentai.net/g/404421/
export function validate(url: string): boolean {
  return /^https?:\/\/nhentai\.net\/g\/(\d+)/.test(url);
}

// thumbnail https://t5.nhentai.net/galleries/1776206/1t.jpg
// https://i5.nhentai.net/galleries/1776206/74.jpg
export async function parse(url: string): Promise<MangaItem> {
  const http = getHttpClient();
  const html = await http.get(url).text();
  const html$ = $(html, {});

  let urls = html$('.thumbs img')
    .toArray()
    .map((el) => html$(el).data('src') as string);

  urls = urls.map((url_) => url_.replace(/(\d+)t/, '$1').replace(/t(\d+)/, 'i$1'));

  // artist
  const title = html$('#info > h1.title > .before').text();
  // name
  const episode = html$('#info > h1.title > .pretty').text();

  return {
    originUrl: url,
    title,
    episode,
    urls,
    httpClient: http,
  };
}

export async function download(url: string, options: AmOptions) {
  const manga = await parse(url);
  await downloadManga(manga, options);
}
