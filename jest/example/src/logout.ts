/** 退出系统 */
export const logout = () => {
  const { encodeURIComponent } = window
  window.location.assign(
    `/api/logout?returnUrl=${encodeURIComponent(location.href)}`,
  )
}
