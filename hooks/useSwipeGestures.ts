'use client'

import { useEffect, useRef, useState } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onPinch?: (scale: number) => void
  threshold?: number
  preventDefault?: boolean
  enableHaptics?: boolean
}

interface TouchPoint {
  id: number
  x: number
  y: number
  startX: number
  startY: number
  startTime: number
}

export function useSwipeGestures(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    threshold = 50,
    preventDefault = false,
    enableHaptics = true
  } = options

  const ref = useRef<HTMLElement>(null)
  const touchPoints = useRef<Map<number, TouchPoint>>(new Map())
  const lastTapTime = useRef<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const initialDistance = useRef<number>(0)

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics || typeof navigator === 'undefined' || typeof window === 'undefined') return

    try {
      // Modern haptic feedback
      if (navigator && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        const patterns = {
          light: [10],
          medium: [50],
          heavy: [100, 50, 100]
        }
        navigator.vibrate(patterns[type])
      }

      // iOS haptic feedback (if available)
      if (navigator && 'hapticFeedback' in navigator) {
        ;(navigator as any).hapticFeedback(type)
      }
    } catch (error) {
      // Haptics not supported, fail silently
      console.debug('[Haptic] Not supported:', error)
    }
  }

  const calculateDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    const touch = e.touches[0]
    const touchPoint: TouchPoint = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    }

    touchPoints.current.set(touch.identifier, touchPoint)

    // Handle pinch gesture setup
    if (e.touches.length === 2 && onPinch) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      initialDistance.current = calculateDistance(touch1, touch2)
    }

    // Setup long press detection
    if (onLongPress && e.touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        triggerHaptic('heavy')
        onLongPress()
      }, 500) // 500ms for long press
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    // Clear long press if finger moves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = undefined
    }

    const touch = e.touches[0]
    const touchPoint = touchPoints.current.get(touch.identifier)

    if (!touchPoint) return

    // Update current position
    touchPoint.x = touch.clientX
    touchPoint.y = touch.clientY

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch && initialDistance.current > 0) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = calculateDistance(touch1, touch2)
      const scale = currentDistance / initialDistance.current

      // Trigger pinch callback with scale factor
      onPinch(scale)

      // Light haptic feedback for pinch
      if (Math.abs(scale - 1) > 0.1) {
        triggerHaptic('light')
      }
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = undefined
    }

    const touch = e.changedTouches[0]
    const touchPoint = touchPoints.current.get(touch.identifier)

    if (!touchPoint) return

    const deltaX = touch.clientX - touchPoint.startX
    const deltaY = touch.clientY - touchPoint.startY
    const deltaTime = Date.now() - touchPoint.startTime
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Handle tap gestures
    if (distance < threshold && deltaTime < 300) {
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime.current

      if (timeSinceLastTap < 300 && onDoubleTap) {
        // Double tap
        triggerHaptic('medium')
        onDoubleTap()
        lastTapTime.current = 0 // Reset to prevent triple tap
      } else if (onTap) {
        // Single tap
        triggerHaptic('light')
        onTap()
        lastTapTime.current = now
      }
    }
    // Handle swipe gestures
    else if (distance >= threshold) {
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

      if (isHorizontalSwipe) {
        if (deltaX > 0 && onSwipeRight) {
          triggerHaptic('medium')
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic('medium')
          onSwipeLeft()
        }
      } else {
        if (deltaY > 0 && onSwipeDown) {
          triggerHaptic('medium')
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          triggerHaptic('medium')
          onSwipeUp()
        }
      }
    }

    // Clean up
    touchPoints.current.delete(touch.identifier)
  }

  const handleTouchCancel = (e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = undefined
    }

    // Clear all touch points
    touchPoints.current.clear()
    initialDistance.current = 0
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Only add touch listeners on touch-capable devices - client-side check
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return
    
    const isTouchDevice = 'ontouchstart' in window || (navigator && navigator.maxTouchPoints && navigator.maxTouchPoints > 0)

    if (!isTouchDevice) return

    try {
      // Add touch event listeners
      element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault })
      element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault })
      element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault })
      element.addEventListener('touchcancel', handleTouchCancel, { passive: true })

      return () => {
        try {
          element.removeEventListener('touchstart', handleTouchStart)
          element.removeEventListener('touchmove', handleTouchMove)
          element.removeEventListener('touchend', handleTouchEnd)
          element.removeEventListener('touchcancel', handleTouchCancel)
        } catch (error) {
          console.debug('[Touch] Error removing event listeners:', error)
        }
      }
    } catch (error) {
      console.debug('[Touch] Error adding event listeners:', error)
    }
  }, [
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    threshold,
    preventDefault,
    enableHaptics
  ])

  return ref
}

// Utility hook for common navigation gestures
export function useNavigationGestures() {
  const [currentSection, setCurrentSection] = useState(0)

  const scrollToSection = (sectionId: string) => {
    if (typeof document === 'undefined') return
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const sections = [
    'hero',
    'about', 
    'experience',
    'education',
    'projects',
    'skills',
    'blog',
    'contact'
  ]

  const navigateToSection = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentSection + 1, sections.length - 1)
      : Math.max(currentSection - 1, 0)
    
    if (newIndex !== currentSection) {
      setCurrentSection(newIndex)
      scrollToSection(sections[newIndex])
    }
  }

  const gestureRef = useSwipeGestures({
    onSwipeUp: () => navigateToSection('next'),
    onSwipeDown: () => navigateToSection('prev'),
    onSwipeLeft: () => {
      // Navigate to blog if available - client-side only
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          window.location.href = '/blog'
        } else {
          window.history.back()
        }
      }
    },
    onSwipeRight: () => {
      // Navigate back to home if not already there - client-side only
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }
    },
    threshold: 50,
    enableHaptics: true
  })

  // Update current section based on scroll position
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isVisible = rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2
          
          if (isVisible) {
            setCurrentSection(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return {
    gestureRef,
    currentSection,
    sections,
    navigateToSection,
    scrollToSection
  }
}
