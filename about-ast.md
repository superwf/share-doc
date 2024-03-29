<!--
莫道君行早，更有早行人
山中有直树，世上无直人。
力微休负重，言轻莫劝人。
一切都是命，半点不由人。
-->

# 语法树简介

## 语法树是干嘛地

首先说，语法树是一个中语言分析模式，有很多中语言的各种实现，并不指单一工具或环境。

最好的比喻：dom 树，经过语法树工具转换的源码会形成 dom 树一样的层层节点构成的结构。

作用大体有：编译期语法检查、语义检查，ide自动补全。

最重要的核心功能：现有语法扩展。

1. 新语法运行环境不支持？自力更生！语法树帮你转化降级为旧语法。

1. 自造新语法糖（感觉类似宏）。虽然可以，但不要背离主语法为好。

1. 源码压缩，如`terser`/`uglifyjs`，将变量名等在运行时最小化。

1. 源码多环境转换

    > 例如小程序一次编写，自动编译多个平台适配代码。

    > 还例如本地运行的程序，转换后可以在浏览器运行。

1. 调试时，提示信息可以定位到源码的原始位置。

1. 统计测试覆盖率，代码扫描等，一定有语法树的使用场景。

1. 框架升级，当新版本功能能完全覆盖旧版本时，利用语法树可精确将旧框架转换为新框架对应代码。🙏

1. 动态注入其他数据信息。

1. 自创新语言，目前前端生态圈如此发达，各种新语言都通过语法树的加持转换成运行时的`javascript`，例如`typescript`、`elm`、`coffeescript`、`purescript`等等。

1. 自创`dsl(Domain Specified Language)`，只要稍微想有点动态功能，就可以利用语法树模式，将自己的`dsl`精准解析并转换为我们熟悉语言的可运行程序。

总结：能精准读取或操作源码的唯一工具

使用正则加字符串模板好比大砍刀，语法树就好比手术刀，虽然难但贵在精准控制。

## 如何用

用一个新语法——修饰器做例子，因为和`java`的注解语法很像。

为了实现为一个`class`添加一个类属性名称`displayName`

新语法

```javascript
@addDisplayName('myClassIsPerfet')
export class A { ... }
```

旧语法

```javascript
function addDisplayName (name) {
  return function(myclass) {
    _A.displayName = name
    return _A
  }
}
class _A { ... }

export const A = addDisplayName('myClassIsPerfet')(_A)
```

通过`babel`的一个`plugin`：`@babel/plugin-proposal-decorators`，即可达到

如果没有语法树，用正则替换字符串的路子，呃，简直不可想象。

呵呵，在知道语法树之前我就是这么搞的，结果各种漏洞和做不到。

比如要替换一个变量或者函数名，这个名字可能有重命名的别名，在注释中的情况，在字符串中也有这种名称，还得转义，在不同上下文中重名的问题，导致正则替换完全没辙。

最终的结果就是：俺撂挑子了，这活就这样了，客户大爷们凑合用吧。

### plugin实现代码样例

上面那个转换修饰器的例子如果用语法树写转换太复杂。

下面用一个去除`debugger`的转换做例子。

```javascript
module.exports = function() {
  return {
    visitor: {
      DebuggerStatement: function(path) {
        path.remove();
      }
    }
  };
};
```

### 工具生态

#### babel && acorn

acorn => babylon => babel-parser

[引用资料](https://xiaohesong.gitbook.io/today-i-learn/front-end/webpack/babel/babelparser-he-acorn-de-qu-bie)

##### 在线示例，可以最直观的实时了解源码与语法树的对应关系

[astexplorer](https://astexplorer.net/)

不光是普通编程语言有语法树，SQL也有，可以用SQL的语法树工具精准操作SQL语句。

#### typescript

[解析流](https://jkchao.github.io/typescript-book-chinese/compiler/overview.html#%E6%96%87%E4%BB%B6%EF%BC%9Autilities)

### 何为语法与语义

```typescript
var foo: number = 'not a number';
```

语法正确，语义不合法。

#### language-server

一个内存中运行的快速反馈的进程，现代ide必备配置。

大微软出品，最初是`typescript-language-server`，目前已经扩展到各个语言的生态。

[已支持语言](https://microsoft.github.io/language-server-protocol/implementors/servers/)

`Language Server`解决了编辑器(m)和那么多语言(n)共存的问题,以前写编辑器语言插件要写 m \* n 个, LSP出现后只要写 m + n 个就可以了。

更别提每个语言还有无数的小版本！要是没有LSP，得 m \* n \* v 个插件，别说编写的人，用的都得疯，或者就是咱也互相体谅一下，凑合能用就行吧。

进程与外部交互有专用的通用协议[language-server-protocol](https://microsoft.github.io/language-server-protocol/)

也就是说，实现一种语言的`language-server`不一定必须用该语言本身，比如可以用javascript写一个lua的`language-server`，只要使用LSP协议交互数据即可。

另外一大好处是，语法补全越来越智能，能根据当前输入所在位置的上下文，精准给出补全列表。不像老式ide仅能靠语言关键字提示。

## 其他相关

前端环境中的语法树不止包含以上这些工具，还有例如：

`esprima`、`eslint-ast`、`esbuild`、`uglifyjs`、`terser`等

<details><summary>提问时间</summary>

别问，问多了我也不知道

![](http://img.pkdoutu.com/production/uploads/image/2022/01/13/20220113045451_njlcId.jpg)

</details>

## 留个作业

不光是普通编程语言有语法树，SQL也有，在线demo可以在[astexplorer](https://astexplorer.net/)查看效果。

可以做到用SQL的语法树工具精准操作SQL语句，这是使用正则无法做到的。

找一下你使用的主语言的一个SQL语法树工具，并阅读`api`文档。
