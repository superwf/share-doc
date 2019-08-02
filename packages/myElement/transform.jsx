import React from 'react'
import { forEach } from 'lodash'

export function transformToReact(TagName) {
  const ReactComponent = props => {
    const { children, ...otherProps } = props
    return (
      <TagName
        ref={(el) => {
          if (el) {
            forEach(otherProps, (v, k) => {
              el.setAttribute(k, v)
            })
          }
        }}
      >
        {children}
      </TagName>
    )
  }
  return ReactComponent
}
