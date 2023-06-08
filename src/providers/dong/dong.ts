import type { AmOptions, MangaItem } from '../../types.js';
import { CookieJar as ToughCookieJar, Cookie } from 'tough-cookie';
import { load as $ } from 'cheerio';
import { getHttpClient } from '../../http.js';
import { downloadManga } from '../../utils.js';

export const host = 'https://www.dongmanmanhua.cn';
export const name = '咚漫';

export function validate(url: string) {
  return /^https?:\/\/www\.dongmanmanhua\.cn\/.*episode_no=(\d+)/.test(url);
}

export async function parse(url: string): Promise<MangaItem> {
  // dongman returns multiple domains causes cookiejar#setCookie to crash
  const http = getHttpClient();

  const cookieJar = new ToughCookieJar();
  const html = await http
    .get(url, {
      cookieJar,
      hooks: {
        afterResponse: [
          (response) => {
            const cookies = response.headers['set-cookie'];

            if (cookies) {
              for (const cookie of cookies) {
                const ck = Cookie.parse(cookie);
                // filter domain
                if (ck?.domain?.endsWith('dongmanmanhua.cn')) {
                  cookieJar.setCookie(ck, url);
                }
              }
            }

            return response;
          },
        ],
      },
    })
    .text();

  console.log(html);

  const html$ = $(html, {});
  //
  const urls = html$('#_imageList > img')
    .toArray()
    .map((_, el) => {
      return html$(el).data('url') as string;
    });

  const title = html$('.subj_info > .subj').text();
  const episode = html$('.subj_info > .subj_episode').text();

  return {
    originUrl: url,
    title,
    episode,
    // url list of images
    urls,
    // note: extend, the `user-agent` has set in the getHttpClient
    // fetch image url needs cookie and referer
    httpClient: http.extend({
      cookieJar,
      headers: { Referer: url },
    }),
  };
}

export async function download(url: string, options: AmOptions) {
  const manga = await parse(url);
  await downloadManga(manga, options);
}
