'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TerminalLoaderProps {
  isVisible: boolean
  onComplete?: () => void
}

const bootSequence = [
  { text: 'SYSTEM INITIALIZING...', delay: 0 },
  { text: 'Loading neural networks...', delay: 800 },
  { text: 'Establishing quantum connections...', delay: 1200 },
  { text: 'Calibrating holographic projectors...', delay: 1600 },
  { text: 'Synchronizing matrix protocols...', delay: 2000 },
  { text: 'Activating cybernetic interfaces...', delay: 2400 },
  { text: 'Portfolio systems online.', delay: 2800 },
  { text: 'Welcome to the digital realm.', delay: 3200 },
]

export function TerminalLoader({ isVisible, onComplete }: TerminalLoaderProps) {
  const [currentLines, setCurrentLines] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const loadLines = async () => {
      for (let i = 0; i < bootSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, bootSequence[i].delay))
        setCurrentLines(prev => [...prev, bootSequence[i].text])
      }
      
      // Wait a moment then complete
      setTimeout(() => {
        setIsComplete(true)
        onComplete?.()
      }, 1000)
    }

    loadLines()
  }, [isVisible, onComplete])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        {/* Background circuit pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Terminal window */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black border border-accent rounded-lg shadow-2xl max-w-2xl w-full mx-4"
          style={{
            boxShadow: '0 0 50px rgba(6, 182, 212, 0.3)'
          }}
        >
          {/* Terminal header */}
          <div className="bg-bg-secondary border-b border-accent px-4 py-2 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-accent font-mono text-sm">Neural_Network_Terminal</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm">
            <div className="space-y-2">
              {currentLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-accent">$</span>
                  <span className="text-text">{line}</span>
                  {index < bootSequence.length - 1 && (
                    <motion.span
                      className="text-green-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      [OK]
                    </motion.span>
                  )}
                </motion.div>
              ))}

              {/* Loading animation */}
              {currentLines.length < bootSequence.length && (
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-accent">$</span>
                  <span className="text-text">Processing...</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-accent rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cursor */}
              {showCursor && currentLines.length === bootSequence.length && (
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-accent">$</span>
                  <span className="w-2 h-5 bg-accent inline-block"></span>
                </motion.div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center space-x-2 text-xs text-text-secondary mb-2">
                <span>SYSTEM STATUS:</span>
                <span className="text-accent">
                  {Math.round((currentLines.length / bootSequence.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <motion.div
                  className="bg-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(currentLines.length / bootSequence.length) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Completion message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="text-center">
                <motion.div
                  className="text-accent font-mono text-lg mb-2"
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(6, 182, 212, 0.5)',
                      '0 0 20px rgba(6, 182, 212, 0.8)',
                      '0 0 5px rgba(6, 182, 212, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ACCESS GRANTED
                </motion.div>
                <motion.div
                  className="text-text-secondary text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Entering the Matrix...
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}