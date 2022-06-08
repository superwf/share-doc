# 关于路径别名的一切

## 缘起

帮朋友调试一个webpack的fast refresh，该加的都加了，可怎么也不生效。(关于webpack的fast refresh，打算另写一个[独立主题](./webpack-fast-refresh.md))

最后发现控制台中的hot update后面提示的文件路径很奇怪，其他正常的项目应该是`node_modules/webpack/hot/log.js`。

但这个项目却定位到了一个莫名其妙的文件`html-entities/....`

凭我老油条的直觉，感觉这个是路径别名引起的，最后修正了路径别名，果然fast refresh就正常了。

后来想起来之前好像写过这个主题，想找出来开个技术分享，但是翻看了一下发现之前写的太简略了，除了自己没人懂。

[老文档](https://superwf.github.io/p1494/)，没啥看头。

## 为什么需要路径别名？

引入模块时，经常需要 import ‘../../../xxxx’ 这种跨多级相对路径的引用。

一个两个还行，多了简直让人抓狂，而且这样写之后固定了文件的相对位置，只要一调整文件路径，这些里面的相对路径全都要重写。

## 路径别名都有哪些

先说说我见过的，webpack、babel、eslint、tsconfig、rollup、vite、jest

每种工具都有自己的一套alias写法，但写过就知道，大同小异。

刚开始接触的时候，这些东西的关系错综复杂，能搭配到一起用就不错了，哪里缺路径别名，就加到哪里。

经过长期折腾，终于开始统一所有这些路径别名，all in one。

[关于配置文件格式](https://superwf.github.io/p1476/)

## 挨个过一遍这些工具的别名配置格式

* webpack，在配置的resolve中配置

    ```typescript
    {
      resolve: {
        alias: {
          src: path.resolve(__dirname, 'src/'),
        },
      }
    }
    ```
