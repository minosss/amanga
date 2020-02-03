import path = require('path');
import ora = require('ora');
import download = require('download');
import makeDir = require('make-dir');
import sharp = require('sharp');
import {existsSync} from 'fs';
import got from 'got';

import {DownloadOptions} from './types';

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getContent(url: string, options = {}) {
	const res = await got(url, {timeout: 5000, ...options});
	return res.body;
}

export const listNotSupported = (site: string) => (url: string) => {
	console.log(`(${site}) list not supported ${url}`);
};

export const printInfo = (siteInfo: string, title: string, images: string[]) => {
	console.log();
	console.log('Site:    ' + siteInfo);
	console.log('Title:   ' + title);
	console.log('Images:  ' + images.length);
	console.log(images.join('\n'));
};

export const downloadUrls = async ({
	images,
	title,
	flags,
	site,
	downloadOptions,
}: DownloadOptions) => {
	const {outputDir, focus, ext, info} = flags;

	printInfo(site, title, images);
	if (info) {
		return;
	}

	const spinner = ora();
	spinner.info(`Download start`);

	const length = images.length;
	const finalImages = images.map((url: string, index) => {
		const filename = `${index + 1}`.padStart(length.toString().length, '0');
		return {index, filename, url: encodeURI(url)};
	});

	for (const image of finalImages) {
		const {url, filename} = image;
		const filePath = path.join(outputDir || 'amanga', title, `${filename}.${ext}`);

		spinner.prefixText = `[${filename}/${length}]`;

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
				.then(data => {
					return makeDir(path.dirname(filePath)).then(() =>
						(sharp(data) as any)[ext]().toFile(filePath)
					);
				});
		} catch (error) {
			spinner.fail(error.message);
		}
	}

	spinner.prefixText = '';
	spinner.succeed('Download complete!');
};
