import React from "react"

export function Switch({ checked, onCheckedChange, className }: any) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      className={className}
      style={{ width: 40, height: 20 }}
    />
  )
}
