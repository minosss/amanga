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
import {Manga, MangaParser} from '../types';

// 处理下载
export class Parser implements MangaParser {
    async parse($: CheerioStatic): Promise<Manga> {
        const title = $('title');
        const images = $('data').find('img');
        // 处理解析...balabala
        // images 图片链接数组
        // title 单话的标题，在 cli 中当作文件夹名称
        return {images, title, site: 'hello'};
    };
}
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
