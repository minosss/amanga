# 参与开发

## 获取项目代码

先 Fork 项目到自己帐号上，再用 git 克隆代码到本地

```sh
git clone https://github.com/<yourname>/amanga.git
cd amanga
```

安装依赖，本项目使用 Yarn

```sh
yarn
```

## 添加新的网站

添加新的网站类型放在 `source/lib` 目录下，例子：

比如漫画网站是 `https://www.hello.com/`

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

## 测试

TODO

## 提交合并
