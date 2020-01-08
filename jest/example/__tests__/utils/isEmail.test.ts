import { isEmail } from '../../src/utils/isEmail'

describe('isEmail', () => {
  test('正确的email', () => {
    expect(isEmail('a@c.com')).toBe(true)
    // 需要用失败的例子填充
    // expect(isEmail('addd@c.cc.com')).toBe(true)
    // expect(isEmail('a1@ac.com')).toBe(true)
  })

  test('错误的email', () => {
    expect(isEmail('ac.com')).toBe(false)
  })
})
