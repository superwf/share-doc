# 如何编写一个健壮的 npm 包

## 无脑发布 npm

用`npm init`新建一个包，改把改把，然后来个`npm publish`，so easy

Too young too native, baby!

## 健壮性

### 有否配套测试用例

* 有可运行的配套测试用例。

* 在主页上有可见的测试覆盖率统计，让人可以放心使用。

### 有否自动化版本管理

* 使用`husky`等规范提交日志。

* 使用`standard-version`等自动生成`CHANGELOG`并根据规则自动提升版本号。

## 通用性

`package.json`中配置多环境适配

利用`.npmrc`指定安装源，用于当前项目与你的全局配置区分开。

否则当前项目很可能指定的内部`npm`源，导致外部用户无法利用`lock`文件安装。

例如

```text
registry=https://registry.npmjs.org/
```

在`package.json`中指定发布仓库，在当前包与全局配置不一致时非常必要。

```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  }
}
```

## 普及性

### 文档

使用`.markdownlint`规范自己的`markdown`文档，否则很容易写飞了。

### 配套用例

* 一个方法是在项目中自带一个可运行的样例，让人`clone`之后运行指定命令即可查看样例。

* 更好一些，部署一个可以在线查看的例子，并在主文档上附上直达链接。

* 更进一步，项目增大之后，需要说明的地方越来越多，一个`README`已经太长。使用`docusaurus`等类似的工具部署一个独立的文档站点。

## 针对性

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

### 作为前端库

`package.json`中指定`main`字段。
