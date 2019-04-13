const download = require('download');
const Listr = require('listr');
const {existsSync} = require('fs');

module.exports = async (input, flags) => {
    const {type, outputDir} = flags;

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
            ? images.join('\n')
            : images.map(img => img.url).join('\n')
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

                let count = 0;
                task.title = `下载图片 [${count}/${images.length}]`;

                for (const image of images) {
                    let url = image;
                    const imgOptions = {};
                    if (typeof image !== 'string') {
                        url = image.url;
                        if (image.name) {
                            imgOptions.filename = image.name;
                        }
                    }

                    task.output = `下载 ${url}`;
                    await download(
                        encodeURI(url),
                        outputDir || `amanga/${type}/${title}`,
                        {
                            // 10s
                            timeout: 10000,
                            ...options,
                            ...imgOptions
                        }
                    ).on(
                        'downloadProgress',
                        ({transferred, total, percent}) => {
                            task.output = `下载 ${url} [${transferred}/${total}]`;
                            if (percent === 1) {
                                task.title = `下载图片 [${(count += 1)}/${
                                    images.length
                                }]`;
                            }
                        }
                    );
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
