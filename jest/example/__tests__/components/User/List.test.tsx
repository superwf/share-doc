import * as React from 'react'
import { Table } from 'antd'
import { Provider } from 'mobx-react'
import { List } from '../../../src/components/User/List'
import { mount } from 'enzyme'
import * as request from '../../../src/request'
import { user } from '../../../src/stores/user'

const store = {
  user,
}

const wrap = () =>
  mount(
    <Provider store={store}>
      <List />
    </Provider>,
  )

describe('component/List', () => {
  test('组件加载时发起请求', () => {
    const spy = jest.spyOn(request, 'fetchUserList')
    expect(spy).not.toHaveBeenCalled()
    const wrapper = wrap()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  // test('组件卸载时恢复数据', () => {
  //   const spy = jest.spyOn(request, 'restoreUserList')
  //   expect(spy).not.toHaveBeenCalled()
  //   const wrapper = wrap()
  //   wrapper.unmount()
  //   expect(spy).toHaveBeenCalled()
  //   spy.mockRestore()
  // })

  test('store的list放到Table里', async () => {
    await request.fetchUserList()
    const wrapper = wrap()
    const table = wrapper.find(Table).at(0)
    expect(table.prop('dataSource')).toHaveLength(2)
  })
})
