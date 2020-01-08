import * as React from 'react'
import { Button, Input, Form, DatePicker } from 'antd'
import { emitter } from '../emitter'

interface IProps {
  onSubmit(e?: React.FormEvent<HTMLFormElement>): void
}

/** 首先想好功能点
 * 搜索条件:
 *  1 日期搜索
 *  2 姓名
 *  3 提交时需要执行的函数
 * */
export class SearchWithEvent extends React.Component<IProps> {
  componentDidMount() {
    emitter.on('search', this.props.onSubmit)
  }

  /** 如果卸载时没有移除监听，则每挂载一次绑定一个监听搜索事件
   * 既是业务逻辑错误，也是内存泄漏
   * */
  componentWillUnmount() {
    emitter.removeListener('search', this.props.onSubmit)
  }

  render() {
    const { onSubmit } = this.props
    return (
      <Form onSubmit={onSubmit}>
        <Form.Item>
          <Button htmlType="submit">Search</Button>
        </Form.Item>
      </Form>
    )
  }
}
