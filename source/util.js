const path = require('path');
const got = require('got');
const download = require('download');
const makeDir = require('make-dir');
const sharp = require('sharp');
const ora = require('ora');
const {existsSync} = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.getContent = async (url, options = {}) => {
	const res = await got(url, {...options, timeout: 5000});
	return res.body;
};

exports.listNotSupported = site => url => {
	console.log(`(${site}) list not supported ${url}`);
};

exports.printInfo = (siteInfo, title, images) => {
	console.log();
	console.log('Site:    ' + siteInfo);
	console.log('Title:   ' + title);
	console.log('Images:  ' + images.length);
	console.log(images.join('\n'));
};

exports.downloadUrls = async ({images, title, flags, site, downloadOptions = {}}) => {
	const {outputDir, focus, ext, info} = flags;

	exports.printInfo(site, title, images);
	if (info) {
		return;
	}

	const spinner = ora();
	spinner.info(`Download start`);

	const length = images.length;
	const finalImages = images.map((url, index) => {
		const filename = `${index + 1}`.padStart(length.toString().length, '0');
		return {index, filename, url: encodeURI(url)};
	});

	for (const image of finalImages) {
		const {url, filename, index} = image;
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
			await download(url, {timeout: 10 * 1000, ...downloadOptions})
				.on('downloadProgress', ({transferred, total, percent}) => {
					if (percent === 1) {
						spinner.succeed(`Saved ${filePath}`);
					}
				})
				.then(data => {
					return makeDir(path.dirname(filePath)).then(() =>
						sharp(data)
							[ext]()
							.toFile(filePath)
					);
				});
		} catch (error) {
			spinner.fail(error.message);
		}
	}

	spinner.prefixText = '';
	spinner.succeed('Download complete!');
};
