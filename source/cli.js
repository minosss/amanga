#!/usr/bin/env node
'use strict';

require('global-agent/bootstrap');
const meow = require('meow');
const logSymbols = require('log-symbols');
const amanga = require('./amanga');

const cli = meow(
	`
    Usage
        $ amanga [OPTION]... URL

    optional arguments:
        --version           Print version and exit
        --help              Print this help message and exit

    Dry-run options:
        -i, --info          Print extracted information

    Download options:
        -o DIR, --output-dir DIR
                            Set output directory
        -f, --focus         Force overwriting existing files
        --ext EXT
                            Image format [default: jpeg]

    Example:
        $ amanga https://nhentai.net/g/281945/
`,
	{
		flags: {
			list: {
				type: 'boolean',
				alias: 'l',
			},
			info: {
				type: 'boolean',
				alias: 'i',
			},
			outputDir: {
				type: 'string',
				alias: 'o',
				default: 'amanga',
			},
			ext: {
				type: 'string',
				default: 'jpeg',
			},
			focus: {
				type: 'boolean',
				default: false,
				alias: 'f',
			},
		},
	}
);

if (cli.input.length !== 1) {
	console.log(cli.help);
	process.exit(0);
}

// cli -> lib(parser) -> download -> done
(async () => {
	await amanga(cli.input[0], cli.flags);

	console.log();
	console.log('All Done 🎉');
})().catch(error => {
	console.log();
	console.log(error.message);
	process.exit(1);
});
