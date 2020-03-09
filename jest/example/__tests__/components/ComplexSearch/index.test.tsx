import * as React from 'react'
import { mount } from 'enzyme'
import { Form, DatePicker } from 'antd'

import { ComplexSearch, IProps } from '../../../src/components/ComplexSearch'
import { disabledDateFrom, disabledDateTo } from '../../../src/components/ComplexSearch/util'

test('测试日期校验逻辑正确传入', () => {
  const FormWrapper = Form.create<IProps>()(({ form }) => <ComplexSearch form={form} />)
  const app = mount(<FormWrapper />)
  const datePickers = app.find(DatePicker)
  expect(datePickers).toHaveLength(2)
  const instance = app.find(ComplexSearch).instance() as ComplexSearch
  expect(datePickers.at(0).prop('disabledDate')).toBe(instance.disabledDateFrom)
  expect(datePickers.at(1).prop('disabledDate')).toBe(instance.disabledDateTo)
  app.unmount()
})
