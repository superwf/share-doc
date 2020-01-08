import * as React from 'react'
import { Button, DatePicker, Form, Row, Col } from 'antd'
import { WrappedFormUtils } from 'antd/es/form/Form'

import { disabledDateFrom, disabledDateTo } from './util'

export interface IProps {
  form: WrappedFormUtils
}

export class ComplexSearch extends React.Component<IProps> {
  /** 大多数情况下会这么写 */
  /*
  public render() {
    const { form } = this.props
    return (
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={6}>
            <Form.Item label="开始日期">
              {form.getFieldDecorator('from')(
                <DatePicker
                  disabledDate={(d: moment.Moment | null) => {
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
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="结束日期">
              {form.getFieldDecorator('to')(
                <DatePicker
                  disabledDate={(d: moment.Moment | null) => {
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
                  }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={6} offset={6}>
            <Form.Item>
              <Button type="primary">Search</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
    }*/

  /** 重构之后，将校验逻辑全部移出 */
  public disabledDateFrom = disabledDateFrom(this.props.form)

  public disabledDateTo = disabledDateTo(this.props.form)

  public render() {
    const { form } = this.props
    return (
      <Form layout="horizontal">
        <Row type="flex">
          <Col span={6}>
            <Form.Item label="开始日期">
              {form.getFieldDecorator('from')(<DatePicker disabledDate={this.disabledDateFrom} />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="结束日期">
              {form.getFieldDecorator('to')(<DatePicker disabledDate={this.disabledDateTo} />)}
            </Form.Item>
          </Col>
          <Col span={6} offset={6}>
            <Form.Item>
              <Button type="primary">Search</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}
