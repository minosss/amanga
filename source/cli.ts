#!/usr/bin/env node
'use strict';

import 'global-agent/bootstrap';
import cli = require('commander');
import chalk = require('chalk');
import {version} from '../package.json';
import amanga from './amanga';
import {MangaOptions} from './types.js';

cli.version(`@yme/amanga ${version}`).usage('<command> [options]');

cli.command('get <url>')
	.description('download manga from site url.')
	// .option('-l, --list', 'x')
	.option('-i, --info', 'Print extracted information')
	.option('-o, --output-dir <dir>', 'Set output directory')
	.option('-f, --focus', 'FOrce overwriting existing files')
	.option('--ext <ext>', 'image format', 'jpeg')
	.action((url, cmd) => {
		amanga(url, cleanArgs(cmd));
	});

cli.arguments('<command>').action(cmd => {
	cli.outputHelp();
	console.log(`  ` + chalk.red(`Unknow command ${chalk.yellow(cmd)}.`));
	console.log();
});

cli.commands.forEach((c: cli.Command) => c.on('--help', () => console.log()));

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
	cli.outputHelp();
}

function camelize(str: string) {
	return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function cleanArgs(cmd: cli.Command): MangaOptions {
	const args: {[key: string]: any} = {};
	cmd.options.forEach((o: cli.Option) => {
		const key = camelize(o.long.replace(/^--/, ''));
		if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
			args[key] = cmd[key];
		}
	});
	return args as MangaOptions;
}
