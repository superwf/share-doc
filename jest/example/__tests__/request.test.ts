import { fetchUserList, restoreUserList } from '../src/request'
import { toJS } from 'mobx'
import { user } from '../src/stores/user'

describe('异步测试用例，获取用户列表', () => {
  test('使用返回promise的方式', () => {
    expect(toJS(user.list)).toEqual([])
    return fetchUserList().then(list => {
      expect(list).toHaveLength(2)
      expect(toJS(user.list)).toEqual(list)
      // 测试之后恢复列表
      restoreUserList()
    })
  })

  test('使用async await的方式', async () => {
    expect(toJS(user.list)).toEqual([])
    const list = await fetchUserList()
    expect(list).toHaveLength(2)
    expect(toJS(user.list)).toEqual(list)
    // 测试之后恢复列表
    restoreUserList()
  })

  // eslint-disable-next-line jest/no-test-callback
  test('使用done回调的方式适合复杂的回调逻辑', done => {
    expect(toJS(user.list)).toEqual([])
    fetchUserList().then(list => {
      expect(list).toHaveLength(2)
      expect(toJS(user.list)).toEqual(list)
      // 测试之后恢复列表
      restoreUserList()
      // 比如还需要多等一段时间的其他逻辑
      setTimeout(done, 100)
    })
  }, 2000) // test/it的第三个参数表示该测试需要等待的超时时间，默认为5000
})
