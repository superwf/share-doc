# 如何编写一个健壮的 npm 包

## 无脑发布 npm

用`npm init`新建一个包，改把改把，然后来个`npm publish`，so easy ✌️!

Too young too native, baby 👶!

请容我讲述一些发布过程中踩过的坑。

首先，算了也可以之后有空再说，我们需要通读`npm`的配置文档。

[package.json doc](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)

## 通用性👷

### 指定发布文件

利用`package.json`中`files`字段精简发布体积。

```json
{
  "files": ["dist", "lib", "module"]
}
```

若不指定`files`，每次发布会把所有不以`.`开头的文件都发布出去，导致发布体积过大。

`README.md`作为主文档，加不加都会发布。

### 指定源代码

```json
{
  "source": "src/index.ts",
  "repository": {
      "type": "git",
      "url": "https://github.com/yourname/yourproject.git"
  }
}
```

通常来说我是不在`npm`发布中包括源代码的，因此都没有加过`source`字段，只是用`repository`来告知一下`git`仓库地址即可。

如果仓库是内部仓库或私人仓库并不对外，则`source`字段就有用了，将源代码发布后可让人帮忙`debug`找问题。

注意如果有`source`，则`files`也要加上`souce`对应的文件。

### 发布`sourcemap`

一般来说我们发布的都是经过编译的代码，为了给使用者方便调试，只要不是源码，都要有对应的`sourcemap`文件，例如发布了一个`dist/index.js`则也需要一个`dist/index.js.map`文件与之配套。

### 指定安装源

如果你从来不用私有源，可跳过该项。

利用`.npmrc`指定安装源，用于当前项目与你的全局配置区分开。

否则当前项目很可能指定的内部`npm`源，导致外部用户无法利用`lock`文件安装。

例如

```text
registry=https://registry.npmjs.org/
```

### 指定发布目标

如果你从来不在私有源发布，可跳过该项。

在`package.json`中指定发布地址，在当前包与全局配置不一致时非常必要。

```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  }
}
```

### sideEffects

对应配置：

```json
{ "sideEffects": false }
```

作用：在打包时进行`treeshake`可根据是否使用而优化相关的代码。

如果`sideEffects`为`true`，则一旦引入，不管是否调用都不能被`treeshake`掉。

## 专用性🥷

### 类型配套

无论针对哪个环境，目前自带类型已经是既成事实的标配。

记得生成类型的`.d.ts`文件，并在`package.json`中指定。

```json
{
  "types": "type/index.d.ts",
  "typings": "type/index.d.ts"
}
```

### 作为后端库

`package.json`中指定`main`字段。

编译结果需要在`nodejs`环境中运行，输出`commonjs`格式模块。

为了兼容最新与将来，同事也要输出`esmodule`格式模块。

相关配置：

```json
{
  "main": "lib/index.js",
  "module": "module/index.js",
  "jsnext:main": "module/index.js"
}
```

`module`与`jsnext:main`都是指`esmodule`格式，只是为了兼容某些特殊环境的别名。可能还有其他别名我暂时就见过这俩。

其中`module`中的文件推荐使用特定的后缀名，例如`.esm.js`或`.mjs`，但在一些工程相关工具中是否会有未知为题，不好说。

未来已来，现在大部分前端工程工具都会优先使用`module`指定的文件，单如果没有指定`module`，也会为了兼容去加载`main`。

### 作为前端库

前端库其实要求比后端库更高，为啥？

因为现代前端开发环境要求支持所有后端环境，并延伸出前端环境的额外支持。也就是说后端库要求一般是前端库要求的子集。

需要扩展的是纯前端环境的运行格式，老格式`amd`已经被淘汰可以不用考虑，现在基本都被`umd`格式统一。

```json
{
  "main": "lib/index.js",
  "module": "module/index.js",
  "unpkg": "dist/index.js",
  "umd:main": "dist/index.js",
  "jsdelivr": "dist/index.umd.production.min.js"
}
```

其中`unpkg`，`umd:main`，`jsdelivr`都是为了更广泛兼容的指向浏览器环境运行的同一个目标别名。

