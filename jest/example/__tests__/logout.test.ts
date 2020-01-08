import { logout } from '../src/logout'

const noop = (v: string) => {}

describe('logout', () => {
  it('assign', () => {
    /** 屏蔽 window.location.assign的默认行为 */
    const spy = jest.spyOn(window.location, 'assign').mockImplementation(noop)
    logout()
    expect(window.location.assign).toHaveBeenLastCalledWith(
      `/api/logout?returnUrl=${encodeURIComponent(location.href)}`,
    )

    /** 退出的时候必须清理对外部环境的更改，否则会影响其他测试 */
    spy.mockRestore()
  })
})
