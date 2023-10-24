# 基于antd表单的类型约束

## 概述

大多数情况接口数据类型与表单提交数据类型虽然大部分属性名称与类型是相同的，但很少能做到完全统一。

我在之前的工作中经常为了方便，直接使用接口数据类型代替表单数据类型，在遇到不统一的情况时会使用`any`强制忽略类型校验。

后来经过自省与思考，我认为这中过度使用`any`的习惯，会引起各种隐藏bug，应该被修正！

因此为表单提交数据 **单独** 定义类型就非常必要。

## 类型解说

### 接口定义的请求体类型

请求数据类型

```typescript
type RequestBody = {
   name?: string
   id?: number
   groupIds?: number[]
   startDateFrom?: string // YYYY-MM-DD
}
```

### 表单提交数据类型定义

```typescript
type FormValue = {
  name?: string
  id?: number
  groupIds?: string
  startDateFrom?: Moment
}
```

有了该类型，我们可以方便的将该类型使用在表单实例上

```typescript
const [form] = Form.useForm<FormValue>()
```

#### 类型复用优化

如果表单的数据类型和接口提交的数据类型完全一致，当然可以共用一个，但现实世界这种情况几乎没有。

大多数情况是可以复用一些接口的属性到表单的数据类型中，例如上面的两个数据结构，其中 name、id 属性是相同的，则FormValue 可以优化为

```typescript
type FormValue = Pick<RequestBody, 'name' | 'id'> {
  groupIds?: string
  startDateFrom?: Moment
}
```

### Form.Item 限定 name 优化

应用此时表单组件的`name`约束就应为我们自定义的表单数据类型`FormValue`，定义约束组件

```typescript
const FormItem = Form.Item as React.FC<
  Omit<FormItemProps, 'name'> & {
    name: keyof FormValue
  }
>
```

应用该约束组件

```typescript
<FormItem label="名称" name="name"> ...
```

### 数据转换

在表单的`onFinish`提交过程中，需要一个将 **FormValue(表单数据)** 转换为 **RequestBody(提交数据)** 的函数，类型定义如下：

```typescript
const formValueToRquestBody = (values: FormValue): RequestBody => {
  return {
    name: values.name,
    id: values.id,
    groupIds: values.groupIds.split(',').map(n => Number(n)),
    startDateFrom: values.startDateFrom?.format('YYYY-MM-DD'),
  }
}
```

#### 复杂表单类型

复杂表单有些表单数据并非一层的`key => value`，而是多层树状或数组结构。

例如：提交数据结构

```typescript
type FormValue = {
  name: string
  rule: {
    min: number
    max: number
  }
}
```

表单中关于rule 的写法为：

```typescript
<Form.Item name={['rule', 'min']}>
```

这种情况下，`name`不再是简单的字符串，应该如何用类型约束？

如果可以我希望使用类型工具，兼容多层表单数据结构，但一直没成功。

我目前的方法是，为该表单层级安排一个专用类型，该方法会有些写的麻烦，但胜在能准确的定义好类型。

我在采用该方法校验表单name数据时发现了几个很难发现的拼写错误，提前制止了测试同学提bug过来。

例如为`rule`属性定义单独的`RuleFormItem`：

```typescript
import type { FormItemProps } from 'antd'

const RuleFormItem = Form.Item as React.FC<
  Omit<FormItemProps, 'name'> & {
    name: ['rule', keyof FormValue['rule']]
  }
>
```

调用时

```typescript
<RuleFormItem label="min" name={['rule', 'min']}> ...
```

此时数组中的 rule 与 min 都能收到类型的保护。

### 泛型抽象

```typescript
/** 将表单的name作为强类型校验约束 */
export type TypedFormItem<T> = React.FC<
  Omit<FormItemProps, 'name'> & {
    name: T
  }
>
```

#### 应用泛型

```typescript
const RuleFormItem = Form.Item as TypedFormItem<keyof FormValue>
```