通常来说`commonjs`，`esmodule`，`umd`都不会将其依赖的其他包包括进去，只是在运行时才加载。

还有一种情况，可能只有我自己用到过，就是发布包中有些东西与外部环境重复，因此除了这些通用模式之外我又加了一个`independent`(取名叫`standalong`也比较合适)格式，将这个包的所有依赖都封装进去，可以不依赖外部环境独立使用。

例如`mobx-value`的独立运行文件。

[mobx-value independent](https://cdn.jsdelivr.net/npm/mobx-value@1.1.2-rc.1/dist/independent.umd.js)

注意浏览器环境输出的都是优化后的`.production.min`格式，也必须同时输出`.development`后缀的开发模式，为了方便使用者调试方便。

因为最大的使用者，往往就是我们自己，别连自己都懒得糊弄了~

### 作为命令行工具

#### 多配置兼容

命令行工具一般需要很多参数，例如`tsc`，当参数过多时没人愿意每次都输入长长的参数，因此需要配置文件的支持。

那么选哪种配置格式呢？

此时[cosmiconfig](https://www.npmjs.com/package/cosmiconfig)隆重登场！以一句名言形容，小孩子才做选择，成年人全都要！

兼容各种配置，各种位置，详情参见其`api`。

还有一点，如果需要读取一些周边的`json`配置，不要用原生的`JSON.parse`，很多`json`是带注释的或者编写不规范，用`json5`读取兼容好。

还有一个精简版：[lilconfig](https://www.npmjs.com/package/lilconfig)，功能差不多，我下次打算试试。

#### 配置文件校验

我们的程序要读配置，但配置是使用者提供的，谁知道用户会写些什么，这时候校验就是必备环节。

不光是校验不通过时终止运行，还必须给出一个合理且精准的错误提示。

推荐一个协议、两个校验工具与一个漂亮的格式化提示工具。

协议是`json schema`，校验工具为`joi`或`ajv`，提示输出工具为`chalk`。

#### 指定可运行文件

在`package.json`中指定`bin`：

```json
{
  "bin": "bin/run.js"
}
```

对于大部分js脚本，都要在运行文件头部指定运行环境。

```sh
#! /usr/bin/env node
```

然后别忘了在发布前添加可执行属性，最好整合在自动化发布脚本中。

```sh
chmod +x bin/run.js
```

#### 可调用api

例如`babel`，我们不光能使用`@babel/cli`在命令行使用，也可以在自己的程序里`import babel from 'babel'`来调用其`api`。

一个命令行工具通常也是一个第三方库，方便集成到调用者自身的脚本与环境中。

### 其他特定环境

例如针对`react-native`，这个我就见过，没实际用过。

```json
{
  "react-native": "dist/index.esm.js"
}
```

最后不论什么格式，都记得输出配套`sourcemap`的`.map`文件。

## 健壮性🏋

### 指定运行环境：engine与os

尤其对于命令行工具，这俩点很重要，不然很容易就换个人换个电脑就莫名报错。

```json
{
  "engine": "node>=14",
  "os": ["linux", "darwin"]
}
```

### 有否配套测试用例

* 有可运行的配套测试用例。

* 在`README.md`上有可见的测试覆盖率统计，让人可以放心使用。

## 推广性🤹

### 文档

使用`.markdownlint`配置规范自己的`markdown`文档，否则很容易写飞了。

否则一看文档，项目质量很容易就露馅了不是🤭

### 配套用例

* 一个方法是在项目中自带一个可运行的样例，让人`clone`之后运行指定命令即可查看样例。

* 更好一些，部署一个可以在线查看的例子，并在主文档上附上直达链接。

* 更进一步，项目增大之后，需要说明的地方越来越多，一个`README`已经太长。使用`docusaurus`等类似的工具部署一个独立的文档站点。

### 有否自动化版本管理

Why？因为版本号与兼容性是强相关的，具体参考`semver`规范。

* 使用`husky`/`yorkie`等规范提交日志。

* 使用`standard-version`等自动生成`CHANGELOG`并根据规则自动提升版本号。

## 最后留个作业

当我们再一次运行`npm publish`，脑编译一下，想想这期间都发生了些什么，还少些什么？
