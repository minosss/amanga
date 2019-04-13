const download = require('download');
const ora = require('ora');

module.exports = async (input, flags) => {
    const {type, outputDir} = flags;
    const parser = require(`./lib/${type}`);
    const spinner = ora(`Loading ${type}`).start();

    const {title, images, options} = await parser(input, flags);

    spinner.info(`Title: ${title}`);
    spinner.info(`Images: ${images.length}`);

    // 开启info的话只输出信息
    if (!flags.info) {
        for (const image of images) {
            let url = image;
            const imgOptions = {};
            if (typeof image !== 'string') {
                url = image.url;
                if (image.name) {
                    imgOptions.filename = image.name;
                }
            }

            try {
                spinner.start(`Downloading ${url}`);
                await download(
                    encodeURI(url),
                    outputDir || `amanga/${type}/${title}`,
                    {
                        // 10s超时
                        timeout: 10000,
                        ...options,
                        ...imgOptions
                    }
                ).on('downloadProgress', progress => {
                    spinner.text = `(${
                        progress.transferred
                    }) Downloading ${url}`;
                });
                spinner.succeed(`Done ${url}`);
            } catch (error) {
                spinner.fail(`${error.message} ${url}`);
            }
        }
    } else {
        console.log();
        console.dir({type, title, images});
        console.log();
    }

    spinner.info('All Done 🎉');
    spinner.stop();
};
