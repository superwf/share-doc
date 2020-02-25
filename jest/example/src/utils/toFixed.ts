/** 无输入或解析失败时的占位符 */
export const PLACEHOLDER = '--'

/**
 * @remarks
 *   输如数字，返回保留两位小数
 *   若输入为空，返回展位符
 * @param value 原数值
 * @param precision 精度
 * @return 按精度保留小数后的结果
 * */
export const toFixed = (value?: number | null, precision = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return PLACEHOLDER
  }
  return value.toFixed(precision)
}
