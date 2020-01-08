import * as React from 'react'
import { Button, Input, Form, DatePicker } from 'antd'
import * as request from '../../request'

/** 首先想好功能点
 * 搜索条件:
 *  1 日期搜索
 *  2 姓名
 *  3 提交时需要执行的函数
 * */
export class Search extends React.Component {
  render() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault()
          request.fetchUserList()
        }}
      >
        <Form.Item label="日期">
          <DatePicker />
        </Form.Item>
        <Form.Item label="姓名">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Search</Button>
        </Form.Item>
      </Form>
    )
  }
}
