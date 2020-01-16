/** @remarks 检查字符串是否是email
 * @returns boolean
 * */
export const isEmail = (input: string) => {
  return /^[a-z]+@[a-z]+\.[a-z]+$/i.test(input)
}
