# 以git为核心的前端发布工作流

## 使用yarn代替npm

## Part 1: commotlint

### 提交格式

* git通用提交格式规定如下

```text
  type(scope): subject
  // 空行
  body
  // 空行
  footer
```

### type含义

scope, body和footer可选，type和subject必填。

* 针对 type，业界通用的选项如下

  feat: 特性

  build: 构建相关的修改

  ci: 持续集成相关的修改

  fix: bug修正

  docs: 文档

  style: 编码风格修改

  perf: 性能优化

  refactor: 和特性修正无关的重构，例如重命名

  test: 测试

  revert: 由于上面的某个错误提交，生成恢复代码的一次提交

  chore: 不包含在上面选项中的其他情况

  [阮一峰教程](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html) 其中第四、五部分内容已经过期，已有成型工具，不需要完全手动处理

  [commitlint参考](https://github.com/conventional-changelog/commitlint)

* ⚠️  注意: 不同的lint规则，可选的type可能稍有不同，以下都以conventional的规则集为规则集进行

### 提交校验工具

* [commitlint](https://www.npmjs.com/package/commitlint) 检测每次提交的格式核心代码。

* [commitlint-cli](https://www.npmjs.com/package/@commitlint/prompt-cli) commitlint的命令行工具。

* [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional) 一种验证规则集
  相似的规则集可见[conventional-changelog packages](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages)
以下都以`conventionalcommits`为默认规则集合

准备示例项目:

```sh
mkdir example
cd example
yarn init -y
```

<video src="./videos/initExample.ogv" controls="controls"></video>

安装:

```sh
yarn add -D commitlint @commitlint/prompt-cli @commitlint/config-conventional
```

<video src="./videos/installCommitlint.ogv" controls="controls"></video>

配置:

`commitlint.config.js`，放到项目根目录

```javascript
module.exports = { extends: ['@commitlint/config-conventional'] }
```

<video src="./videos/configCommitlint.ogv" controls="controls"></video>

运行:
安装并配置完成后，可以用命令实验，会出现规则校验失败的提示

```bash
echo 'xxx: yyy' | npx commitlint
```

<video src="./videos/testCommitlintAndFail.ogv" controls="controls"></video>

### 辅助工具[commitizen](https://www.npmjs.com/package/commitizen)

一个命令行下，用交互的方式生成合规的提交格式的工具，对于还不熟悉提交消息格式的人起到自动生成合规消息的作用，可有可无。
安装过程

```sh
yarn add commitizen
yarn add cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > .czrc
```

<video src="./videos/installCommitizen.ogv" controls="controls"></video>

安装完毕之后，即可使用`git-cz`命令代替`git commit`提交。

经过了上面对提交文字的规范，项目的提交记录就已经达到了可以自动生成changelog的标准。

<video src="./videos/runCommitizen.ogv" controls="controls"></video>

## Part 2: git hooks

### 工具

将commitlint绑定到git的commit-msg提交钩子上，在每次生成提交前调用commitlint检测提交文字格式，不通过验证则无法生成提交。

* [yorkie](https://www.npmjs.com/package/yorkie)

安装yorkie:

```sh
yarn add yorkie
```

在package.json文件中添加提交消息验证

yorkie配置，在package.json中

```javascript
"gitHooks": {
  "commit-msg": "npx commitlint -E GIT_PARAMS"
}
```

* [husky 🐶](https://www.npmjs.org/package/husky)

安装:

```sh
yarn add husky
```

<video src="./videos/installHusky.ogv" controls="controls"></video>

husky配置，在package.json中

```javascript
"husky": {
  "hooks": {
    "commit-msg": "npx commitlint -E HUSKY_GIT_PARAMS"
  }
},
```

<video src="./videos/configHusky.ogv" controls="controls"></video>

两个工具都不错，husky的错误提示信息可能更好一些

🐾 必须先将项目纳入git管理，再安装husky/yorkie，否则不会安装git hooks

### 补充说明: git hooks分为服务器hook和本地hook，此处讲的全部都是本地hook。

详细的hooks说明需要看官方文档，想不起来的时候，可以快速看一下当前项目里的`.git/hooks`文件夹，里面的文件就是当前本地git支持的hook，这些文件都是见名知意的。

<video src="./videos/viewGithooksDir.ogv" controls="controls"></video>

* 按照这种设计模式，我们还可以在其他的git生命周期中注入hook，例如pre-commit/pre-push自动运行测试等，测试不通过则阻止提交/推送。

## Part 3: CHANGELOG

以上的内容，为git提交内容添加各种校验，其目的就是为了自动提取提交记录，

并根据git tag的版本号，生成当前发布版本的CHANGELOG.md。

* 工具[conventional-changelog-cli](https://www.npmjs.com/package/conventional-changelog-cli)

安装:

```sh
yarn add conventional-changelog-cli conventional-changelog-conventionalcommits -D
```

<video src="./videos/installConventionalChangelog.ogv" controls="controls"></video>

执行:

```sh
npx conventional-changelog -p conventional -i CHANGELOG.md -s -r 0
```

<video src="./videos/runConventionalChangelog.ogv" controls="controls"></video>

conventional-changelog有很多可调整的参数，具体参考[conventional-changelog文档](https://www.npmjs.com/package/conventional-changelog-cli)即可。

* 关于版本号的讲解，一般格式为1.2.3，分为三段，为主版本号，次版本号，修正版本号。

    >>
      主版本号  当前程序经过重构，生成了与之前版本不兼容的api，则主版本号升级。
      次版本号  每次新feature的添加，即升级次版本号。
      修正版本号 每次bug修正引起的升级，即升级修正版本号。
      在首个稳定版本发布之前，会有试用版标识
      例如: `2.0.0-beta.1`，`2.0.0-beta.2`等，从beta进化到正式版的第一个版本应为`2.0.0`。

* 每次发布，需要变更版本号，才需要生成changelog，而不是经常随时生成。

## Part4 版本管理自动化工具

### standard-version

除发布之外的全自动化工具

自动收集上一次打tag的version到当前为止是否有feat和fix
如果有任何一个feat，则自动升级minor版本号

  如果没有feat，有fix，则自动升级patch版本号

  如果有BREAKING CHANGE，则自动升级major版本号

  生成新版本号

  将之前收集git提交记录汇总，生成最新`CHANGELOG.md`

  之后，将新版本号写入`package.json`，将`package.json`与`CHANGELOG.md`，添加到git，自动生成一个内容为`chore(release): x.x.x`的提交，将新版本号添加到本次提交上

安装:

```bash
yarn add standard-version
```

<video src="./videos/installStandardVersion.ogv" controls="controls"></video>

执行:

```bash
npx standard-version
```

* ⚠️  该工具将所有小于1.0.0的版本都视为非正式版本，可以理解为预发版本，或beta版。在小于1.0.0时所有BREAKING CHANGE都不会升主版本号，只会升级minor版本号。在小于1.0.0时所有feat都不会升minor版本号，只会升级patch版本号。

* ⚠️  如果上次与本次发布之间没有可以升级的git tag，则会自动将patch版本号升级

<video src="./videos/runStandardVersionVersionLessThan1.ogv" controls="controls"></video>

<video src="./videos/runStandardVersionVersionGreaterThan1.ogv" controls="controls"></video>

自动生成新的CHANGELOG.md

<video src="./videos/autoGenerateChangelog.ogv" controls="controls"></video>

### 与npm发布流程配合

在`package.json`中添加发布hook

例如，在prepublishOnly中添加，先升级版本，再打包，之后自动发布到npm仓库

```json
{
  "scripts": {
    "release": "npx standard-version --no-verify",
    "prepublishOnly": "npm run build && npm run release"
  }
}
```

其中 --no-verify表示由standard-version执行的git commit，需要跳过git hook的验证

* 🐾 将standard-version的执行放到编译与测试等的后面，否则如果先生成了版本号，但测试或编译失败了，需要手动git回滚，删除CHANGELOG内容，去掉git tag等一系列错误; 或者省事点，忽略失败的版本号，修改后下次再发布。

## Part 4: 总结以上所有工具之间的关系

![git release flow](./git-release-flow.png)
