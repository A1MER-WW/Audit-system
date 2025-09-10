import React from "react"

export function Dialog({ open, onOpenChange, children }: any) {
  return <div>{children}</div>
}

export function DialogContent({ children, className }: any) {
  return <div className={className}>{children}</div>
}

export function DialogHeader({ children }: any) {
  return <div>{children}</div>
}

export function DialogTitle({ children, className }: any) {
  return <div className={className}>{children}</div>
}

export function DialogTrigger({ asChild, children }: any) {
  return <>{children}</>
}
