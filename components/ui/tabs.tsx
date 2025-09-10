import React, { useState } from "react"

export function Tabs({ defaultValue, className, children }: { defaultValue: any, className?: string, children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { value, setValue })
          : child
      )}
    </div>
  )
}

export function TabsList({ children, className, value, setValue }: any) {
  return <div className={className}>{React.Children.map(children, child =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<any>, { value, setValue })
      : child
  )}</div>
}

export function TabsTrigger({ value: tabValue, children, className, value, setValue }: any) {
  const active = value === tabValue
  return (
    <button
      className={className}
      style={{ fontWeight: active ? "bold" : "normal" }}
      onClick={() => setValue(tabValue)}
      data-state={active ? "active" : undefined}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value: tabValue, children, className, value }: any) {
  if (value !== tabValue) return null
  return <div className={className}>{children}</div>
}
