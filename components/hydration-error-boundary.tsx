"use client"

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a hydration error
    const isHydrationError = Boolean(
      error.message?.includes('hydration') ||
      error.message?.includes('server HTML') ||
      error.stack?.includes('hydration')
    )

    return { 
      hasError: isHydrationError, 
      error: isHydrationError ? error : undefined 
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log hydration errors in development
    if (process.env.NODE_ENV === 'development') {
      const isHydrationError = 
        error.message?.includes('hydration') ||
        error.message?.includes('server HTML')
      
      if (isHydrationError) {
        console.warn('Hydration error caught by boundary:', error.message)
        console.warn('This is likely caused by browser extensions modifying the DOM')
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">กำลังโหลดระบบ...</h2>
            <p className="text-sm text-gray-600">กรุณารอสักครู่</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}