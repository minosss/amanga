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
$ amanga --help
    Manga Downloader

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
```

代理，比如 manhuagui 的巨人就需要代理才能看的到，而下载也是同样需要代理。amanga 使用 [global-agent](https://www.npmjs.com/package/global-agent) 来实现代理功能，使用环境变量 `GLOBAL_AGENT_HTTP_PROXY` 带上代理地址

```
$ GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:8888 amanga https://nhentai.net/g/281945/
```

## Todos

-   [ ] 支持批量下载

## Supported Sites

| Name       | Home                    | Example                                                                      |
| ---------- | ----------------------- | ---------------------------------------------------------------------------- |
| 看漫画     | https://manhuagui.com   | `amanga https://www.manhuagui.com/comic/4740/`                               |
| nhentai    | https://nhentai.net     | `amanga https://nhentai.net/g/281945/`                                       |
| 鼠绘漫画网 | https://www.ishuhui.com | `amanga https://www.ishuhui.com/comics/detail/11746/`                        |
| YYLS 漫画  | http://8comic.se        | `amanga http://8comic.se/65178/`                                             |
| 腾讯动漫   | https://ac.qq.com       | `amanga https://ac.qq.com/ComicView/index/id/505430/cid/972/`                |
| LHScan     | https://lhscan.net      | `amanga https://lhscan.net/read-mairimashita-iruma-kun-raw-chapter-125.html` |

## Develop

克隆代码

```bash
$ git clone https://github.com/minosss/amanga.git
```

安装依赖

```bash
$ yarn install
```

添加新的网站类型放在 `source/lib` 目录下，例子：

```js
// lib/hello.js
const {getContent, downloadUrls} = require('../util');
// 处理下载
exports.download = async (url, flags) => {
	const html = getContent(url);
	// 处理解析...balabala
	// 丢到下载
	await downloadUrls({images, title, flags, site: 'hello'});
	// images 图片的地址数组 [url, url, url]
	// title 标题，会当作目录
	// site 输出时使用
	// flags 命令行参数
};
// 处理多话下载
exports.downloadList = async (url, flags) => {};
```

测试

```bash
$ node source/cli.js URL
# ...
```

## License

MIT
