'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ReadingProgressProps {
  /**
   * Target selector for the content to track
   * Defaults to '.blog-content' to match existing blog structure
   */
  target?: string
  /**
   * Whether to show the progress as a percentage number
   */
  showPercentage?: boolean
  /**
   * Position of the progress bar
   */
  position?: 'top' | 'bottom'
  /**
   * Additional className for styling
   */
  className?: string
}

export function ReadingProgress({ 
  target = '.blog-content',
  showPercentage = false,
  position = 'top',
  className = '' 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const calculateProgress = () => {
      const targetElement = document.querySelector(target)
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const documentHeight = rect.height
      const scrollTop = -rect.top

      // Start showing progress when content starts entering viewport
      if (scrollTop > 0 && rect.bottom > 0) {
        setIsVisible(true)
        
        // Calculate reading progress
        const totalReadableHeight = documentHeight + rect.top
        const progress = Math.min(Math.max(scrollTop / totalReadableHeight * 100, 0), 100)
        setProgress(progress)
      } else {
        setIsVisible(false)
        setProgress(0)
      }
    }

    // Calculate initial progress
    calculateProgress()

    // Add scroll listener with throttling for better performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [target])

  const progressBarClasses = `
    fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50
    h-1 bg-gradient-to-r from-accent via-neon-cyan to-accent
    origin-left transition-opacity duration-300
    ${isVisible ? 'opacity-100' : 'opacity-0'}
    ${className}
  `.trim()

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className={progressBarClasses}
        style={{
          scaleX: progress / 100,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
      
      {/* Optional Percentage Display */}
      {showPercentage && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`
            fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50
            bg-bg-secondary border border-accent/20 rounded-full
            px-3 py-1 text-sm font-mono text-accent
            shadow-lg backdrop-blur-sm
            min-w-[60px] text-center
          `}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
      
      {/* Glow effect for enhanced visual appeal */}
      {isVisible && (
        <motion.div
          className={`
            fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-40
            h-1 bg-accent/30 blur-sm
            origin-left
          `}
          style={{
            scaleX: progress / 100,
          }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      )}
    </>
  )
}
