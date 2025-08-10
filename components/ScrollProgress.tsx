'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Show progress bar after scrolling 5%
      setIsVisible(latest > 0.05)
    })

    return unsubscribe
  }, [scrollYProgress])

  if (!isVisible) return null

  return (
    <>
      {/* Main Progress Container */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar Background */}
        <div className="relative h-1 bg-gradient-to-r from-bg-secondary via-border to-bg-secondary">
          {/* Main Progress Bar */}
          <motion.div
            className="absolute inset-0 h-full cyber-gradient origin-left"
            style={{ scaleX }}
            initial={{ scaleX: 0 }}
          />

          {/* Glowing Core */}
          <motion.div
            className="absolute inset-0 h-full origin-left"
            style={{ 
              scaleX,
              background: 'linear-gradient(90deg, transparent, #00ffff, #0099ff, #00ffff, transparent)',
              filter: 'blur(2px)'
            }}
          />

          {/* Neural Network Nodes */}
          {neuralNodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute top-1/2 w-3 h-3 -translate-y-1/2 energy-core rounded-full"
              style={{ left: `${node.position}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut"
              }}
            >
              {/* Node Core */}
              <div className="absolute inset-0 bg-electric-blue rounded-full opacity-80" />
              
              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 border border-cyan-400 rounded-full"
                animate={{
                  scale: [1.0, 2.0, 1.0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: node.delay
                }}
              />
            </motion.div>
          ))}

          {/* Data Stream Effect */}
          <motion.div
            className="absolute top-0 h-full w-16 opacity-70"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), rgba(0, 153, 255, 0.5), rgba(0, 255, 255, 0.3), transparent)',
              filter: 'blur(1px)'
            }}
            animate={{
              x: ['-64px', 'calc(100vw + 64px)']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 2
            }}
          />

          {/* Quantum Interference Lines */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 w-px h-full bg-cyan-400 opacity-40"
                style={{ left: `${20 + i * 15}%` }}
                animate={{
                  scaleY: [0.5, 1.0, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Scan Line */}
        <motion.div
          className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1
          }}
        />
      </motion.div>

      {/* Terminal-Style Progress Display */}
      <motion.div
        className="fixed top-4 right-4 z-[60] pointer-events-none max-sm:top-2 max-sm:right-2 max-sm:scale-90"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ position: 'fixed' }}
      >
        <div className="terminal-window p-3 backdrop-blur-md min-w-[200px] max-sm:min-w-[160px]">
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="cyber-text text-xs opacity-70">NEURAL_INTERFACE</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-green-500 opacity-60" />
            </div>
          </div>

          {/* Progress Info */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <span className="cyber-text">STATUS:</span>
              <motion.span 
                className="text-cyan-400 font-mono"
                key={currentSection}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentSection}
              </motion.span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <span className="cyber-text">PROGRESS:</span>
              <motion.span className="text-green-400 font-mono">
                {progressPercent}%
              </motion.span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-24 h-1 bg-bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
                style={{ scaleX }}
                initial={{ scaleX: 0 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Neural Connection Lines */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 z-[59] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <svg className="w-full h-8" viewBox="0 0 100 8" preserveAspectRatio="none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Connection Lines */}
          {neuralNodes.map((node, i) => (
            <motion.line
              key={`connection-${i}`}
              x1={i > 0 ? neuralNodes[i - 1].position : 0}
              y1="1"
              x2={node.position}
              y2="1"
              stroke="url(#connectionGradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1.0, opacity: 0.6 }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </motion.div>
    </>
  )
}