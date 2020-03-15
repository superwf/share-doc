import { WrappedFormUtils } from 'antd/es/form/Form'
import moment from 'moment'

import { disabledDateFrom, disabledDateTo } from '../../../src/components/ComplexSearch/helper'

describe('page/DepartmentTree/util', () => {
  it(`disabledDateFrom，业务逻辑，
     最早2018-06-01，
     时间间隔最多40天，
     from可以等于to，
     不能晚于to，
     最晚为今日
     `, () => {
    let to: moment.Moment | undefined
    /** mock一个antd的form对象 */
    const form = ({
      getFieldValue() {
        return to
      },
    } as unknown) as WrappedFormUtils

    expect(disabledDateFrom(form)(null)).toBe(false)
    // 起始日期
    expect(disabledDateFrom(form)(moment('2018-06-01'))).toBe(false)
    expect(disabledDateFrom(form)(moment('2018-05-31'))).toBe(true)
    // 今天
    expect(disabledDateFrom(form)(moment())).toBe(false)
    expect(disabledDateFrom(form)(moment().add(1, 'day'))).toBe(true)

    to = moment('2019-03-01')
    // 可以等于to
    expect(disabledDateFrom(form)(to)).toBe(false)
    // 不能晚于to
    expect(disabledDateFrom(form)(to.clone().add(1, 'day'))).toBe(true)
    // 间隔不能大于40天
    expect(disabledDateFrom(form)(to.clone().subtract(40, 'day'))).toBe(false)
    expect(disabledDateFrom(form)(to.clone().subtract(41, 'day'))).toBe(true)
  })

  it(`disabledDateTo，业务逻辑，
     最早2018-06-01之后的40天，
     时间间隔最多40天，
     from可以等于to，
     不能早于to，
     最晚为今日
     `, () => {
    let from: moment.Moment | undefined
    /** mock一个antd的form对象 */
    const form = ({
      getFieldValue() {
        return from
      },
    } as unknown) as WrappedFormUtils
    expect(disabledDateTo(form)(null)).toBe(false)
    // 起始日期
    expect(disabledDateTo(form)(moment('2018-06-01').add(40, 'day'))).toBe(false)
    expect(disabledDateTo(form)(moment('2018-06-01').add(39, 'day'))).toBe(true)
    // 今天
    expect(disabledDateTo(form)(moment())).toBe(false)
    expect(disabledDateTo(form)(moment().add(1, 'day'))).toBe(true)

    from = moment('2019-03-01')
    // 可以等于to
    expect(disabledDateTo(form)(from)).toBe(false)
    // 不能早于to
    expect(disabledDateTo(form)(from.clone().subtract(1, 'day'))).toBe(true)
    // 间隔不能大于40天To
    expect(disabledDateTo(form)(from.clone().add(40, 'day'))).toBe(false)
    expect(disabledDateTo(form)(from.clone().add(41, 'day'))).toBe(true)
  })
})
