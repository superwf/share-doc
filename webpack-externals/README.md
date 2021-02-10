# webpack外置库打包优化

## 动机：为什么要打包优化

node_modules中的包每次重新编译占用大量cpu、内存资源，打包速度慢，生成文件大。

以我的一个前端项目为例，在没有将外部模块去除的情况下，打包结果如下

```bash
总用量 2.3M
 1.5M 2月  10 16:03 557.index.js
    50 2月  10 16:03 557.index.js.LICENSE.

   118 2月  10 16:03 557.index.js.map
   64K 2月  10 16:03 931.index.js
   117 2月  10 16:03 931.index.js.map
  2.8K 2月  10 16:03 index.html
  725K 2月  10 16:03 index.js
  1.6K 2月  10 16:03 index.js.LICENSE.txt
   110 2月  10 16:03 index.js.map
```

将所有外部模块外置化之后，打包结果如下

```bash
总用量 112K
  59K 2月  10 16:07 931.index.js
  117 2月  10 16:07 931.index.js.map
 2.8K 2月  10 16:07 index.html
  40K 2月  10 16:07 index.js
  109 2月  10 16:07 index.js.map
```

体积减少大概 **20** 倍，打包时间减少 **70%**

## 解决方案

回归前端原生加载模式，像jquery时代一样，通过加载一个script标签例如：`<script src="https://cdn.bootcdn.net/jquery.js"></script>`

将外部资源排除出编译过程。

但仅在html中添加一个这样的标签还远远不够，接下来的步骤会逐步讲解，这种外部加载的标签，如何与以webpack为基础的前端工程结合到一起。

## 步骤

### 参考：[webpack externals](https://webpack.js.org/configuration/externals/)

在webpack的配置中添加`externals`，里面有兼容各种模块环境的介绍，例如`amd`,`umd`等，此处推荐使用最简单的全局变量方式。

```javascript
 externals: {
  // npm包名             全局变量名称
    'jquery':                '$',
  }
```

配置完`externals`项之后，webpack已经知道不需要将jquery编译到我们的项目了，这时打包流程已经被优化，但运行时还是会报错，找不到`$`全局变量。

之后我们需要在html中添加引入对应全局变量的标签，此时`jquery`就已经被处理完毕了。

`<script src="https://cdn.bootcdn.net/jquery.js"></script>`

#### 🧐 为什么推荐使用全局变量引入方式，amd、umd模块不是更高级吗？

* 全局变量方式最简单，配置简化。

* 以amd、umd等方式需要在运行时引入额外的模块加载系统。

* 以amd、umd方式引入，当项目自身使用这种体系打包时，则必须所有外部包都支持该打包体系，但实际上第三方包环境各自为战，除了全局变量方式基本都支持外，其他的模块环境支持差异太大。

* amd、umd只是这些年的临时过度方案，最流行的时候使用度也不是很高，而且在可预见的未来就会被前端原生`script`标签支持的`module / import`方式取代。

## 误区

### 1、babel-plugin-import

为了优化打包体积，`babel-plugin-import`是`ant-design`经常使用的手段之一。

他会将我们需要的模块必须部分注入代码，而不是全部模块。

如果不使用模块外部加载的方式打包，这个插件是非常必要的减小打包体积的手段。

常见的`babel`配置：

```typescript
plugins: [
  [
    "import",
    {
      "libraryName": "antd",
    }
  ]
]
```

例如：

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
require('antd/lib/button/style');
ReactDOM.render(<_button>xxxx</_button>);
```

但如果结合了webpack的externals使用，则必须将该插件去掉，否则代码仍然会被打包进来，无法作为外部依赖使用。

### 2、局部文件导入

为了仅引入需要的模块，有如下这种写法

```javascript
import once from 'lodash/once'
```

但如果将lodash整体外部载入，则这种导入的写法会导致`once`仍然被编译，无法引用外部全局已存在的`lodash`。

如果确定`lodash`使用外部配置`externals`导入，则应该按常规写法。

```javascript
import _ from 'lodash'

_.once(...)

```

或

```javascript
import { once } from 'lodash'
```

## 实施细节

### 1、通过script标签加载模块细节

当我们在加载外部模块时，必须首先确认该模块是支持外部加载的。

比如我们熟知的jquery，加载之后可以通过全局变量`$`来使用。

当我们需要加载`react`时，其对应的全局变量是什么呢？`react`、`React`还是`REACT`或`__REACT__`什么的？这玩意没法猜。

以`react`为例子，这时候我们需要去其对应的包文件夹里去看看，其目录结构为。

```
node_modules/react
├── build-info.json
├── cjs
│   ├── react.development.js
│   ├── react-jsx-dev-runtime.development.js
│   ├── react-jsx-dev-runtime.production.min.js
│   ├── react-jsx-dev-runtime.profiling.min.js
│   ├── react-jsx-runtime.development.js
│   ├── react-jsx-runtime.production.min.js
│   ├── react-jsx-runtime.profiling.min.js
│   └── react.production.min.js
├── index.js
├── jsx-dev-runtime.js
├── jsx-runtime.js
├── LICENSE
├── node_modules
├── package.json
├── README.md
└── umd
    ├── react.development.js
    ├── react.production.min.js
    └── react.profiling.min.js
