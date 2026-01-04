'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// This tells TypeScript that 'fbq' is a valid function on the window object
declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
    }
}

export default function FacebookPixelEvents() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Now TypeScript knows window.fbq exists
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            window.fbq('track', 'PageView')
        }
    }, [pathname, searchParams])

    return null
}