'use client'

import { useEffect, useState } from 'react'

interface PerformanceOptimizerProps {
  children: React.ReactNode
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    // Detect device type and performance capabilities
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)
      
      if (isMobile && !isTablet) {
        setDeviceType('mobile')
      } else if (isTablet) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Performance detection based on various factors
    const detectPerformance = () => {
      let performanceScore = 0
      
      // Check CPU cores
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency || 1
        performanceScore += cores >= 4 ? 2 : cores >= 2 ? 1 : 0
      }

      // Check memory (if available)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory || 1
        performanceScore += memory >= 8 ? 2 : memory >= 4 ? 1 : 0
      }

      // Check connection type
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        if (connection) {
          const effectiveType = connection.effectiveType
          if (effectiveType === '4g' || effectiveType === '5g') {
            performanceScore += 1
          }
        }
      }

      // Check if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        performanceScore -= 2
      }

      // Check device type impact
      if (deviceType === 'mobile') {
        performanceScore -= 1
      }

      setIsLowPerformance(performanceScore < 2)
    }

    detectDevice()
    detectPerformance()

    // Apply performance optimizations
    if (isLowPerformance || deviceType === 'mobile') {
      // Reduce animation complexity
      document.documentElement.classList.add('reduced-motion')
      
      // Disable non-essential animations on mobile
      const style = document.createElement('style')
      style.textContent = `
        @media (max-width: 768px) {
          .matrix-rain,
          .particle-background,
          .hex-grid {
            display: none !important;
          }
          
          .cyber-background canvas {
            opacity: 0.3 !important;
          }
          
          .holographic::after,
          .scan-line,
          .interference::before {
            animation-duration: 10s !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Optimize based on device type
    if (deviceType === 'mobile') {
      // Enable mobile optimizations
      const viewportMeta = document.querySelector('meta[name="viewport"]')
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        )
      }
    }

    // Memory cleanup for intervals
    const performanceMonitor = setInterval(() => {
      // Monitor performance and adjust accordingly
      if ((performance as any).memory && (performance as any).memory.usedJSHeapSize > 50000000) {
        // High memory usage detected, reduce effects
        document.documentElement.classList.add('reduced-motion')
      }
    }, 10000)

    return () => {
      clearInterval(performanceMonitor)
    }
  }, [isLowPerformance, deviceType])

  return (
    <div 
      className={`
        ${isLowPerformance ? 'reduced-motion' : ''}
        ${deviceType === 'mobile' ? 'mobile-optimized' : ''}
      `}
    >
      {children}
    </div>
  )
}
