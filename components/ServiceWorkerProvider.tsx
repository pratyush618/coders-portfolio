'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isRegistered: boolean
  isSupported: boolean
  hasUpdate: boolean
  isOnline: boolean
  cacheSize: number
}

interface ServiceWorkerContextType extends ServiceWorkerState {
  registration: ServiceWorkerRegistration | null
  updateServiceWorker: () => void
  clearCache: () => Promise<void>
  precacheRoutes: (routes: string[]) => Promise<void>
}

export function ServiceWorkerProvider() {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isSupported: false,
    hasUpdate: false,
    isOnline: true,
    cacheSize: 0
  })
  
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if service worker is supported
    const isSupported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    setState(prev => ({ ...prev, isSupported, isOnline }))
    
    if (!isSupported) {
      console.log('[SW] Service Worker not supported in this browser')
      return
    }

    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      registerServiceWorker()
      setupEventListeners()
      
      // Get initial cache size after a delay
      setTimeout(getCacheSize, 1000)
    }
  }, [])

  const registerServiceWorker = async () => {
    // Double-check that we have access to navigator and serviceWorker
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
      console.log('[SW] Service worker not available')
      return
    }

    try {
      console.log('[SW] Registering service worker...')
      
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      })
      
      setRegistration(reg)
      setState(prev => ({ ...prev, isRegistered: true }))
      
      console.log('[SW] Service worker registered successfully')
      
      // Check for updates
      await checkForUpdates(reg)
      
      // Set up update listeners
      if (reg && reg.addEventListener) {
        reg.addEventListener('updatefound', () => {
          console.log('[SW] Update found!')
          const newWorker = reg.installing
          
          if (newWorker && newWorker.addEventListener) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker && navigator.serviceWorker.controller) {
                console.log('[SW] New version available')
                setState(prev => ({ ...prev, hasUpdate: true }))
                
                // Show update notification
                showUpdateNotification()
              }
            })
          }
        })
      }
      
    } catch (error) {
      console.error('[SW] Registration failed:', error)
    }
  }

  const setupEventListeners = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

    // Listen for online/offline changes
    window.addEventListener('online', () => {
      setState(prev => ({ ...prev, isOnline: true }))
      console.log('[SW] Back online')
    })
    
    window.addEventListener('offline', () => {
      setState(prev => ({ ...prev, isOnline: false }))
      console.log('[SW] Gone offline')
    })
    
    // Listen for service worker messages
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, size } = event.data
        
        if (type === 'CACHE_SIZE') {
          setState(prev => ({ ...prev, cacheSize: size }))
        }
      })
    }
  }

  const checkForUpdates = async (reg: ServiceWorkerRegistration) => {
    try {
      await reg.update()
      console.log('[SW] Checked for updates')
    } catch (error) {
      console.log('[SW] Update check failed:', error)
    }
  }

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Reload the page to use the new service worker
      window.location.reload()
    }
  }

  const clearCache = async (): Promise<void> => {
    if (!registration) return
    
    try {
      const messageChannel = new MessageChannel()
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_CLEARED') {
            setState(prev => ({ ...prev, cacheSize: 0 }))
            console.log('[SW] Cache cleared successfully')
            resolve()
          }
        }
        
        registration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('[SW] Failed to clear cache:', error)
    }
  }

  const precacheRoutes = async (routes: string[]): Promise<void> => {
    if (!registration) return
    
    try {
      const messageChannel = new MessageChannel()
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.type === 'ROUTES_PRECACHED') {
            console.log('[SW] Routes precached successfully')
            getCacheSize() // Update cache size
            resolve()
          }
        }
        
        registration.active?.postMessage(
          { type: 'PRECACHE_ROUTES', payload: { routes } },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('[SW] Failed to precache routes:', error)
    }
  }

  const getCacheSize = async () => {
    if (!registration) return
    
    try {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          setState(prev => ({ ...prev, cacheSize: event.data.size }))
        }
      }
      
      registration.active?.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      )
    } catch (error) {
      console.error('[SW] Failed to get cache size:', error)
    }
  }

  const showUpdateNotification = () => {
    try {
      // Create a subtle notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Portfolio Updated', {
          body: 'A new version is available. Refresh to update.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'portfolio-update',
          requireInteraction: false,
          silent: true
        })
      } else {
        // Fallback: Show a console message
        console.log('[SW] Update available - user can manually refresh')
      }
    } catch (error) {
      console.debug('[SW] Notifications not supported:', error)
    }
  }

  // Expose service worker context globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__sw = {
        state,
        registration,
        updateServiceWorker,
        clearCache,
        precacheRoutes,
        getCacheSize
      }
    }
  }, [state, registration])

  // Auto-precache important routes
  useEffect(() => {
    if (state.isRegistered && registration) {
      const importantRoutes = [
        '/',
        '/blog',
        // Add more critical routes here
      ]
      
      // Precache after a delay to not interfere with initial page load
      setTimeout(() => {
        precacheRoutes(importantRoutes)
      }, 3000)
    }
  }, [state.isRegistered, registration])

  return null // This component doesn't render anything
}

// Hook to access service worker state
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    hasUpdate: false,
    isOnline: true,
    cacheSize: 0
  })

  useEffect(() => {
    // Initialize online status
    if (typeof navigator !== 'undefined') {
      setState(prev => ({ ...prev, isOnline: navigator.onLine }))
    }
    
    // Get state from global service worker context
    const updateState = () => {
      const sw = (window as any).__sw
      if (sw) {
        setState(sw.state)
      }
    }

    updateState()
    const interval = setInterval(updateState, 1000)

    return () => clearInterval(interval)
  }, [])

  const updateServiceWorker = () => {
    const sw = (window as any).__sw
    if (sw) {
      sw.updateServiceWorker()
    }
  }

  const clearCache = async () => {
    const sw = (window as any).__sw
    if (sw) {
      await sw.clearCache()
    }
  }

  return {
    ...state,
    updateServiceWorker,
    clearCache
  }
}
