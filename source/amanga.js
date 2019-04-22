const download = require('download');
const Listr = require('listr');
const sharp = require('sharp');
const path = require('path');
const makeDir = require('make-dir');
const {existsSync} = require('fs');

const supportedImageTypes = ['jpeg', 'png', 'webp', 'tiff'];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (input, flags) => {
    const {type, outputDir, ext, focus} = flags;

    if (!supportedImageTypes.includes(ext)) {
        throw new TypeError(
            `不支持 ${ext} 图片格式，仅支持 ${supportedImageTypes.join('|')}`
        );
    }

    const tasks = new Listr([
        {
            title: '检查类型是否支持',
            task: () => {
                if (!existsSync(`${__dirname}/lib/${type}.js`)) {
                    throw new Error(`${type} 类型不支持`);
                }
            }
        },
        {
            title: '获取数据',
            task: async ctx => {
                const parser = require(`./lib/${type}`);
                const data = await parser(input, flags);
                ctx.data = data;
            }
        }
    ]);

    if (flags.info) {
        tasks.add({
            title: '格式化数据',
            task: ctx => {
                const {title, images} = ctx.data;

                const info = `
    标题: ${title}
    数量: ${images.length}
    图片链接:
    ${
        typeof images[0] === 'string'
            ? images.join('\n    ')
            : images.map(img => img.url).join('\n    ')
    }
                `;

                ctx.info = info;
            }
        });
    } else {
        tasks.add({
            title: '下载图片',
            skip: () => flags.info,
            task: async (ctx, task) => {
                const {title, images, options} = ctx.data;
                const maxLength = images.length.toString().length;

                let count = 0;
                task.title = `下载图片 [${count}/${images.length}]`;

                const imagesWithIndex = images.map((url, index) => {
                    const filename = `${index + 1}`.padStart(maxLength, '0');
                    return [index, {filename, url}];
                });

                const updateTitle = () => {
                    task.title = `下载图片 [${(count += 1)}/${images.length}]`;
                };

                for (const [index, image] of imagesWithIndex) {
                    const {url, filename} = image;

                    task.output = `下载 ${url}`;

                    const outputFilepath = path.join(
                        outputDir || `amanga/${type}`,
                        `${title}`,
                        `${filename}.${ext}`
                    );

                    if (!focus && existsSync(outputFilepath)) {
                        task.output = `图片已存在，跳过 ${url}`;
                        await delay(150);
                        updateTitle();
                        continue;
                    }

                    await download(encodeURI(url), {
                        // 10s
                        timeout: 10000,
                        ...options
                    })
                        .on(
                            'downloadProgress',
                            ({transferred, total, percent}) => {
                                task.output = `下载 ${url} [${transferred}/${total}]`;
                                if (percent === 1) {
                                    updateTitle();
                                }
                            }
                        )
                        .then(data => {
                            // 确保文件夹存在 -> 用 sharp 输出图片格式
                            return makeDir(path.dirname(outputFilepath)).then(
                                () =>
                                    sharp(data)
                                        [ext]()
                                        .toFile(outputFilepath)
                            );
                        });
                }
            }
        });
    }

    await tasks.run().then(ctx => {
        if (ctx.info) {
            console.log(ctx.info);
        }
    });
};
