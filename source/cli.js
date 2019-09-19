#!/usr/bin/env node
'use strict';

require('global-agent/bootstrap');
const meow = require('meow');
const logSymbols = require('log-symbols');
const amanga = require('./amanga');

const cli = meow(
    `
    使用方法
        $ amanga --type <type> <...input>

    参数
        -t, --type       目标网站 [必须]
        -i, --info       打印标题和图片信息
        -o, --output-dir 输出路径 [默认: amanga/<type>/<title>]
        -f, --focus      强制覆盖图片
        --ext            图片格式 [默认: jpeg]

    例子
        $ amanga --type nhentai 114883
        $ amanga --type ishuhui 11429 --info
`,
    {
        flags: {
            type: {
                type: 'string',
                alias: 't'
            },
            info: {
                type: 'boolean',
                alias: 'i'
            },
            outputDir: {
                type: 'string',
                alias: 'o'
            },
            ext: {
                type: 'string',
                default: 'jpeg'
            },
            focus: {
                type: 'boolean',
                default: false,
                alias: 'f'
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
