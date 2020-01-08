import { toFixed, PLACEHOLDER } from '../../src/utils/toFixed'

describe('tool/toFixed', () => {
  it('没有value时返回PLACEHOLDER', () => {
    expect(toFixed()).toBe(PLACEHOLDER)
    expect(toFixed(null)).toBe(PLACEHOLDER)
    expect(toFixed(Number.NaN)).toBe(PLACEHOLDER)
  })

  it('返回指定精度的格式化数字', () => {
    expect(toFixed(1111)).toBe('1111.00')
    expect(toFixed(1111.333)).toBe('1111.33')
    expect(toFixed(1111.36)).toBe('1111.36')
    expect(toFixed(1111.36, 4)).toBe('1111.3600')
    expect(toFixed(1111.3677, 3)).toBe('1111.368')
  })
})
