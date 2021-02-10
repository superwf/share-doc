# 事件监听机制分享

## 各种写法对比

### dom事件简述

```javascript
document.body.onclick = function click() {
  ... do something
}
```

缺点：只能绑定一个处理函数，逻辑都得写到这一个函数里。

优点：方便卸载，使用`document.body.onclick = null`，即可停止监听。

开始监听

```javascript
document.body.addEveltListener('click', function click() {
  ... do something
})
```

优点：多次运行可以绑定多个函数。

缺点：卸载麻烦，想要卸载还需要将函数独立提取出来。

```javascript
function click() {
  ... do something
}
document.body.addEveltListener('click', click)

// 卸载操作
document.body.removeEventListener('click', click)
```

😒 在dom事件中，一般都是绑定，手动触发很麻烦，需要

```
document.body.dispatchEvent(new MouseEvent('click'))
```

这种写法，里面的参数还要符合各种`Event`的构造函数要求，因此一般只用于实际ui交互。

### nodejs环境中的`events`模块

不是builtin，而是nodejs环境中的标准库，不用安装，使用方式如下。

```javascript
const EventEmitter = require('events')
import { EventEmitter } from 'events'
```

如果使用webpack，可以直接用以上方式使用，webpack会将该模块转换为在浏览器中运行的格式。

使用

```javascript
const emitter = new EventEmitter()

// 绑定
const myEventListener = (...args) => {
  ...
}
emitter.on('myEvent', myEventListener)

// 发射事件
emitter.emit('myEvent')

// 发射事件带参数
emitter.emit('myEvent', 1, { data: {} })

// 卸载单一事件
emitter.off('myEvent', myEventListener)

// 如果想不起来事先都绑了什么函数，干脆全都卸载
emitter.removeAllListerers('myEvent')
```

其他api也都挺有用的，有需要自行文档。

优点：不需安装直接用，api短，表义强。如果编译到web环境体积也很小。

缺点：卸载单独事件还是麻烦，需要事先将监听函数单独命名。

### 使用`getter`、`setter`或`Proxy`的监听模式

在这个层次上，vue与mobx原理一模一样，都经历了从`getter/setter`到`Proxy`的底层重写过程。

#### 先说Vue的例子

vue的例子
```javascript
// 绑定事件，监听data.name的更新
{
  data() {
    return { name: 'xxx' }
  },
  watch: {
    name: (newVal, oldVal) {
      ...
    },
  }
}

// 触发事件，在组件内部执行
this.name = 'yyy'
```

好处是组件自动开始监听，卸载时自动停止监听，不用手动管理卸载，也没有管理卸载的地方。

另一种模式，根据需要手动监听某个值的变化

```javascript
// 绑定监听
const unwatch = vm.$watch('name', (newVal, oldVal) => { ... })
// 卸载监听
unwatch()
```

优点，可以使用编码的方式，可以根据逻辑更自由的组合，而不是像第一个vue的例子中那样使用配置的方式。

缺点：都只能运行在`vue`环境中。

在vue3中有改善，将数据监听模块分离为单独模块。

其实vue的渲染默认都是与所有内部数据的变化绑定监听的，等于是开启了所有监听数据的不可见的watch模式，仅针对模板中的`render`。

#### 再对比mobx的例子

```javascript
import { observable, observe } from "mobx"
// 定义一个可监听数据，对比vue中定义data的行为
const box = observable({ name: 'xxx' })

// 监听box的xxx属性的变化，返回一个停止监听函数
// 与vue的$watch模式最接近
const disposer = observe(box, 'xxx', ({ newValue, oldValue }) => {
  ...
})

// 触发监听
box.name = 'yyy'

// 卸载监听
disposer()
```

优点：纯数据驱动模块，不依赖ui，可以在各种环境自由组合。

缺点：在代码自由的同时，也比较底层，需手动处理各种逻辑。

## 各种套路对比

| 环境 | 开始监听 | 触发监听 | 卸载监听 |
| --- | --- | --- | --- |
| dom | addEventListener | dispatchEvent | removeEventListener |
| nodejs event | on | emit | off | 
| vue | $on | $emit | off | 
| vue | 配置watch属性 / this.$watch | this.name = 'yyy' | 自动，或执行$watch返回的unwatch |
| mobx | observe | box.name = 'yyy' | 执行observe返回的disposer |

通过上表详细对比，发现，第一、二、三几乎就是同一种模式，只是api的名字有点不同而已。面向对象思维，通过对象的监听与卸载监听方法来实现。

第四、五也几乎就是同一种模式。开始监听的函数都会返回一个停止自身行为的函数。

其实第一种模式很容易封装为第二种模式。以nodejs的events模块为例子。

```javascript
const startListen = (eventName, listener) => {
  emitter.on('myEvent', listener)
  return () => {
    emitter.off('myEvent', listener)
  }
}

// 启动监听
const stopListen = startListen('myEvent', () => { ... })
// 停止监听
stopListen()
```

无论是第一种，还是第二种模式，提供的都是一种持续开启某种行为的模式，而不像一般函数只执行一次。只要是持续开启，就必须有结束的开关。

## 练习题

* 判断输出顺序

```
document.body.addEventListener('click', () => {
  console.log(1)
})
document.body.dispatchEvent(new MouseEvent('click'))
console.log(2)
```

也可以将其中的事件监听机制，换成node环境的`events`，或vue的事件，或mobx的监听机制试一试。

🍀 最后，祝各位在实际编码中，一定不要忘了卸载监听环节🥂。
