const pinyin = require('pinyin');
const {slugify: _slugify} = require('@vuepress/shared-utils');

module.exports = {
	title: 'AMANGA',
	description: '漫画页面解析',
	markdown: {
		slugify: s => {
			return _slugify(
				pinyin(s, {
					style: pinyin.STYLE_NORMAL,
					heteronym: true,
					segment: true,
				})
					// node.js 11
					.flat()
					.join('-')
			);
		},
	},
	themeConfig: {
		repo: 'minosss/amanga',
		editLinks: true,
		docsDir: 'docs',
		lastUpdated: '上次更新',
		editLinkText: '在 GitHub 上编辑此页',
		nav: [
			{
				text: '指南',
				link: '/',
			},
			{
				text: '支持的站点',
				link: '/supported-sites',
			},
		],
		sidebar: {
			'/': [
				{
					title: '指南',
					collapsable: true,
					children: ['', 'usage', 'join'],
				},
				'supported-sites',
			],
		},
	},
};
