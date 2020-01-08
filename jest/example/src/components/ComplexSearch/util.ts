import { format } from 'url'

import { WrappedFormUtils } from 'antd/es/form/Form'
import moment from 'moment'

/**
 * @remarks 搜索起始日期限制
 * 不能早于2018-06-01
 * 不能晚于to
 * 不能晚于当前日期
 * 与to之间的间隔不能大于40天
 * */
export const disabledDateFrom = (form: WrappedFormUtils) => (d: moment.Moment | null) => {
  if (d) {
    if (d.isAfter(moment(), 'day')) {
      return true
    }
    if (d.isBefore('2018-06-01', 'day')) {
      return true
    }
    let to = form.getFieldValue('to') as moment.Moment
    if (to) {
      to = to.clone()
      return d.isAfter(to, 'day') || d.isBefore(to.subtract(40, 'days'), 'day')
    }
  }
  return false
}

/**
 * @remarks 搜索结束日期限制
 * 不能晚于当前日期
 * 与from之间的间隔不能大于40天
 * 如果from没有选择，不能早于2018-06-01之后的40天
 * */
export const disabledDateTo = (form: WrappedFormUtils) => (d: moment.Moment | null) => {
  if (d) {
    if (d.isAfter(moment(), 'day')) {
      return true
    }
    if (d.isBefore(moment('2018-06-01').add(40, 'day'), 'day')) {
      return true
    }
    let from = form.getFieldValue('from') as moment.Moment
    if (from) {
      if (d.isBefore(from, 'day')) {
        return true
      }
      from = from.clone()
      return d.isAfter(from.add(40, 'days'), 'day')
    }
  }
  return false
}
