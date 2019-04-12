const download = require('download');
const ora = require('ora');

module.exports = async (input, flags) => {
    const {type, outputDir} = flags;
    const parser = require(`./lib/${type}`);
    const spinner = ora(`Loading ${type}`).start();

    try {
        const {title, images, options} = await parser(input, flags);

        spinner.info(`Title: ${title}`);
        spinner.info(`Images: ${images.length}`);

        // 开启info的话只输出信息
        if (!flags.info) {
            for (const image of images) {
                spinner.start(`Download ${image}`);
                try {
                    await download(
                        encodeURI(image),
                        outputDir || `amanga/${type}/${title}`,
                        {
                            // 10s超时
                            timeout: 10000,
                            ...options
                        }
                    ).on('downloadProgress', progress => {
                        spinner.text = `(${
                            progress.transferred
                        }) Download ${image}`;
                    });
                    spinner.succeed(`Done ${image}`);
                } catch (error) {
                    spinner.fail(`${error.message} ${image}`);
                }
            }
        } else {
            console.dir({title, images});
        }

        spinner.info('All Done 🎉🎉');
        spinner.stop();
    } catch (error) {
        spinner.fail(error.message);
    }
};
