import * as React from 'react'
import { Input, DatePicker, Button, Card, Form, Table } from 'antd'
import { inject, observer } from 'mobx-react'
import { User as UserStore, IUserRecord } from '../../stores/user'
import { ColumnProps } from 'antd/es/table/interface'
import { toJS } from 'mobx'

import { Search } from './Search'
import { List } from './List'
import * as request from '../../request'

interface IProps {
  store?: {
    user: UserStore
  }
}

const columns: ColumnProps<IUserRecord>[] = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
]

@inject('store')
@observer
export class User extends React.Component<IProps> {
  componentDidMount() {
    request.fetchUserList()
  }

  componentWillUnmount() {
    request.restoreUserList()
  }

  render() {
    const { user } = this.props.store!
    return (
      <Card>
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
        <Table columns={columns} dataSource={toJS(user.list)} />
      </Card>
    )
  }
}