```

其中有几种很明显可用的标志，其中`cjs`文件夹一眼可以看出是`commonjs`的，可以立即排除。

`umd`是前后端通用加载模式，只要看到这种标志，基本确定可用。

这时候去看一下具体的`umd/react.development.js`文件内容。

通过`unpkg`站点可以直接查看，其中最上面的内容大致如下。

```javascript
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.React = {}));
}(this, (function (exports) { 'use strict';
...
})))
```

其中有一个`global.React`这种，可以确定其使用的全局变量为`React`。

之后的步骤是先加载标签`<script src="http://unpkg.jd.com/react@17.0.1/umd/react.development.js"></script>`到我们的html中。

然后打开chrome的控制台，确认一下`React`全局变量已经实际可用，这个实际确认一次的步骤非常必要，因为加载路径，加载模式这些每个模块都有自己的一套，没有太统一的模式。

这里还有一个值得注意的一个地方，我们加载的是`development`后缀的文件，另外还有一个是`production`后缀。

在开发时加载`development`的文件，在生产环境使用最小化文件`production`这点十分必要。

在开发时我们可以得到有用的报错提示，在生产时可以得到最佳性能。

另外，寻找全局变量名称也最好能在`development`环境的文件里来找，因为`production`就不是给人看的。

这种命名方式不一定是`development`和`production`，也可能使用一个`.min.js`后缀来区分，或一些其他的名称，实际遇到时自己判断一下。

### 2、外部依赖版本同步

当把模块外部化之后，依赖一个外部的url来加载对应的script代码。

还是用jquery举例：`<script src="https://cdn.bootcdn.net/jquery.js"></script>`

但仍然推荐开发环境实际仍然要安装该模块，使开发时可以校验相应的api。

例如通过typescript类型，或vscode的一些检查机制，在编写时，或webpack进程中，如果使用了错误的api都会有一些相应的报警机制。

但这种随意上传cdn的行为很容易造成当前项目与远程加载模块版本不一致的问题。

好的，这时候有同学可能会说，我只要把路径上添加上版本号就可以了。例如：
`<script src="https://cdn.bootcdn.net/jquery/3.21/jquery.js"></script>`

已经进步了一些，但其实只要我们本地依赖的jquery版本更新，每次都要手动再去创建一个对应版本的cdn上的jquery。

而且这种需要管理的模块肯定不只一个，在多人协作的项目中，这种保持版本一致的工作量就会很大，每次升级都比较痛苦。

此时推荐使用unpkg服务，解决手动上传cdn问题。

`<script src="https://unpkg.com/jquery@3.5.1/dist/jquery.js"></script>`

此处的版本号，需要与我们通过npm安装的，在`package-lock.json`或`yarn.lock`中对应的版本号保持一致。

也可以查看`node_modules/jquery/package.json`，确认当前依赖的jquery版本。

推荐使用插件[html-webpack-inject-externals-plugin](https://www.npmjs.com/package/html-webpack-inject-externals-plugin)，将版本号同步过程与`script/link`标签注入`html`过程自动化，具体使用方法之后再说。


## 一些未来可能的支持模式

### 1、`webpack5`的`externals`加载外部模块

在`webpack5`中，增加了`externalsType: 'script'`模式。

例如：

```javascript
externalsType: 'script',
externals: {
  react: ['https://unpkg.com/react@17.0.1/dist/react.development.js', 'React']
}
```

支持这种配置之后，我们就可以不需要`html-webpack-inject-externals-plugin`插件了，直接使用webpack的这种原生写法就好啦。

呵呵可惜～，这种模块写法只支持一级依赖，比如`echarts`，可以用这种方式加载。

详细解释如下

```javascript
externalsType: 'script',
externals: {
  react: ['https://unpkg.com/react@17.0.1/dist/react.development.js', 'React']
  antd: ['https://unpkg.com/antd/dist/antd.js', 'antd']
}
```

如果我们的多个外部模块之间有互相依赖，这种写法就出问题了，antd本身是外部模块，它与同样是外部模块的react之间的加载顺序无法通过这种配置写法来保证，因此一定会出现加载错误，当antd先加载时，会报出找不到`React`全局变量的错误。因此`html-webpack-inject-externals-plugin`插件仍有一用的价值。

在`externalsType`的可选项中，还有`module`、`import`等看着很未来的模式，不在本文讨论范围（我还没试明白🤯，文档也没详细说）。
