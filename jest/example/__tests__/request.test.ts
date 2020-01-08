import { fetchUserList, restoreUserList } from '../src/request'
import { toJS } from 'mobx'
import { user } from '../src/stores/user'

test('异步测试用例，获取用户列表', () => {
  expect(toJS(user.list)).toEqual([])
  return fetchUserList().then(list => {
    expect(list).toHaveLength(2)
    expect(toJS(user.list)).toEqual(list)
    // 测试之后恢复列表
    restoreUserList()
  })
})
