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
    await fetchUserList().then(list => {
      expect(list).toHaveLength(2)
      expect(toJS(user.list)).toEqual(list)
      // 测试之后恢复列表
      restoreUserList()
    })
  })

  test('使用done回调的方式', () => {
    return new Promise(done => {
      expect(toJS(user.list)).toEqual([])
      fetchUserList().then(list => {
        expect(list).toHaveLength(2)
        expect(toJS(user.list)).toEqual(list)
        // 测试之后恢复列表
        restoreUserList()
        done()
      })
    })
  })
})
