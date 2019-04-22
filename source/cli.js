#!/usr/bin/env node
'use strict';

const meow = require('meow');
const logSymbols = require('log-symbols');
const amanga = require('./amanga');

const cli = meow(
    `
    使用方法
        $ amanga --type <type> <...input>

    参数
        --type       目标网站 [必须]
        --info       打印标题和图片信息
        --output-dir 输出路径 [默认: amanga/<type>/<title>]
        --ext        图片格式 [默认: jpeg]
        --focus      强制覆盖图片

    例子
        $ amanga --type nhentai 114883
        $ amanga --type ishuhui 11429 --info
`,
    {
        flags: {
            type: {
                type: 'string'
            },
            info: {
                type: 'boolean'
            },
            outputDir: {
                type: 'string'
            },
            ext: {
                type: 'string',
                default: 'jpeg'
            },
            focus: {
                type: 'boolean',
                default: false
            }
        }
    }
);

if (cli.input < 1 || !cli.flags.type) {
    console.log(cli.help);
    process.exit(0);
}

// cli -> lib(parser) -> download -> done
(async () => {
    await amanga(cli.input, cli.flags);

    console.log(`\n${logSymbols.success} All Done 🎉`);
})().catch(error => {
    console.error(`\n${logSymbols.error} ${error.message}`);
    process.exit(1);
});
