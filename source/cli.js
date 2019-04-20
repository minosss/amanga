#!/usr/bin/env node
'use strict';

const meow = require('meow');
const logSymbols = require('log-symbols');
const amanga = require('./amanga');

const cli = meow(
    `
    Usage
        $ amanga --type <type> <...input>

    Options
        --type       source site [required]
        --info       print title and images list
        --output-dir the ouput directory  [default: amanga/<type>/<title>]
        --ext        file format [default: jpeg]

    Examples
        $ amanga --type nhentai 114883
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
