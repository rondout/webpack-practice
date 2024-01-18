# webpack学习补充笔记

## 使用命令初始化webpack位置

```bash
npx webpack init
```

然后根据提示做出你的选择即可。

## 如果使用了TS怎么配置alias

首先 `webpack` 得配置 `alias`：

```js
// webpack.config.js
module.exports = {
  ///
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
  ///
};
```

这样子 `@` 就指向了 `src` 目录的路径。
另外，如果你使用了TS，还得再 `ts.config.json` 里面配置路径指向：

```json
{
  "compilerOptions": {
    ///
    "paths": {
      "@/*": ["src/*"]
    }
    ///
  },
  "files": ["src/index.ts"]
}
```

## 引入图片等其他资源TS报错
解决办法：在声明文件中声明一下相关资源：

```ts
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}

```