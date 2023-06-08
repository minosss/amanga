import type { Got } from 'got';
import type { AmOptions, MangaItem, VideoItem } from './types.js';
import { pipeline as streamPipeline } from 'node:stream/promises';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream, readFileSync, type PathOrFileDescriptor } from 'node:fs';
import { resolve } from 'node:path';
import ora from 'ora';

// resolve cwd path
export function resolvePath(...paths: (string | undefined)[]): string {
  return resolve(process.cwd(), ...(paths.filter(Boolean) as string[]));
}

export function readJSON(file: PathOrFileDescriptor) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

// fs.exists is deprecated
export async function isExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// to MB
const BYTES = 1024 * 1024;
export function formatBytes(bytes: number) {
  return Math.round(bytes / BYTES);
}

export async function downloadStream(src: string, desc: string, http: Got) {
  const spinner = ora(`Downloading ${src}`).start();
  try {
    const data = http.stream(src);

    data.on('downloadProgress', ({ percent, total, transferred }) => {
      spinner.text = `Downloading ${src} ${formatBytes(transferred)}/${formatBytes(total)}MB ${Math.trunc(percent * 100)}%`;
    });

    await streamPipeline(data, createWriteStream(desc));

    spinner.succeed(`Saved to ${desc}`);
  } catch (error: any) {
    spinner.fail(`Failed ${src}, Error: ${error.message}`);
  }
}

export async function downloadVideo(video: VideoItem, options?: AmOptions) {
  const { force = false, outdir } = options || {};

  const {
    originUrl,
    title,
    episode,
    httpClient,
    videoUrl,
    subtitleUrl,
    videoExt = 'mp4',
    subtitleExt = 'srt',
    subtitleTransform,
  } = video;

  // output
  const folder = resolvePath(outdir, title);
  await mkdir(folder, { recursive: true });

  // video
  if (videoUrl) {
    const videoPath = resolve(folder, `${episode}.${videoExt}`);
    if (!(await isExists(videoPath)) || force) {
      await downloadStream(videoUrl, videoPath, httpClient);
    } else {
      console.log(`Video already exists at ${videoPath}, skipping download`);
    }
  } else {
    console.log('Video url not found');
  }

  // subtitle
  if (subtitleUrl) {
    const subtitlePath = resolve(folder, `${episode}.${subtitleExt}`);
    if (!(await isExists(subtitlePath)) || force) {
      const spinner = ora(`Downloading ${subtitleUrl}`).start();

      try {
        const data = await httpClient
          .get(subtitleUrl, {
            headers: { Referer: originUrl },
          }).buffer();

        await writeFile(subtitlePath, subtitleTransform?.(data) ?? data);
        spinner.succeed(`Saved to ${subtitlePath}`);
      } catch (error: any) {
        spinner.fail(`Failed ${subtitleUrl}, Error: ${error?.message}`);
      }
    } else {
      console.log(`Subtitle already exists at ${subtitlePath}, skipping download`);
    }
  } else {
    console.log('Subtitle url not found');
  }
}

export async function downloadManga(manga: MangaItem, options?: AmOptions) {
  const { force = false, outdir } = options || {};

  const { urls, title, episode, httpClient, ext = 'jpg' } = manga;
  //
  const folder = resolvePath(outdir, `${title}/${episode}`);
  await mkdir(folder, { recursive: true });

  console.log(`Downloading ${folder} ${urls.length}p`);

  let index = 0;
  for (const url of urls) {
    const filePath = `${folder}/${++index}.${ext}`;
    //
    if (!(await isExists(filePath)) || force) {
      await downloadStream(url, filePath, httpClient);
    }
  }
}
