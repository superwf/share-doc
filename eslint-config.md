# ESLint 的各种配置

## 全局配置

### 配置文件

`.eslintrc`、`.eslintrc.js`、`.eslintrc.json`、`.eslintrc.yml`等等

这么多怎么配置，到底用哪个？

原来来自[cosmiconfig](https://www.npmjs.com/package/cosmiconfig)

### package.json 配置

```json
{
  "eslint": { ... }
}
```

### 文件夹中的局部全局配置

比如在全局中，禁用了`console`，但在测试环境，仍然时常需要`console.log`，则在防止测试文件的文件夹，例如`__tests__`中，添加一个配置

例如`__tests__/.eslintrc`

```json
{
  "rules": {
    "no-console": 0
  }
}
```

就可以做到该规则仅在该文件夹内生效

### 总配置中的覆盖配置

如果只想某些规则只针对某些特定文件呢？

比如在一些`nodejs`中运行的脚本，需要用`require`语法，不能用源码中的`import`语法

```json
"overrides": [
    {
      "files": ["script/*.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": 0
      }
    }
  ]
```

### 忽略配置

如同`.gitignore`一样，也有`.eslintignore`，其规则与git的一样，以文件与文件夹为单位进行忽略。

配置支持`glob`规则例如

```txt
.eslintrc.js
service/*.js
```

## 局部配置

某个文件里只有一处想跳过规则？好我改一下全局配置。

但这样做会使该一些规则在整体项目中都失灵，如果有`code-review`，容易被同事diss🙈

### 在当前文件生效

在当前文件顶部，使用注释

```ecmascript
/* eslint-disable */
```

简单粗暴，但有效。

问题就是当前文件所有规则都不灵了，自动美化代码也没啦。

所以添加在后面要加上具体的规则，使其他规则仍然生效，多个规则用逗号分隔。

```ecmascript
/* eslint-disable no-console,no-debugger */
```

### 仅在下一行生效

```ecmascript
/* eslint-disable-next-line */
```

同样的问题，也是会禁用下一行的所有检查规则，使自动格式化失效。

最好还是加上具体规则，多个规则用逗号分隔

```ecmascript
/* eslint-disable-next-line no-console,no-debugger */
```

### 多行生效

```ecmascript
/* eslint-disable */
console.log(xxx)
console.log(yyy)
/* eslint-enable */
```

同样推荐指定具体规则，多个规则用逗号分隔

```ecmascript
/* eslint-disable no-console */
console.log(xxx)
/* eslint-enable no-console */
```

<!-- 
用心计较般般错，退后思量事事宽。
书到用时方恨少，事不经过不知难。
-->
