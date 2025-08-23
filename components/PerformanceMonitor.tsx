'use client'

import { useEffect, useState } from 'react'

interface WebVital {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface PerformanceMetrics {
  webVitals: WebVital[]
  connectionType: string
  deviceMemory: number | null
  jsHeapSize: {
    used: number
    total: number
    limit: number
  } | null
  firstVisit: boolean
  userAgent: string
  referrer: string
  screenResolution: string
  colorDepth: number
  timezone: string
  language: string
}

const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 }
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Check if user has opted into performance monitoring
    const monitoringConsent = localStorage.getItem('performance-monitoring-consent')
    if (monitoringConsent === 'true') {
      setIsEnabled(true)
      // Delay initialization to avoid blocking the main thread
      setTimeout(initializeMonitoring, 1000)
    } else if (monitoringConsent === null) {
      // Ask for consent after a delay (only in production)
      if (process.env.NODE_ENV === 'production') {
        setTimeout(requestConsent, 10000)
      } else {
        console.log('[Performance] Development mode - performance monitoring disabled')
      }
    }
  }, [])

  const requestConsent = () => {
    const consent = confirm(
      'Would you like to help improve this website by sharing anonymous performance data? ' +
      'This helps identify and fix performance issues.'
    )
    
    if (consent) {
      localStorage.setItem('performance-monitoring-consent', 'true')
      setIsEnabled(true)
      initializeMonitoring()
    } else {
      localStorage.setItem('performance-monitoring-consent', 'false')
    }
  }

  const initializeMonitoring = async () => {
    try {
      // Check if we're in a browser environment first
      if (typeof window === 'undefined') {
        console.log('[Performance] Server-side rendering - skipping web vitals')
        return
      }

      console.log('[Performance] Initializing Web Vitals monitoring...')
      
      // Import Web Vitals dynamically to avoid SSR issues
      const { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } = await import('web-vitals')
      const webVitals: WebVital[] = []
      
      const addVital = (vital: any) => {
        const rating = getRating(vital.name, vital.value)
        const webVital: WebVital = {
          name: vital.name,
          value: vital.value,
          rating,
          timestamp: Date.now()
        }
        
        webVitals.push(webVital)
        console.log(`[Performance] ${vital.name}:`, vital.value, `(${rating})`)
        
        // Send to analytics (if available)
        sendMetricToAnalytics(webVital)
        
        updateMetrics({ webVitals: [...webVitals] })
      }
      
      // Measure Web Vitals
      onCLS(addVital)
      onFCP(addVital)
      onFID(addVital)
      onLCP(addVital)
      onTTFB(addVital)
      
      // INP (Interaction to Next Paint) for newer browsers
      if (typeof onINP === 'function') {
        onINP(addVital)
      }

      console.log('[Performance] Web Vitals monitoring initialized successfully')

      // Always collect system metrics and setup observers
      collectSystemMetrics()
      setupPerformanceObserver()
      
    } catch (error) {
      console.warn('[Performance] Web Vitals monitoring failed, falling back to basic metrics:', error)
      // Fallback to basic performance monitoring
      collectBasicMetrics()
      collectSystemMetrics()
      setupPerformanceObserver()
    }
  }

  const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
    if (!threshold) return 'good'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const collectSystemMetrics = () => {
    const nav = navigator as any
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection
    
    const systemMetrics = {
      connectionType: connection ? 
        `${connection.effectiveType} (${connection.downlink}Mbps)` : 
        'unknown',
      deviceMemory: nav.deviceMemory || null,
      jsHeapSize: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      firstVisit: !localStorage.getItem('returning-visitor'),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    }
    
    // Mark as returning visitor
    localStorage.setItem('returning-visitor', 'true')
    
    updateMetrics(systemMetrics)
  }

  const collectBasicMetrics = () => {
    // Fallback performance measurement using Navigation Timing API
    if (performance.getEntriesByType) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navEntry) {
        const basicMetrics: WebVital[] = [
          {
            name: 'DOM Content Loaded',
            value: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            rating: 'good',
            timestamp: Date.now()
          },
          {
            name: 'Load Complete',
            value: navEntry.loadEventEnd - navEntry.loadEventStart,
            rating: 'good',
            timestamp: Date.now()
          },
          {
            name: 'Total Load Time',
            value: navEntry.loadEventEnd - navEntry.fetchStart,
            rating: 'good',
            timestamp: Date.now()
          }
        ]
        
        updateMetrics({ webVitals: basicMetrics })
      }
    }
  }

  const setupPerformanceObserver = () => {
    // Monitor resource loading performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Log slow resources
            if (entry.duration > 1000) {
              console.warn(`[Performance] Slow resource: ${entry.name} (${Math.round(entry.duration)}ms)`)
              
              sendMetricToAnalytics({
                name: 'Slow Resource',
                value: entry.duration,
                rating: 'poor',
                timestamp: Date.now(),
                resource: entry.name
              })
            }
          })
        })
        
        observer.observe({ entryTypes: ['resource', 'navigation'] })
      } catch (error) {
        console.warn('[Performance] PerformanceObserver not supported:', error)
      }
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.warn(`[Performance] Long task detected: ${Math.round(entry.duration)}ms`)
            
            sendMetricToAnalytics({
              name: 'Long Task',
              value: entry.duration,
              rating: 'poor',
              timestamp: Date.now()
            })
          })
        })
        
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        // Long task API not supported
      }
    }
  }

  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => prev ? { ...prev, ...newMetrics } : newMetrics as PerformanceMetrics)
  }

  const sendMetricToAnalytics = (metric: WebVital & { resource?: string }) => {
    // Send to Google Analytics 4 if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        metric_rating: metric.rating,
        custom_parameter: metric.resource
      })
    }

    // Send to custom analytics endpoint (only if it exists)
    if (process.env.NODE_ENV === 'production') {
      try {
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'performance',
            metric: {
              name: metric.name,
              value: metric.value,
              rating: metric.rating,
              timestamp: metric.timestamp,
              url: window.location.pathname,
              referrer: document.referrer,
              userAgent: navigator.userAgent.substring(0, 200), // Truncate for storage
              resource: metric.resource
            }
          })
        }).catch(error => {
          // Silently fail if analytics endpoint doesn't exist
          console.debug('[Performance] Analytics endpoint not available:', error)
        })
      } catch (error) {
        console.debug('[Performance] Analytics disabled:', error)
      }
    }
  }

  const generatePerformanceReport = () => {
    if (!metrics || !isEnabled) return null

    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      webVitals: metrics.webVitals,
      system: {
        connectionType: metrics.connectionType,
        deviceMemory: metrics.deviceMemory,
        jsHeapSize: metrics.jsHeapSize,
        screenResolution: metrics.screenResolution,
        language: metrics.language,
        timezone: metrics.timezone
      },
      session: {
        firstVisit: metrics.firstVisit,
        referrer: metrics.referrer
      }
    }

    return report
  }

  // Expose performance utilities globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && isEnabled) {
      (window as any).__performance = {
        metrics,
        generateReport: generatePerformanceReport,
        sendTestMetric: (name: string, value: number) => {
          sendMetricToAnalytics({
            name,
            value,
            rating: getRating(name, value),
            timestamp: Date.now()
          })
        },
        getReport: generatePerformanceReport
      }
    }
  }, [metrics, isEnabled])

  // Monitor route changes for SPA performance
  useEffect(() => {
    let routeChangeStart: number

    const handleRouteChangeStart = () => {
      routeChangeStart = performance.now()
    }

    const handleRouteChangeComplete = () => {
      if (routeChangeStart) {
        const routeChangeTime = performance.now() - routeChangeStart
        
        sendMetricToAnalytics({
          name: 'Route Change Time',
          value: routeChangeTime,
          rating: routeChangeTime < 500 ? 'good' : routeChangeTime < 1000 ? 'needs-improvement' : 'poor',
          timestamp: Date.now()
        })
        
        console.log(`[Performance] Route change: ${Math.round(routeChangeTime)}ms`)
      }
    }

    // Listen for Next.js route changes if available
    if (typeof window !== 'undefined' && (window as any).next && (window as any).next.router && (window as any).next.router.events) {
      const events = (window as any).next.router.events
      if (typeof events.on === 'function') {
        events.on('routeChangeStart', handleRouteChangeStart)
        events.on('routeChangeComplete', handleRouteChangeComplete)
      }
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).next && (window as any).next.router && (window as any).next.router.events) {
        const events = (window as any).next.router.events
        if (typeof events.off === 'function') {
          events.off('routeChangeStart', handleRouteChangeStart)
          events.off('routeChangeComplete', handleRouteChangeComplete)
        }
      }
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

// Hook to access performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    const updateMetrics = () => {
      const perf = (window as any).__performance
      if (perf && perf.metrics) {
        setMetrics(perf.metrics)
      }
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return metrics
}
