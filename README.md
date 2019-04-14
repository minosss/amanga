<div align="center">
    <img src="logo.png" width=100>
</div>

<div align="center">

下载漫画咯

[![Build Status](https://travis-ci.com/minosss/amanga.svg?branch=master)](https://travis-ci.com/minosss/amanga)
[![npm](https://img.shields.io/npm/v/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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

**input 是漫画地址链接的数字编号，有些需要漫画编号和集数编号 (比如 qq, manhuagui)**

```
$ amanga --help

    下载漫画咯

    Usage
        $ amanga --type <type> <...input>

    Options
        --type       source site [required]
        --info       print title and images list
        --output-dir the ouput directory  [default: amanga/<type>/<title>]

    Examples
        $ amanga --type nhentai 114883
```

## Todos

-   [ ] 支持需要点击事件
-   [ ] 输出信息更友好

## Supported Sites

| Name       | Type      | Home                    | Inputs |
| ---------- | --------- | ----------------------- | ------ |
| 看漫画     | manhuagui | https://manhuagui.com   | 2      |
| nhentai    | nhentai   | https://nhentai.net     | 1      |
| 鼠绘漫画网 | ishuhui   | https://www.ishuhui.com | 1      |
| YYLS 漫画  | yyls      | http://8comic.se        | 1      |
| 腾讯动漫   | qq        | https://ac.qq.com       | 2      |

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
// input 按顺序传入的值 字符串数组
// flags 传入所支持的参数 比如 type, info
module.exports = async (input, flags) => {
    return {
        title: '标题',
        images: [], // 所有图片的链接，全部会通过 download 库下载
        options: {} // download 和 got 的配置
    };
};
```

测试

```bash
$ node bin/cli.js --type hello foo bar
# Title: xxx
# Images: x
# ...
```

## License

MIT
