# B端UI总结

## 为什么有这些原则

网上现成设计原则例如 [ant design](https://ant.design/docs/spec/introduce-cn) ，一抓一大把，这些原则我们都是要看的。

我总结的这些，并不是对已有原则的颠覆，只是对这些大设计原则未覆盖地方的一些补充。

对一些我们在平常编码是，可左可右的设计，给出明确的规则，并解释为什么应该这么做。

遵循这些设计原则，可以使我们的B端页面更有工程感，更能形成逻辑自洽。

其中有难有易，有些原则难于实现，或者难于在每个地方都实现，但大多数都是较容易实现的，我们务必要从容易的原则着手，来改善我们的作品。

    以下内容用⭐表示难易度，⭐越多越难。

## 顶部搜索表单

### 展示

* ⭐ 搜索按钮右置，且放到最右，适当加宽。理论规则是：让操作频次高的按钮，更容易被点击。不光是搜索按钮，各种提交按钮最好也都居右。

    重置按钮，我认为 ~~几乎~~ 没用，不加最好。

* ⭐⭐ 搜索表单项目，通过css媒体查询，应做到适当自适应，PC端只使用大屏和超大屏就行。

* ⭐⭐⭐ 搜索表单左右边距，与下面的组件形成对齐。

* ⭐⭐⭐ 表单项文字长度不固定，除文字外剩余内容填满所在单元。

* ⭐ 表单项如果有换行，行距不要太大，要紧凑。

* ⭐⭐ 表单项内容为异步加载，表单项自身应有`loading`状态。

* ⭐⭐ 表单项内容为异步可搜索的，必须加`debounce`，不仅仅是为了减少后端接口请求频率，没有`debounce`，也必然会造成异步错误，可能先请求的数据后返回覆盖最新输入对应的结果。

### 操作

* ⭐ 如果有根据搜索条件的导出，应和放在搜索表单内，更能强化依赖搜索条件过滤的逻辑。

* ⭐⭐ 搜索表单不能仅靠提交按钮触发，在输入查询内容后回车也应触发表单提交。

* ⭐⭐⭐⭐⭐ 搜索内容提交后，通过`url`的`query`持久化，页面刷新后搜索条件回填。

* ⭐ 表单提交后，表单已经添加`loading`状态。

* ⭐⭐⭐⭐⭐ 表单项较多，应有高级定制功能，可收缩不常用项目。

## 表格

* ⭐ 数据请求中，必须有loading状态。

* ⭐⭐ 组件卸载时，必须清空数据，避免重新进入页面会有旧数据问题。

* ⭐ 层级内容，使用树状展示。

    ```text
    【测试类目】测试分类012
        └─测试分类二级
            └─测试分类勿动
    ```

* ⭐ 相关内容，放到一个单元格，尽量缩减横向宽度，例如：

| 时间 | Band |
| --- | --- |
| 开始: 2022-01-01<br />结束: 2022-01-01 | GMV: A,B<br />PV: C,D<br />UV: E,F |

* ⭐ 所有数字类型，全部右对齐，这个是我从UI设计的要求那学的，而且觉得很有道理，因为右对齐更有利于数据的直观对比。

* ⭐ 较大数字，使用逗号分隔格式化显示，例如：1000,000,000

* ⭐ 小数点保留位数做到统一，例如金钱都保留2位，百分比都保留2位，具体保留几位，应在应用内或页面内做到统一。

* ⭐ 经常需要复制的值，例如SKU，需要增加快捷复制功能。

* ⭐ `erp`可通过点击直接打开咚咚，或者其他一些软件协议，能直接通过点击打开的，就尽量避免复制操作。

* ⭐ 表示状态，或操作等固定长度的内容，应居中显示。

* ⭐ 表示`bool`状态的内容，可稍微通过颜色区分成功/失败。

* ⭐⭐⭐ 例如商品名称这种可能很长的内容，应通过css自动剪裁，过多的内容自动省略，同时也必须添加通过鼠标浮动可展示完整内容的功能。

* ⭐ 有一些很容易重名的数据，务必将对应的`id`同时显示出来，例如部门、品牌。

* ⭐⭐ 表头内的术语名词，尤其是一些奇怪的领域名词，最好添加对应的解释，通过鼠标浮动动作展示完整解释。

* ⭐ 所有表头都居中显示比较好看。

* ⭐ `table`内容过多有纵向滚动时，表头应能自动固定在顶部。`antd v4`以上的情况下，一个属性能搞定。

* ⭐⭐ `table`内容过多有翻页时，翻页组件相对定位在底部，不用滚动到最下才能翻页。

* ⭐⭐⭐⭐⭐ `table`字段过多时，增加自动定制表格内容功能，包括固定，排序，显示/隐藏字段。

* ⭐⭐ 表格内的数据，如果有单字段更新的操作，在行内更新就可以，避免弹出完整表单。

    ⭐⭐⭐⭐ 更新后要重新请求数据，最好是只更新当前这一行，如果困难就刷新整个列表，记得刷新要带当前的搜索和分页参数。

* ⭐ 表格批量操作相关按钮，应放在表头左侧，距离例批量选择较近，表明其操作关联性。

    ⭐⭐ 批量操作按钮应根据选中数据，或选中数据状态自动 disable / enable 。

    ⭐ 如果有比较复杂的判断数据是否可进行某种操作的逻辑，应在对应按钮旁，或独立区域写明规则。

    ⭐ 其他与表格数据多选无关的操作按钮，应放到表格右侧，例如“创建xxx”。

    ⭐⭐ 表格数据写操作，例如删除，必须有二次确认。

## 提示信息

* ⭐ 非常简单的提示信息，例如“操作成功”，用`message`弹出，驻留时间很短。查看[antd message](https://ant.design/components/message-cn)

* ⭐ 较复杂的提示信息，例如“xxxxx操作失败原因：xxxx”，用`notification`弹出，要让人看清楚具体内容，驻留时间长或只能手动关闭。查看[antd notification](https://ant.design/components/notification-cn)

## 弹层

* ⭐ 纵向很长的内容，用`Drawer`，`Drawer`不适合显示很宽的内容。

* ⭐ 其他大多数情况用`Modal`。

* ⭐ 确认式弹层分两种，一种是无参数确认，例如删除单条数据，用`Popover`；一种是带参数确认，适合使用弹出`Modal`内附参数表单。,

* ⭐⭐⭐ 如果弹层内容针对的是具体数据，弹层要标明当前弹层与对应操作数据的关系，例如点击`table`内的某行编辑数据，就要在该弹层标题或内容中标明该数据名称或ID。
