export const PLACEHOLDER = '--'

/**
 * @remarks 输如数字，返回保留两位小数
 * 若输入为空，返回展位符
 * */
export const toFixed = (value?: number | null, precision = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return PLACEHOLDER
  }
  return value.toFixed(precision)
}
