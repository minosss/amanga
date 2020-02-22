<div align="center">
    <img src="logo.png" width=100>
</div>

<div align="center">

解析漫画信息，提供图片下载地址

[![Build Status](https://travis-ci.com/minosss/amanga.svg?branch=master)](https://travis-ci.com/minosss/amanga)
[![npm](https://img.shields.io/npm/v/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/dt/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)

</div>

## Install

```bash
$ npm install amanga
```

Or Yarn:

```bash
$ yarn add amanga
```

## Usage

```js
import amanga from 'amanga';

const manga = amanga('');
console.log(manga);
// Manga {site, title, images}
```

## Supported Sites

| Name | Home |
| ---------- | ------------------------- |
| 看漫画 | https://manhuagui.com | 
| nhentai | https://nhentai.net | 
| ~~鼠绘漫画网~~(被铁拳) | https://www.ishuhui.com | 
| YYLS 漫画  | http://8comic.se | 
| ~~腾讯动漫~~(翻译弱) | https://ac.qq.com | 
| LHScan | https://lhscan.net | 
| 漫画堆 | https://www.manhuadui.com | 

## Develop

克隆代码

```bash
$ git clone https://github.com/minosss/amanga.git
$ cd amanga
```

安装依赖

```bash
$ npm install
```

添加新的网站类型放在 `source/lib` 目录下，例子：

```ts
// lib/hello.ts
import {getContent} from '../util';
import {Manga} from '../types';

// 处理下载
export async function parse(url: string): Promise<Manga> => {
	const html = getContent(url);
	// 处理解析...balabala
	return {images, title, site: 'hello'};
};
```

然后在 `amanga.ts` 中 `supportedSites` 添加对应的映射

```ts
supportedSites = {
    网站域: '网站解析文件名'
}
```

## Related

- [amanga-cli](https://github.com/minosss/amanga-cli) 下漫画命令行工具

## License

MIT
