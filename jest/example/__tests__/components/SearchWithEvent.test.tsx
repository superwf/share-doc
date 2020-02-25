import * as React from 'react'
import { SearchWithEvent } from '../../src/components/SearchWithEvent'
import { emitter } from '../../src/emitter'
import { shallow } from 'enzyme'
import { Form } from 'antd'

describe('component/Search', () => {
  const wrap = (onSubmit: (e: React.FormEvent<HTMLFormElement>) => void) =>
    shallow(<SearchWithEvent onSubmit={onSubmit} />)

  it('emitter监听search事件', () => {
    const emitterSpy = jest.fn()
    expect(emitter.listenerCount('search')).toBe(0)
    const wrapper = wrap(emitterSpy)
    expect(emitter.listenerCount('search')).toBe(1)
    const form = wrapper.find(Form).at(0)
    expect(emitterSpy).not.toHaveBeenCalled()
    const submit = form.prop('onSubmit')
    submit!({} as unknown as React.FormEvent<HTMLFormElement>)
    expect(emitterSpy).toHaveBeenCalledTimes(1)
    // 组件卸载之后，search事件上不再有监听函数
    wrapper.unmount()
    expect(emitter.listenerCount('search')).toBe(0)
    emitter.emit('search')
    expect(emitterSpy).toHaveBeenCalledTimes(1)
  })
})
