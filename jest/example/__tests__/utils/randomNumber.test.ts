import { times } from 'lodash'
import { randomNumber } from '../../src/utils/randomNumber'

describe('utils/randomNumber', () => {
  it('随机生成1-100之间的数字', () => {
    times(100, () => {
      expect(randomNumber()).toBeLessThan(100)
      expect(randomNumber()).toBeGreaterThan(0)
    })
  })
})
