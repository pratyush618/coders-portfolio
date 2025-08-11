'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  trigger?: 'hover' | 'continuous' | 'manual'
  isActive?: boolean
}

const glitchVariants = {
  idle: {
    textShadow: 'none',
    filter: 'none',
  },
  glitchLow: {
    textShadow: [
      '2px 0 #ff0000, -2px 0 #00ffff',
      '-2px 0 #ff0000, 2px 0 #00ffff',
      '2px 0 #ff0000, -2px 0 #00ffff'
    ],
    filter: [
      'hue-rotate(0deg) saturate(1)',
      'hue-rotate(90deg) saturate(1.5)',
      'hue-rotate(0deg) saturate(1)'
    ],
    x: [0, 1, -1, 0],
    transition: {
      duration: 0.3,
      repeat: 3,
      repeatType: 'reverse' as const
    }
  },
  glitchMedium: {
    textShadow: [
      '3px 0 #ff0000, -3px 0 #00ffff, 3px 0 #ffff00',
      '-3px 0 #ff0000, 3px 0 #00ffff, -3px 0 #ffff00',
      '3px 0 #ff0000, -3px 0 #00ffff, 3px 0 #ffff00'
    ],
    filter: [
      'hue-rotate(0deg) saturate(1)',
      'hue-rotate(180deg) saturate(2)',
      'hue-rotate(0deg) saturate(1)'
    ],
    x: [0, 2, -2, 1, -1, 0],
    skewX: [0, 2, -2, 0],
    transition: {
      duration: 0.5,
      repeat: 4,
      repeatType: 'reverse' as const
    }
  },
  glitchHigh: {
    textShadow: [
      '5px 0 #ff0000, -5px 0 #00ffff, 5px 0 #ffff00, -5px 0 #ff00ff',
      '-5px 0 #ff0000, 5px 0 #00ffff, -5px 0 #ffff00, 5px 0 #ff00ff',
      '5px 0 #ff0000, -5px 0 #00ffff, 5px 0 #ffff00, -5px 0 #ff00ff'
    ],
    filter: [
      'hue-rotate(0deg) saturate(1)',
      'hue-rotate(180deg) saturate(3)',
      'hue-rotate(270deg) saturate(2)',
      'hue-rotate(0deg) saturate(1)'
    ],
    x: [0, 3, -3, 2, -2, 1, -1, 0],
    skewX: [0, 5, -5, 2, -2, 0],
    scaleY: [1, 1.02, 0.98, 1],
    transition: {
      duration: 0.7,
      repeat: 6,
      repeatType: 'reverse' as const
    }
  }
}

export function GlitchText({ 
  children, 
  className = '', 
  intensity = 'medium',
  trigger = 'hover',
  isActive = false
}: GlitchTextProps) {
  const controls = useAnimation()

  useEffect(() => {
    if (trigger === 'continuous') {
      const interval = setInterval(() => {
        const glitchType = `glitch${intensity.charAt(0).toUpperCase() + intensity.slice(1)}` as keyof typeof glitchVariants
        controls.start(glitchType).then(() => {
          controls.start('idle')
        })
      }, 3000 + Math.random() * 4000) // Random intervals between 3-7 seconds

      return () => clearInterval(interval)
    }
  }, [controls, intensity, trigger])

  useEffect(() => {
    if (trigger === 'manual' && isActive) {
      const glitchType = `glitch${intensity.charAt(0).toUpperCase() + intensity.slice(1)}` as keyof typeof glitchVariants
      controls.start(glitchType).then(() => {
        controls.start('idle')
      })
    }
  }, [isActive, controls, intensity, trigger])

  const handleTrigger = () => {
    if (trigger === 'hover') {
      const glitchType = `glitch${intensity.charAt(0).toUpperCase() + intensity.slice(1)}` as keyof typeof glitchVariants
      controls.start(glitchType).then(() => {
        controls.start('idle')
      })
    }
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={glitchVariants}
      animate={controls}
      initial="idle"
      onHoverStart={handleTrigger}
      style={{ 
        display: 'inline-block',
        position: 'relative'
      }}
    >
      {/* Main text */}
      <span className="relative z-10">{children}</span>
      
      {/* Background corruption layers */}
      <motion.span
        className="absolute top-0 left-0 opacity-20"
        style={{
          color: '#ff0000',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          transform: 'translateY(-1px)'
        }}
        animate={controls}
        variants={{
          idle: { x: 0 },
          [`glitch${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`]: { x: [0, 1, -1, 0] }
        }}
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute top-0 left-0 opacity-20"
        style={{
          color: '#00ffff',
          clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)',
          transform: 'translateY(1px)'
        }}
        animate={controls}
        variants={{
          idle: { x: 0 },
          [`glitch${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`]: { x: [0, -1, 1, 0] }
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}