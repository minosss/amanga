#!/usr/bin/env node
'use strict';

import 'global-agent/bootstrap';
import cli = require('commander');
import chalk = require('chalk');
import {version} from '../package.json';
import amanga from './amanga';
import {MangaOptions} from './types';
import Conf = require('conf');
import {toNumber, toBoolean} from './util';

cli.version(`@yme/amanga ${version}`).usage('<command> [options]');

type MangaConfig = {
	get: {
		retry: number;
		ext: string;
		outputDir: string;
		focus: boolean;
	};
};

// conf
const conf = new Conf<MangaConfig>({
	defaults: {
		get: {
			retry: 3,
			ext: 'jpeg',
			outputDir: '',
			focus: false,
		},
	},
	// schema: {
	// 	get: {
	// 		type: 'object',
	// 		properties: {
	// 			retry: {
	// 				type: 'integer',
	// 				default: 3,
	// 			},
	// 			ext: {
	// 				type: 'string',
	// 				default: 'jpeg',
	// 			},
	// 			outputDir: {
	// 				type: 'string',
	// 			},
	// 			focus: {
	// 				type: 'boolean',
	// 				default: false,
	// 			},
	// 		},
	// 	},
	// },
});

cli.command('config [action] [args...]')
	.alias('c')
	.description('set configuration')
	.usage('[action]')
	.action((action, args, cmd: cli.Command) => {
		switch (action) {
			case 'list':
				const output = Object.keys(conf.store).reduce((obj, key) => {
					return {...obj, [key]: conf.get(key as any)};
				}, {});
				console.log(output);
				break;
			case 'get':
				{
					const [key] = args;
					if (key) {
						console.log(conf.get(key));
					}
				}
				break;
			case 'set':
				{
					const [key, value] = args;
					if (key && value && conf.has(key)) {
						switch (key) {
							case 'get.retry':
								conf.set(key, toNumber(value));
								break;
							case 'get.focus':
								conf.set(key, toBoolean(value));
								break;
							default:
								conf.set(key, value);
								break;
						}
					}
				}
				break;
			case 'reset':
				{
					const [key] = args;
					if (key && conf.has(key)) {
						conf.reset(key);
					}
				}
				break;
			case 'clear':
				conf.clear();
				break;
			default:
				cmd.outputHelp();
				break;
		}
	})
	.on('--help', function() {
		console.log('');
		console.log('Examples:');
		console.log('');
		console.log('  $ amanga config get get.ext');
		console.log('  $ amanga config set get.retry 5');
		console.log('  $ amanga config list');
	});

cli.command('get <url>')
	.description('download manga from site url.')
	// .option('-l, --list', 'x')
	.option('-i, --info', 'Print extracted information')
	.option('-o, --output-dir <dir>', 'Set output directory')
	.option('-f, --focus', 'Force overwriting existing files')
	.option('--ext <ext>', 'Image format')
	.option('-r, --retry <tiems>', 'Retry times')
	.action((url, cmd) => {
		const getUrlConf = conf.get('get');
		console.log(getUrlConf);

		amanga(url, {...getUrlConf, ...cleanArgs(cmd)});
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
