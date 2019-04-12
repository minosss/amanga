<h1 align="center">amanga</h1>

> 下载漫画咯

[![npm](https://img.shields.io/npm/v/amanga.svg?style=flat-square)](https://www.npmjs.com/package/amanga)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

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

    下载漫画咯

    Usage
        $ amanga <...input>

    Options
        --type       source site
        --info       print title and images list
        --output-dir the ouput directory  [default: amanga/<type>/<id>]

    Examples
        $ amanga 114883 --type nhentai
        $ amanga 114883 --type nhentai --info
```

## Todos

-   [ ] 支持需要点击事件，比如 ishuhui
-   [ ] 输出信息更友好

## Supported Sites

-   [manhuagui](https://manhuagui.com)
-   [nhentai](https://nhentai.net)
-   [ishuhui](https://www.ishuhui.com)

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
