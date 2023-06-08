import type { AmOptions, VideoItem } from '../../types.js';
import { load as $ } from 'cheerio';
import { getHttpClient } from '../../http.js';
import { downloadVideo } from '../../utils.js';
import { decode } from './ddr.js';

export const host = 'https://ddys.art';
export const name = '低端影视';

export function validate(url: string) {
  return /^https?:\/\/ddys.(art)\/(.*)\//.test(url);
}

async function parse(url: string): Promise<VideoItem> {
  const http = getHttpClient();
  const html = await http
    .get(url, {
      headers: {
        'upgrade-insecure-requests': '1',
      },
    }).text();

  const html$ = $(html, {});

  const palylistRaw = html$('script.wp-playlist-script').text();
  const title = html$('.title > .cute').text();
  const palylist = JSON.parse(palylistRaw);

  const [, ep = '1'] = /ep=(\d+)/.exec(url) ?? [];
  const track = palylist.tracks?.[Number.parseInt(ep) - 1];

  const { caption, src1: id, subsrc } = track;

  const getVideoUrl = `${host}/getvddr/video?id=${id}&type=mix`;
  const data = await http
    .get(getVideoUrl, {
      headers: {
        Referer: url,
      },
    }).json<{ cache: boolean; url: string }>();

  return {
    originUrl: url,
    title,
    episode: `${caption ?? ep}`,
    videoUrl: data.url,
    subtitleUrl: `${host}/subddr${subsrc}`,
    subtitleTransform: decode,
    subtitleExt: 'vtt',
    httpClient: http,
  };
}

export async function download(url: string, options: AmOptions) {
  const video = await parse(url);
  await downloadVideo(video, options);
}
