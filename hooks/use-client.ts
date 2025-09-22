import { useEffect, useState } from 'react'

/**
 * Hook to prevent hydration mismatches by only rendering on client
 * This is useful when dealing with browser extensions that modify DOM
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to check if we're in a browser environment
 */
export function useIsBrowser() {
  return typeof window !== 'undefined'
}

/**
 * Hook to detect and handle browser extensions that might cause hydration issues
 */
export function useBrowserExtensionSafe() {
  const [isSafe, setIsSafe] = useState(false)
  const isClient = useIsClient()

  useEffect(() => {
    if (!isClient) return

    // Check for common browser extension indicators
    const hasExtensionAttributes = document.querySelector(
      '[fdprocessedid], [data-lastpass-icon-root], [data-dashlane-rid], [data-1p-ignore]'
    )

    // Add a small delay to allow extensions to modify DOM
    const timer = setTimeout(() => {
      setIsSafe(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [isClient])

  return { isClient, isSafe }
}