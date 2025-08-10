'use client'

import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CyberTerminalProps {
  commands?: string[]
  autoStart?: boolean
  className?: string
  speed?: 'slow' | 'medium' | 'fast'
  prompt?: string
}

const CyberTerminalComponent = function CyberTerminal({
  commands = [
    'INITIALIZING NEURAL NETWORK...',
    'CONNECTING TO MAINFRAME...',
    'ACCESSING ENCRYPTED DATA...',
    'QUANTUM DECRYPTION COMPLETE.',
    'SYSTEM READY FOR INTERACTION.'
  ],
  autoStart = true,
  className = '',
  speed = 'medium',
  prompt = 'root@cyber-net:~$'
}: CyberTerminalProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const speeds = {
    slow: 100,
    medium: 50,
    fast: 25
  }

  useEffect(() => {
    if (!autoStart || isComplete) return

    const typewriterInterval = setInterval(() => {
      if (currentLine < commands.length) {
        const currentCommand = commands[currentLine]
        
        if (currentChar < currentCommand.length) {
          setDisplayedLines(prev => {
            const newLines = [...prev]
            newLines[currentLine] = currentCommand.slice(0, currentChar + 1)
            return newLines
          })
          setCurrentChar(prev => prev + 1)
        } else {
          // Line complete, move to next
          setTimeout(() => {
            setCurrentLine(prev => prev + 1)
            setCurrentChar(0)
          }, 500)
        }
      } else {
        setIsComplete(true)
      }
    }, speeds[speed])

    return () => clearInterval(typewriterInterval)
  }, [currentLine, currentChar, commands, autoStart, isComplete, speed, speeds])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className={`terminal-window p-6 font-mono text-sm ${className}`}>
      {/* Terminal header */}
      <div className="flex items-center justify-between mb-4 pt-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-60"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-60"></div>
        </div>
        <div className="cyber-text text-xs opacity-70">SECURE_TERMINAL_v2.1</div>
      </div>

      {/* Terminal content */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayedLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              {index === 0 && (
                <span className="text-cyan-400 opacity-70">{prompt}</span>
              )}
              <span className="text-green-400 neural-glow">
                {line}
                {index === currentLine && showCursor && (
                  <span className="terminal-cursor bg-green-400 ml-1 animate-pulse">|</span>
                )}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current input line */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center space-x-2 mt-4"
          >
            <span className="text-cyan-400 opacity-70">{prompt}</span>
            <span className="text-cyan-300">
              {showCursor && (
                <span className="terminal-cursor bg-cyan-400 animate-pulse">|</span>
              )}
            </span>
          </motion.div>
        )}
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-line opacity-30"></div>
      </div>
    </div>
  )
}

export const CyberTerminal = memo(CyberTerminalComponent)
