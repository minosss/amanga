---
sidebarDepth: 0
---


# 开始使用

## 参数

当前方法 `amanga(url, content, options)`

- `url: string` **必要**，当前话漫画的页面地址
- `content: string` 可选，页面的 html 内容
- `options: MangaOptions` 可选，参数
  - `requestOptions: RequestOptions` 可选，网络请求库 Got 的参数

## 当库来使用

比如要解析 `https://www.manhuabei.com/manhua/DrSTONE/312653.html` 好了，先安装库

```sh
yarn add amanga
# or
npm install amanga --save
```

然后

```js
// test.js
const amanga = require('amanga');

// 这里是返回异步
(async () => {
    const result = await amanga('https://www.manhuabei.com/manhua/DrSTONE/312653.html');
    console.log(result);
})();
// 运行 node test.js
// 输出 {site, title, chapter, images}
```

直接传入解析内容，比如一些无法直接获取到网页内容的

```js
// 获取网页
const url = 'https://www.manhuabei.com/manhua/DrSTONE/312653.html';
// 用自定义方法获取到网页内容
const rawHtml = getRawHtmlByUrl(url);
// 传入解析
const result = await amanga(url, rawHtml);
// 输出 {site, title, chapter, images}
```

## 命令行

命令行独立出来一个库使用 `amanga` 获取图片信息，并提供下载功能 [Github](https://github.com/minosss/amanga-cli)

### 安装

```sh
yarn global add amanga-cli
```

或者使用 npm

```sh
npm install -g amanga-cli
```

### 使用

版本

```sh
amanga --version
# amanga-cli 0.1.1 输出当前版本
```

下载单话漫画

```sh
amanga get <url>
# 比如
amanga get https://www.manhuabei.com/manhua/DrSTONE/312653.html
```

只输出图片信息

```sh
amanga get --info https://www.manhuabei.com/manhua/DrSTONE/312653.html
```

帮助信息

```sh
amanga
# or
amanga --help
# 获取 get 命令的帮助
amanga get --help
```
