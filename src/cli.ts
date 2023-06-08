#!/usr/bin/env node

import minimist from '@yme/argv';
import { am } from './main.js';

const argv = minimist(process.argv.slice(2));

const HELP = `
amanga

amanga [options] url

Examples

# ddrk
# video again-my-life ep14
amanga https://ddrk.me/again-my-life?ep=14

# nhentai
# manga 50on
amanga https://nhentai.net/g/421755/

Options

--outdir=...  output directory, default: amanga
--force       overwrite existing files

`;

(async () => {
  const [url] = argv._;
  if (!url || argv.help) {
    console.log(HELP);
    return;
  }

  await am(url, {
    force: argv.force,
    outdir: argv.outdir ?? 'amanga',
  });
  // eslint-disable-next-line unicorn/prefer-top-level-await
})().then(
  () => process.exit(0),
  () => process.exit(1),
);
