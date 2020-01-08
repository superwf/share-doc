import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Card, Table } from 'antd'
import { ColumnProps } from 'antd/es/table/interface'
import { observable, action, toJS, runInAction } from 'mobx'
import { User as UserStore, IUserRecord } from '../../stores/user'
import * as request from '../../request'

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

interface IProps {
  store?: {
    user: UserStore
  }
}

@inject('store')
@observer
export class List extends React.Component<IProps> {
  componentDidMount() {
    request.fetchUserList()
  }

  componentWillUnmount() {
    request.restoreUserList()
  }

  render() {
    const { user } = this.props.store!
    return (
      <Card title="用户列表">
        <Table columns={columns} dataSource={toJS(user.list)} />
      </Card>
    )
  }
}
