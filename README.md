# Webpack 学习笔记

## Webpack 五个基本概念

- 入口：
  入口起点(entry point) 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
- 输出：
  output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
- Loader：
  webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
- 插件：
  loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。
- 模式：
  通过选择 development, production 或 none 之中的一个，来设置 mode 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 production。

  ## 安装

  ```bash
  yarn add webpack webpack-cli
  ```

  安装 webpack 依赖后还需要调整 package.json 文件，以便确保我们安装包是 private(私有的)，并且移除 main 入口。这可以防止意外发布你的代码。

  ```json
  "private":true
  ```

## Webpack 配置文件

在项目根目录下创建 webpack.config.js 文件，我们就可以在该文件中导出 webpack 的配置了。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

## 打包构建命令

我们可以再 package.json 中添加打包脚本：

```json
{
  ///
  "scripts": {
    "build": "webpack"
  }
  ///
}
```

然后执行 yarn build 命令 webpack 就会根据你的配置输出相应的打包后的文件。

## 管理资源

由于 webpack 原生只支持 js 和 json 格式的数据的打包，因此我们要打包其他资源的时候就需要使用对应的 loader，比如打包 css 需要`style-loader`和`css-loader`并在配置文件中作相应的配置：

```js
module.exports = {
  // 入口用相对路径
  entry: "./src/index.js",
  output: {
    // 输出用绝对路径（不用纠结为啥  webpack规定的）
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
  },
  // 加载器
  module: {
    rules: [
        // 配置loader
      {
        test: /\.css/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
    ],
  },
};
```

## 管理输出

通常情况下，应用程序都不止输出一个 bundle，如果手动管理 index.html，事情会变的很复杂。然而，通过一些插件可以使这个过程更容易管控。

比如我们可以这样配置 webpack：

```js
{
  ///
  entry: {
    index: "./src/index.js",
    // print: "./src/print.js",
    tool: "./src/tools/index.js",
  },
  output: {
    // filename: "main.js",
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    // 每次build前清空dist目录
    clean: true,
    // publicPath:"./"
  },
  plugins: [new HtmlWebpackPlugin({ title: "管理输出Title" })],
  ///
};
```

配置解析：

- entry：入口配置，上面的示例中我们有 index 和 test 两个入口，因此我们使用 JSON 对象的方式分别配置了这两个入口。
- output：输出配置
  - filename：输出的文件的命名（规则）
  - path：输出路径
  - clean：每次打包前是否清空上次打包的输出文件
  - publicPath：index.html 中引入的打包资源的根路径，比如：如果该配置为`./`，则 index.html 中引入的打包的 bundle 的根路径为`./`:
  ```html
      <script defer="defer" src="./runtime.bundle.js">
      </script><script defer="defer" src="./index.bundle.js"></script>
      <script defer="defer" src="./test.bundle.js">
  ```
  - 其他配置...
- plugins：插件

这里面 HtmlWebpackPlugin 可以自动将打包好的 bundle 载入 index.html 文件，还可以通过传入配置的方式做其他的配置，比如上面传入的 title 属性的属性值会替换 index.html 中的 title 标签的内容。

## 开发环境

首先开发环境中我们一般会将 webpack 中的 mode 选项配置为`development`。

### 使用 source map

webpack 打包源代码后，你运行打包后的代码是很难追踪到错误、警告、打印等在源代码中的具体位置，这时候就需要使用 source map，这有利于我们在开发环境追踪代码错误，但是不要再生产环境中使用，因为这可能会导致你的源代码泄露。
配置：

```js
{
  ////
     mode: "development",
  // devtool:"eval",
  // devtool:"eval-cheap-source-map",
  // devtool: "eval-cheap-module-source-map",
  // devtool: "eval-source-map",
  devtool: "cheap-source-map",
  // devtool: "inline-nosources-source-map",
  // devtool: "hidden-nosources-cheap-source-map",
  ////
}
```

