import { logout } from '../src/logout'

describe('logout', () => {
  it('assign', () => {
    const spy = jest.fn()
    /** 屏蔽原始的window.location */
    const originLocatoin = window.location
    Reflect.defineProperty(window, 'location', {
      get() {
        return {
          assign: spy,
        }
      },
    })
    logout()
    expect(spy).toHaveBeenLastCalledWith(`/api/logout?returnUrl=${encodeURIComponent(location.href)}`)

    /** 退出的时候必须清理对外部环境的更改，否则会影响其他测试 */
    Reflect.defineProperty(window, 'location', {
      get() {
        return originLocatoin
      },
    })
  })
})
