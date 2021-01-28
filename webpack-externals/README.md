# webpack外置库打包优化

## 为什么要打包优化

node_modules中的包每次重新编译占用大量cpu、内存资源，打包速度慢，生成文件大。

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

* amd、umd只是这些年的临时过度方案，最流行的时候使用度也不是很高，而且在可预见的未来就会被前端原生支持的import方式取代。

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

### 2、外部依赖版本同步

当把模块外部化之后，依赖一个外部的url来加载对应的script代码。

还是用jquery例如：`<script src="https://cdn.bootcdn.net/jquery.js"></script>`

但仍然推荐开发环境实际仍然要安装该模块，使开发时可以校验相应的api。

例如通过typescript类型，或vscode的一些检查机制，在编写时，或webpack进程中，如果使用了错误的api都会有一些相应的报警机制。

但这种随意上传cdn的行为很容易造成当前项目与远程加载模块版本不一致的问题。

好的，这时候有同学可能会说，我只要把路径上添加上版本号就可以了。例如：
`<script src="https://cdn.bootcdn.net/jquery/3.21/jquery.js"></script>`

已经进步了一些，但其实只要我们本地的jquery更新，每次都要手动再去创建一个对应版本的cdn上的jquery。

而且这种需要管理的模块肯定不只一个，在多人协作的项目中，这种保持版本一致的工作量就会很大，每次升级都比较痛苦。

此时推荐使用unpkg服务，解决手动上传cdn问题。
