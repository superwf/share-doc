# 跨React/Vue技术栈解决方案

## 介绍

* React，使用JSX语法，ts支持较好，虚拟DOM

* Vue，使用独有vue格式模板，利用es5的getter/setter实现响应式，虚拟DOM

* Web Component，浏览器原生支持，其内部的shadow dom从v0升级到v1，从2011年发布至今，已经进入了一个支持相对较为普遍的技术。（IE作为可忽略因素）

## 需要解决的跨技术栈问题

* React/Vue组件层级无论运行环境与实现都完全不同，即使业务逻辑相同的组件，也需要在两套环境中实现两次，工作量至少翻倍

* 这两种框架都使用props向下层组件传递任意结构的数据。在都是框架组件的时候这种机制并没有问题，但在直接使用dom元素时，dom元素从上层React/Vue组件中接收到的属性数据，都会被dom层直接简化为基本类型，即String，Boolean这两种格式，因此我们在前端开发时，在探测dom属性时，经常会看到`xxxx="[object object]"`这种情况

* 使用Web Component构造的自定义dom，也面临着上面这种问题，在数据结构被限制的情况下，是无法构造出真正可用的跨技术栈组件的

## Web Component解决方案

解决方案仍然是[Web Component](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

Web Component是对原生DOM的自定义操作，api很少，大概阅读一下很快就能掌握
🍌 --- 🦍 --- 🌴

大家可以想象成类似于(正则表达式30分钟入门教程)

其中一个重要特性`observedAttributes`，可以达到定制需要监控属性值的目的，与React/Vue通过props传递数据流的思想是一致的

此外还有如下几个优势，[摘自](https://www.cnblogs.com/ibufu/p/5641031.html)

* 互操作性 — 组件超越框架而存在，可以在不同的技术栈中使用
寿命 — 因为组件的互操作性，它们将有更长的寿命，基本不需要为了适应新的技术而重写
移植性 — 组件可以在任何地方使用，因为很少甚至没有依赖，组件的使用障碍要明显低于依赖库或者框架的组件

### 最初的灵感来源于`preact`

* [preact](https://github.com/preactjs/preact/blob/master/src/diff/props.js#L115)

### 针对React/Vue双方最终都使用虚拟DOM最终更新真实dom节点属性的情况，需要对比双方源码，比较其对真实dom的属性是如何操作的

* [react](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/DOMPropertyOperations.js#L145)

  * react对自定义dom的setAttribute的value进行了toString处理，需要额外处理一下
  TODO: 为react提供了一层额外的封装组件，通过ref向dom传递数据，来达到调用行为统一。

* [vue](https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/modules/attrs.js#L76)

于是有了如下中台项目的具体实现----[scf-ui](http://git.jd.com/scf/scf-ui/blob/master/packages/ui/src/components/scfElement.tsx)

## shadowDom内的dom操作

* ~~Vue与Mobx两个备选，最后决定选Vue，直接有virtual-dom支持~~
~~Mobx体积更小，但需要额外管理dom，势必需要引入React，会增加复杂度。~~

  * preact牺牲了很多react的兼容性与性能优化考虑来达到代码最小化

  * TODO 开发以react与vue为基础的双方案web component开发方案

### CSS

* 项目内样式使用less，但_不_依赖less变量配置样式

* 使用原生`css variable`特性来达到实时配置样式的效果

### 问题 💣

* preact的props如果传了false，会被自动丢弃

* 如果使用react来实现shadowRoot内部行为，事件机制会失效，需要通过`retargetEvents`来补全，但会挂载太多事件有很大性能问题

* preact的enzyme不能与typescript一起工作，enzyme的mount等函数不能加载preact组件

* preact的onTransitionEnd不能工作，必须使用全小写ontransitionend来挂载事件
  [issue](https://bugs.chromium.org/p/chromium/issues/detail?id=961193)

* preact内的事件默认都会自动冒泡，需要手动调用stopPropagation

* preact事件对象需要注意target与currentTarget，否则不能获取到当前dom上的对应属性
