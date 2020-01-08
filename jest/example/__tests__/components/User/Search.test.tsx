import * as React from 'react'
import { Search } from '../../../src/components/User/Search'
import { Form, DatePicker, Input, Button } from 'antd'
import { mount } from 'enzyme'
import * as request from '../../../src/request'

describe('component/Search', () => {
  const wrap = () => mount(<Search />)
  let wrapper: ReturnType<typeof wrap>

  /** 使用beforeEach, afterEach简化每次测试的重复代码 */
  beforeEach(() => {
    wrapper = wrap()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('测试内部包含组件', () => {
    expect(wrapper.find(Form)).toHaveLength(1)
    const items = wrapper.find(Form.Item)
    expect(items).toHaveLength(3)
    expect(items.at(0).find(DatePicker)).toHaveLength(1)
    expect(items.at(0).prop('label')).toBe('日期')
    expect(items.at(1).find(Input)).toHaveLength(1)
    expect(items.at(1).prop('label')).toBe('姓名')
    const button = items
      .at(2)
      .find(Button)
      .at(0)
    expect(button.prop('htmlType')).toBe('submit')
  })

  it('测试提交', () => {
    const spy = jest.spyOn(request, 'fetchUserList')
    const wrapper = wrap()
    const form = wrapper.find('form').at(0)
    expect(spy).not.toHaveBeenCalled()
    form.simulate('submit')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
