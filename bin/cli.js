#!/usr/bin/env node
'use strict';

const meow = require('meow');
const amanga = require('../source/amanga');
const https = require('https');
const got = require('got');
const ow = require('ow');
const fs = require('fs');
const download = require('download');

const cli = meow(
    `
    Usage
        $ amanga <...input>

    Options
        --type       source site
        --info       print title and images list
        --output-dir the ouput directory  [default: amanga/<type>/<id>]

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
            }
        }
    }
);

// cli -> lib(parser) -> download -> done
(async () => {
    try {
        ow(cli.input, ow.array.minLength(1));
        ow(cli.flags.type, ow.string);

        await amanga(cli.input, cli.flags);
    } catch (error) {
        console.log(error.message);
    }
})();
