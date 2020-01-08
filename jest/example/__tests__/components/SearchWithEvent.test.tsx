import * as React from 'react'
import { SearchWithEvent } from '../../src/components/SearchWithEvent'
import { emitter } from '../../src/emitter'
import { shallow } from 'enzyme'

describe('component/Search', () => {
  const wrap = (onSubmit: (e: React.FormEvent<HTMLFormElement>) => void) =>
    shallow(<SearchWithEvent onSubmit={onSubmit} />)

  it('emitter监听search事件', () => {
    const spy = jest.fn()
    expect(emitter.listenerCount('search')).toBe(0)
    const wrapper = wrap(spy)
    expect(emitter.listenerCount('search')).toBe(1)
    const form = wrapper.find('form').at(0)
    expect(spy).not.toHaveBeenCalled()
    emitter.emit('search')
    expect(spy).toHaveBeenCalled()
    wrapper.unmount()
    expect(emitter.listenerCount('search')).toBe(0)
  })
})