通过`devtool`配置项可以配置多种 source map，具体请[查看文档](https://webpack.docschina.org/configuration/devtool)。

### 动态热打包

买次代码修改后手动运行`build`命令去打包是很繁琐的，webpack 提供以下几种方式使我们可以再代码保存后自动编译：

1. [watch mode 观察模式](https://webpack.docschina.org/configuration/watch/#watch)
2. [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
3. [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)

#### 观察模式

我们只需在运行 webpack 编译命令的时候加上`--watch`玄子那个即可，webpack 会启动观察模式，每当你的代码发生变化，webpack 就会自动编译。

```json
{
  ///
  "scripts": {
    "watch": "webpack --watch"
  }
  ///
}
```

#### webpack-dev-server

webpack-dev-server 为你提供了一个基本的 web server，并且具有 live reloading(实时重新加载) 功能，该工具需要手动安装：

```bash
yarn add webpack-dev-server --dev
```

然后我们需要修改配置文件，告知 devServer 从哪里开始查找文件：

```js
{
  devServer: {
    static: "./dist",
  },
  optimization: {
    runtimeChunk: "single",
  },
};
```

注：optimization 选项是由于实例中有多个入口文件的情况下需要这个配置，否则可能会报错。

#### webpack-dev-middleware

这中方式这里就不记录了，可以查看[官网的介绍](https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware)

## 代码分离

在管理输出的章节中，我们已经实现了多个入口文件打包的场景。

```js
{
  entry: {
    index: "./src/index.js",
    // print: "./src/print.js",
    tool: "./src/tools/index.js",
  },
};
```

但是这种方式是存在一些隐患的：

- 如果入口文件之间有多个重复的模块，那么这些模块将被引入到各个 bundle 中，打个比方，我们在 index.js 和 tools/index.js 中都引入了`lodash`，那么`lodash`会被打包到这两个 bundle 中，造成重复引用。
- 不够灵活，并且不能动态的将核心应用程序逻辑中的代码拆分出来。

### 防止重复

#### 入口依赖防止重复

我们可以在入口配置中配置 `dependOn` 选项，这样可以在多个 chunk 之间共享模块。
在配置该选项之前我们打包出来的 index 和 tool 两个 bundle 大小都超过了 70k，因为他们都引入了 `lodash` 这个库，现在我们按照如下方式配置 `wepack`：

```js
 entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },
    // print: "./src/print.js",
    tool: {
      import: "./src/tools/index.js",
      dependOn: "shared",
    },
    shared: "lodash",
    // shared: ["lodash", "jquery"],
    optimization: {
    runtimeChunk: "single",
  },
  },
```

这样配置后再执行打包编译命令会发现 `lodash` 被编译到了 `shared.bundle.js` 里面，之前的两个入口 bundle 的体积大幅减小。
注：optimization 选项是由于实例中有多个入口文件的情况下需要这个配置，否则可能会报错。
注：shared 配置可以是一个数组。

#### SplitChunkPlugin 防止重复

`SplitChunkPlugin` 插件可以将公共的依赖模块提取到已有的 chunk 中，或者提取到一个新生成的 chunk 中。

```js
{
  optimization: {
    // runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
    },
  },
};
```

这样配置后再执行编译命令，我们发现 webpack 会把 lodash 打包到另外的 bundle 中，这样就能防止重复。

### 动态导入（dynamic import）

当涉及到动态代码拆分时，webpack 提供了两个类似的技术。

1. 使用 ES 标准的 `import()` 语法实现动态导入。
2. 使用 `webpack` 特定的 `require.ensure` 实现。

#### 使用 ES 标准的 import 语法实现动态导入

我们先从之前的示例配置中去掉多余的入口和 `optimization.splitChunks` 选项。然后在入口 `index.js` 中使用 `import` 来动态导入 `lodash`。

```js
// src/index.js
// import "./tools/index"

async function component() {
  const _ = (await import("lodash")).default;
  const element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

(async () => {
  document.body.appendChild(await component());
})();
```

这样修改后再去使用 webpack 打包，我们会发现 lodash 能够成功调用并且打出来的 dist 目录也会有相应的 bundle。

#### 预获取/预加载模块（prefetch/preload module）

webpack v4.6.0+增加了对预获取和预加载的支持，比如我们下面的例子：

```js
// import "./tools/index"

async function component() {
  const _ = (await import(/* webpackPrefetch: true */ "lodash")).default;

  const element = document.createElement("div");

  const button = document.createElement("button");
  const br = document.createElement("br");

  button.innerHTML = "Click me and look at the console!";
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.appendChild(br);
  element.appendChild(button);

  // Note that because a network request is involved, some indication
  // of loading would need to be shown in a production-level site/app.
  button.onclick = async (e) => {
    const print = (await import(/* webpackChunkName: "print" */ "./print"))
      .default;
    print();
  };

  return element;
}

(async () => {
  document.body.appendChild(await component());
})();
```

这个例子中我们使用 `import(/* webpackChunkName: "print" */ "./print")` 引入 `print` 这个 bundle，我们在页面上点击按钮会发现页面会先打印 **The print.js module has loaded! See the network tab in dev tools...**这句话，这是后代表 print 这个 bundle 才执行，这个 js 模块才被浏览器引入进来。

## 缓存

浏览器会使用缓存技术，通过命中缓存，以降低网络流量，增加网站的访问速度。**然而如果我们在部署新的版本时不更改资源的文件名，浏览器就可能会认为这个西苑并没有被更新，就会使用缓存版本。**这个问题我们也是不能直接忽视的。
在 webpack5 之前，我们如果将 output 中的输出文件名加上 hash 值，我们会发现就算我们的代码不作任何改变，运行 build 命令多次获得的 hash 值不一样：

```js
{
  ///
  filename: "[name].[contenthash].js",
  ///
}
```

而在 webpack5 中，打包后只有有更改过后的 bundle（或者说和更改相关的 bundle）的 hash 值才会发生变化。如果不改变内容就进行多次打包，那么每次生成的 hash 值是一样的。
