<div align="center">
    <img src="logo.png" width=100>
</div>

<div align="center">

下载漫画咯

[![Build Status](https://travis-ci.com/minosss/amanga.svg?branch=master)](https://travis-ci.com/minosss/amanga)
[![npm](https://img.shields.io/npm/v/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/dt/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)

</div>

## Install

```bash
$ npm install -g amanga
```

Or Yarn:

```bash
$ yarn global add amanga
```

## Usage

```
$ amanga get <url>
```

代理，比如 manhuagui 的巨人就需要代理才能看的到，而下载也是同样需要代理。amanga 使用 [global-agent](https://www.npmjs.com/package/global-agent) 来实现代理功能，使用环境变量 `GLOBAL_AGENT_HTTP_PROXY` 带上代理地址

```
$ GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:8888 amanga get https://nhentai.net/g/281945/
```

## Supported Sites

| Name       | Home                      | Example                                                                      |
| ---------- | ------------------------- | ---------------------------------------------------------------------------- |
| 看漫画     | https://manhuagui.com     | `amanga get https://www.manhuagui.com/comic/4740/`                               |
| nhentai    | https://nhentai.net       | `amanga get https://nhentai.net/g/281945/`                                       |
| ~~鼠绘漫画网~~(被铁拳) | https://www.ishuhui.com   | `amanga get https://www.ishuhui.com/comics/detail/11746/`                        |
| YYLS 漫画  | http://8comic.se          | `amanga get http://8comic.se/65178/`                                             |
| ~~腾讯动漫~~(翻译弱) | https://ac.qq.com         | `amanga get https://ac.qq.com/ComicView/index/id/505430/cid/972/`                |
| LHScan     | https://lhscan.net        | `amanga get https://lhscan.net/read-mairimashita-iruma-kun-raw-chapter-125.html` |
| 漫画堆     | https://www.manhuadui.com | `amanga get https://www.manhuadui.com/manhua/DrSTONE/411068.html`                |

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
import {getContent, downloadUrls} from '../util';
import {MangaOptions} from '../types';

// 处理下载
export async function download(url: string, flags: MangaOptions) => {
	const html = getContent(url);
	// 处理解析...balabala
	// 丢到下载
	await downloadUrls({images, title, flags, site: 'hello'});
	// images 图片的地址数组 [url, url, url]
	// title 标题，会当作目录
	// site 输出时使用
	// flags 命令行参数
};
```

然后在 `amanga.ts` 中 `supportedSites` 添加对应的映射

```ts
supportedSites = {
    网站域: '网站解析文件名'
}
```

测试

```bash
$ node -r ts-node/register source/cli.ts get <url>
# ...
```

## License

MIT
