import * as React from 'react'
import { mount } from 'enzyme'

import { DisplayDepartmentNames, IProps } from '../../src/components/DisplayDepartmentNames'

describe('component/DisplayDepartmentNames', () => {
  const department: IProps = {
    level1Name: 'aaa',
    level2Name: 'bbb',
    level3Name: 'ccc',
  }
  const wrap = () => mount(<DisplayDepartmentNames {...department} />)

  it('显示多级部门名称', () => {
    const app = wrap()
    expect(app.html()).toMatchSnapshot()
    app.unmount()
  })
})
