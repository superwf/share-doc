import { action } from 'mobx'

import { user } from './stores/user'

/** 模拟远程数据请求加载 */
export const fetchUserList = () => {
  return new Promise(r => {
    setTimeout(
      action(() => {
        const list = [{ name: 'aaa', age: 1, key: '1' }, { name: 'bbb', age: 2, key: '2' }]
        user.list = list
        r(list)
      }),
      10,
    )
  })
}
export const restoreUserList = action(() => {
  user.list = []
})
