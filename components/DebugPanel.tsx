'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
// Removed hook imports to avoid dependency loops

interface FeatureStatus {
  name: string
  status: 'working' | 'error' | 'warning' | 'unknown'
  details: string
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [features, setFeatures] = useState<FeatureStatus[]>([])
  const checkFeatures = () => {
    if (typeof window === 'undefined') return // Skip on server-side
    
    const newFeatures: FeatureStatus[] = []

    // Service Worker check - check directly without hooks
    const hasServiceWorker = 'serviceWorker' in navigator
    let swRegistered = false
    try {
      swRegistered = !!navigator.serviceWorker.controller
    } catch (e) {
      // Ignore errors
    }

    newFeatures.push({
      name: 'Service Worker',
      status: hasServiceWorker ? 
        (swRegistered ? 'working' : 'warning') : 'error',
      details: hasServiceWorker ? 
        (swRegistered ? 'Active and registered' : 'Supported but not registered') : 
        'Not supported in this browser'
    })

    // PWA check
    const isStandalone = window.matchMedia && 
      window.matchMedia('(display-mode: standalone)').matches
    newFeatures.push({
      name: 'PWA Features',
      status: isStandalone ? 'working' : 'warning',
      details: isStandalone ? 'Running as PWA' : 'Running in browser'
    })

    // Theme Customizer check
    let themeSettings = null
    try {
      themeSettings = localStorage.getItem('theme-settings')
    } catch (e) {
      // Handle localStorage access errors
    }
    newFeatures.push({
      name: 'Theme Customizer',
      status: 'working',
      details: themeSettings ? 'Custom settings applied' : 'Using default theme'
    })

    // Command Palette check
    newFeatures.push({
      name: 'Command Palette',
      status: 'working',
      details: 'Press Cmd/Ctrl + K to test'
    })

    // Reading Progress check
    const isOnBlogPost = window.location.pathname.startsWith('/blog/')
    newFeatures.push({
      name: 'Reading Progress',
      status: isOnBlogPost ? 'working' : 'warning',
      details: isOnBlogPost ? 'Active on this blog post' : 'Only active on blog posts'
    })

    // Performance Monitoring check - check directly without hooks
    const hasPerformanceAPI = 'performance' in window
    newFeatures.push({
      name: 'Performance Monitor',
      status: hasPerformanceAPI ? 'working' : 'warning',
      details: hasPerformanceAPI ? 
        'Performance API available' : 
        'Performance API not available'
    })

    // Local Storage check
    try {
      localStorage.setItem('debug-test', 'test')
      localStorage.removeItem('debug-test')
      newFeatures.push({
        name: 'Local Storage',
        status: 'working',
        details: 'Available for theme & settings'
      })
    } catch (error) {
      newFeatures.push({
        name: 'Local Storage',
        status: 'error',
        details: 'Not available (private browsing?)'
      })
    }

    // Framer Motion check
    newFeatures.push({
      name: 'Animations',
      status: 'working',
      details: 'Framer Motion active'
    })

    setFeatures(newFeatures)
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // Initial check after mount
    const timeoutId = setTimeout(checkFeatures, 100)
    
    // Set up interval for periodic updates
    const interval = setInterval(checkFeatures, 5000)
    
    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, []) // Run only once on mount, no dependencies

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'border-green-400/20 bg-green-400/5'
      case 'error':
        return 'border-red-400/20 bg-red-400/5'
      case 'warning':
        return 'border-yellow-400/20 bg-yellow-400/5'
      default:
        return 'border-gray-400/20 bg-gray-400/5'
    }
  }

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      {/* Debug Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-40 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Debug Panel (Development Only)"
      >
        <Bug className="w-5 h-5" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed top-0 left-0 h-full w-96 bg-bg-secondary border-r border-accent/20 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-text flex items-center gap-2">
                      <Bug className="w-5 h-5 text-purple-400" />
                      Debug Panel
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Development features status
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-text-secondary hover:text-text transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Features Status */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-text mb-3">Feature Status</h4>
                  
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${getStatusColor(feature.status)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(feature.status)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text">
                            {feature.name}
                          </div>
                          <div className="text-xs text-text-secondary mt-1">
                            {feature.details}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6">
                  <h4 className="font-semibold text-text mb-3">Quick Actions</h4>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const sw = (window as any).__sw
                        if (sw) {
                          sw.clearCache()
                          console.log('[Debug] Cache cleared')
                        }
                      }}
                      className="w-full p-2 bg-bg border border-border rounded text-text hover:border-accent transition-colors text-sm"
                    >
                      Clear Service Worker Cache
                    </button>
                    
                    <button
                      onClick={() => {
                        localStorage.clear()
                        console.log('[Debug] LocalStorage cleared')
                        checkFeatures()
                      }}
                      className="w-full p-2 bg-bg border border-border rounded text-text hover:border-accent transition-colors text-sm"
                    >
                      Clear Local Storage
                    </button>
                    
                    <button
                      onClick={() => {
                        const perf = (window as any).__performance
                        if (perf && perf.generateReport) {
                          console.log('[Debug] Performance Report:', perf.generateReport())
                        }
                      }}
                      className="w-full p-2 bg-bg border border-border rounded text-text hover:border-accent transition-colors text-sm"
                    >
                      Log Performance Report
                    </button>
                  </div>
                </div>

                {/* Environment Info */}
                <div className="mt-6 p-3 bg-bg rounded-lg border border-border">
                  <h4 className="font-semibold text-text mb-2 text-sm">Environment</h4>
                  <div className="text-xs text-text-secondary space-y-1">
                    <div>Mode: {process.env.NODE_ENV}</div>
                    <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
                    <div>Screen: {screen.width}x{screen.height}</div>
                    <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
