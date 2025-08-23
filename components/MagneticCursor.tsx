'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CursorState {
  x: number
  y: number
  isVisible: boolean
  isHovering: boolean
  scale: number
  magneticTarget: HTMLElement | null
  cursorText: string
}

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    isVisible: false,
    isHovering: false,
    scale: 1,
    magneticTarget: null,
    cursorText: ''
  })

  // Check if device supports cursor (desktop)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const hasPointer = window.matchMedia('(pointer: fine)').matches
      const isLargeScreen = window.innerWidth >= 1024
      setIsDesktop(hasPointer && isLargeScreen)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      setState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isVisible: true
      }))
    }

    const handleMouseEnter = () => {
      setState(prev => ({ ...prev, isVisible: true }))
    }

    const handleMouseLeave = () => {
      setState(prev => ({ ...prev, isVisible: false }))
    }

    // Magnetic effect for interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const magneticElement = target.closest('[data-magnetic]') as HTMLElement
      
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        )
        
        // Magnetic attraction within 100px
        if (distance < 100) {
          const force = Math.max(0, (100 - distance) / 100)
          const magneticX = centerX + (e.clientX - centerX) * (1 - force * 0.5)
          const magneticY = centerY + (e.clientY - centerY) * (1 - force * 0.5)
          
          setState(prev => ({
            ...prev,
            x: magneticX,
            y: magneticY,
            isHovering: true,
            scale: 1.5,
            magneticTarget: magneticElement,
            cursorText: magneticElement.getAttribute('data-cursor-text') || ''
          }))
          
          // Apply subtle magnetic effect to the element itself
          const magneticStrength = force * 10
          magneticElement.style.transform = `translate(${(e.clientX - centerX) * magneticStrength * 0.01}px, ${(e.clientY - centerY) * magneticStrength * 0.01}px)`
        } else {
          setState(prev => ({
            ...prev,
            isHovering: false,
            scale: 1,
            magneticTarget: null,
            cursorText: ''
          }))
          
          // Reset element position
          magneticElement.style.transform = 'translate(0, 0)'
        }
      } else {
        setState(prev => ({
          ...prev,
          isHovering: false,
          scale: 1,
          magneticTarget: null,
          cursorText: ''
        }))
      }
    }

    // Handle clicks and interactions
    const handleClick = () => {
      setState(prev => ({ ...prev, scale: 0.8 }))
      setTimeout(() => {
        setState(prev => ({ ...prev, scale: prev.isHovering ? 1.5 : 1 }))
      }, 150)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mousemove', handleElementHover, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('click', handleClick)

    // Handle different cursor states for different elements
    const updateCursorForElement = (element: HTMLElement, isEntering: boolean) => {
      const cursorType = element.getAttribute('data-cursor')
      const cursorText = element.getAttribute('data-cursor-text')
      
      if (isEntering) {
        setState(prev => ({
          ...prev,
          isHovering: true,
          scale: cursorType === 'large' ? 2 : 1.5,
          cursorText: cursorText || ''
        }))
      } else {
        setState(prev => ({
          ...prev,
          isHovering: false,
          scale: 1,
          cursorText: ''
        }))
      }
    }

    // Add hover effects to all interactive elements
    const addInteractiveEffects = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], [data-cursor], [data-magnetic], input, textarea, select'
      )

      interactiveElements.forEach(element => {
        const htmlElement = element as HTMLElement
        
        const handleEnter = () => updateCursorForElement(htmlElement, true)
        const handleLeave = () => updateCursorForElement(htmlElement, false)
        
        htmlElement.addEventListener('mouseenter', handleEnter)
        htmlElement.addEventListener('mouseleave', handleLeave)
      })
    }

    // Initialize effects
    addInteractiveEffects()

    // Re-initialize on DOM changes
    const observer = new MutationObserver(addInteractiveEffects)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleElementHover)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('click', handleClick)
      observer.disconnect()
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        /* Ensure text selection still works */
        ::selection {
          cursor: text !important;
        }
      `}</style>

      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: state.x - 20,
          y: state.y - 20,
        }}
        animate={{
          opacity: state.isVisible ? 1 : 0,
          scale: state.scale,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.3, type: 'spring', stiffness: 400, damping: 28 }
        }}
      >
        {/* Outer cursor ring */}
        <div
          className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            state.isHovering 
              ? 'border-accent bg-accent/10' 
              : 'border-white/50 bg-transparent'
          }`}
        />
        
        {/* Inner cursor dot */}
        <motion.div
          ref={cursorDotRef}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
          animate={{
            scale: state.isHovering ? 0 : 1,
            x: '-50%',
            y: '-50%'
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Cursor text */}
        {state.cursorText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-bg-secondary border border-accent/20 rounded-lg px-3 py-1 text-sm text-text whitespace-nowrap pointer-events-none"
          >
            {state.cursorText}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

// Helper function to add cursor effects to elements
export function addMagneticEffect(element: HTMLElement, options?: {
  strength?: number
  cursorText?: string
  cursorType?: 'normal' | 'large'
}) {
  const { strength = 1, cursorText, cursorType = 'normal' } = options || {}
  
  element.setAttribute('data-magnetic', 'true')
  if (cursorText) {
    element.setAttribute('data-cursor-text', cursorText)
  }
  if (cursorType !== 'normal') {
    element.setAttribute('data-cursor', cursorType)
  }
}

// Utility component for magnetic elements
interface MagneticElementProps {
  children: React.ReactNode
  className?: string
  cursorText?: string
  cursorType?: 'normal' | 'large'
  strength?: number
  onClick?: () => void
  href?: string
}

export function MagneticElement({
  children,
  className = '',
  cursorText,
  cursorType = 'normal',
  strength = 1,
  onClick,
  href
}: MagneticElementProps) {
  const props = {
    'data-magnetic': 'true',
    'data-cursor-text': cursorText,
    'data-cursor': cursorType !== 'normal' ? cursorType : undefined,
    className,
    onClick
  }

  if (href) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <div {...props}>
      {children}
    </div>
  )
}
