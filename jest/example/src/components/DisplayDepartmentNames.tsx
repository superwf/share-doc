import * as React from 'react'

/** 包含三级部门名称的数据 */
export interface IProps {
  level1Name?: string
  level2Name?: string
  level3Name?: string
}

/** 展示部门多级名称 */
export const DisplayDepartmentNames: React.FC<IProps> = row => (
  <div>
    {row.level1Name}
    {row.level2Name && (
      <>
        <br />
        {row.level2Name}
      </>
    )}
    {row.level3Name && (
      <>
        <br />
        {row.level3Name}
      </>
    )}
  </div>
)
