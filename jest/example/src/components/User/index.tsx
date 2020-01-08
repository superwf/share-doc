import * as React from 'react'
import { Card } from 'antd'
import { inject, observer } from 'mobx-react'
import { User as UserStore } from '../../stores/user'
import { ColumnProps } from 'antd/es/table/interface'

import { Search } from './Search'
import { List } from './List'

interface IProps {
  store?: {
    user: User
  }
}

@inject('store')
@observer
export class User extends React.Component<IProps> {
  render() {
    const { user } = this.props.store!
    return (
      <Card>
        <Search />
        <List />
      </Card>
    )
  }
}
