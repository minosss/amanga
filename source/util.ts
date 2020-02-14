import path = require('path');
import ora = require('ora');
import download = require('download');
import makeDir = require('make-dir');
import sharp = require('sharp');
import {existsSync} from 'fs';
import got from 'got';

import {DownloadOptions, ImageList, Image, UrlList} from './types';

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getContent(url: string, options = {}) {
	const res = await got(url, {timeout: 5000, ...options});
	return res.body;
}

export const listNotSupported = (site: string) => (url: string) => {
	console.log(`(${site}) list not supported ${url}`);
};

export const printInfo = (siteInfo: string, title: string, images: {url: string}[]) => {
	console.log();
	console.log('Site:    ' + siteInfo);
	console.log('Title:   ' + title);
	console.log('Images:  ' + images.length);
	console.log(images.map(obj => obj.url).join('\n'));
};

export const downloadUrls = async ({
	images,
	title,
	flags,
	site,
	downloadOptions,
}: DownloadOptions) => {
	const {outputDir, focus, ext, info} = flags;

	const length = images.length;
	const finalImages: ImageList =
		images.length && typeof images[0] === 'string'
			? (images as UrlList).map(
					(url: string, index: number): Image => {
						const filename = `${index + 1}`.padStart(length.toString().length, '0');
						return {index, filename, url: encodeURI(url)};
					}
			  )
			: (images as ImageList);

	printInfo(site, title, finalImages);
	if (info) {
		return;
	}

	const spinner = ora();
	spinner.info(`Download start`);

	let failImages: ImageList = [];
	let index = 0;
	for (const image of finalImages) {
		const {url, filename} = image;
		const filePath = path.join(outputDir || 'amanga', title, `${filename}.${ext}`);

		spinner.prefixText = `[${++index}/${length}]`;

		// the image already exists, skip
		if (!focus && existsSync(filePath)) {
			spinner.warn(`Exist ${filePath}`);
			continue;
		}

		// start downloading
		spinner.start(`Downloading ${url}`);
		try {
			await download(url, undefined, {...downloadOptions})
				.on('downloadProgress', ({percent}) => {
					if (percent === 1) {
						spinner.succeed(`Saved ${filePath}`);
					}
				})
				.then(async data => {
					await makeDir(path.dirname(filePath));
					try {
						await (sharp(data) as any)[ext]().toFile(filePath);
					} catch (error) {
						failImages.push(image);
						spinner.fail(error.messages);
					}
				});
		} catch (error) {
			failImages.push(image);
			spinner.fail(error.message);
		}
	}

	if (failImages.length > 0 && flags.retry > 0) {
		flags.retry -= 1;

		console.log();
		spinner.prefixText = '';
		spinner.warn(`Retrying after 3s`);
		setTimeout(() => {
			downloadUrls({
				images: failImages,
				title,
				flags: {...flags, focus: true},
				site,
				downloadOptions,
			});
		}, 3000);
		return;
	}

	spinner.prefixText = '';
	spinner.succeed('Download complete!');
};

export function toBoolean(val: unknown): boolean {
	if (typeof val === 'string') {
		return val.toLocaleLowerCase() === 'true' || val === '1' || val === 'enable';
	} else if (typeof val === 'boolean') {
		return val;
	}
	return !!val;
}

export function toNumber(val: unknown): number {
	if (typeof val === 'string') {
		return parseInt(val, 10);
	} else if (typeof val === 'number') {
		return Math.floor(val);
	}
	return 0;
}
