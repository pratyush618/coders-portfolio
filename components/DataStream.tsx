'use client'

import { useEffect, useRef, useState, memo, useMemo } from 'react'
import { motion } from 'framer-motion'

interface DataStreamProps {
  className?: string
  direction?: 'horizontal' | 'vertical'
  speed?: 'slow' | 'medium' | 'fast'
  density?: 'low' | 'medium' | 'high'
}

interface DataElement {
  id: number
  char: string
  delay: number
  duration: number
  opacity: number
  size: number
  hue: number
  position: number
}

const DataStreamComponent = function DataStream({ 
  className = '', 
  direction = 'horizontal',
  speed = 'medium',
  density = 'medium'
}: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataElements, setDataElements] = useState<DataElement[]>([])
  const [binaryElements, setBinaryElements] = useState<Array<{ id: number, position: number, delay: number, duration: number }>>([])
  const [isClient, setIsClient] = useState(false)

  const speedValues = useMemo(() => ({
    slow: 0.5,
    medium: 1,
    fast: 2
  }), [])

  const densityValues = useMemo(() => ({
    low: 15,
    medium: 25,
    high: 35
  }), [])

  useEffect(() => {
    setIsClient(true)
    
    const generateDataChars = () => {
      const chars = '01'
      const techChars = 'ABCDEF0123456789'
      const symbols = '█▓▒░▀▄■□▪▫'
      
      return Array.from({ length: densityValues[density] }, (_, i) => ({
        id: i,
        char: Math.random() > 0.7 ? 
          techChars[Math.floor(Math.random() * techChars.length)] :
          Math.random() > 0.3 ?
          chars[Math.floor(Math.random() * chars.length)] :
          symbols[Math.floor(Math.random() * symbols.length)],
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
        size: 0.8 + Math.random() * 0.4,
        hue: 170 + Math.random() * 40,
        position: Math.random() * 100
      }))
    }

    const generateBinaryElements = () => {
      return Array.from({ length: Math.floor(densityValues[density] * 0.3) }, (_, i) => ({
        id: i,
        position: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 5 + Math.random() * 3
      }))
    }

    setDataElements(generateDataChars())
    setBinaryElements(generateBinaryElements())
  }, [density])

  if (!isClient) {
    return (
      <div 
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      >
        {/* Static background during SSR */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: direction === 'horizontal' 
              ? 'linear-gradient(90deg, transparent 98%, rgba(6, 182, 212, 0.1) 100%)'
              : 'linear-gradient(0deg, transparent 98%, rgba(6, 182, 212, 0.1) 100%)',
            backgroundSize: direction === 'horizontal' ? '20px 100%' : '100% 20px'
          }}
        />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Background scan lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: direction === 'horizontal' 
            ? 'linear-gradient(90deg, transparent 98%, rgba(6, 182, 212, 0.1) 100%)'
            : 'linear-gradient(0deg, transparent 98%, rgba(6, 182, 212, 0.1) 100%)',
          backgroundSize: direction === 'horizontal' ? '20px 100%' : '100% 20px'
        }}
        animate={{
          backgroundPosition: direction === 'horizontal' 
            ? ['0% 0%', '100% 0%']
            : ['0% 0%', '0% 100%']
        }}
        transition={{
          duration: 8 / speedValues[speed],
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Data characters */}
      {dataElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute font-mono font-bold"
          style={{
            fontSize: `${element.size}rem`,
            color: `hsl(${element.hue}, 100%, 50%)`,
            textShadow: `0 0 10px hsl(${element.hue}, 100%, 50%)`,
            left: direction === 'horizontal' ? '-20px' : `${element.position}%`,
            top: direction === 'vertical' ? '-20px' : `${element.position}%`,
          }}
          animate={
            direction === 'horizontal'
              ? { x: ['0vw', '110vw'] }
              : { y: ['0vh', '110vh'] }
          }
          transition={{
            duration: element.duration / speedValues[speed],
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {element.char}
        </motion.div>
      ))}

      {/* Additional binary rain effect */}
      <div className="absolute inset-0">
        {binaryElements.map((element) => (
          <motion.div
            key={`binary-${element.id}`}
            className="absolute text-xs font-mono opacity-20"
            style={{
              left: direction === 'horizontal' ? '-50px' : `${element.position}%`,
              top: direction === 'vertical' ? '-50px' : `${element.position}%`,
              color: '#06b6d4',
              opacity: 0.2
            }}
            animate={
              direction === 'horizontal'
                ? {
                    x: ['0vw', '110vw'],
                    rotate: [0, 360]
                  }
                : {
                    y: ['0vh', '110vh'],
                    rotate: [0, 360]
                  }
            }
            transition={{
              duration: element.duration / speedValues[speed],
              delay: element.delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {'01'.split('').map((bit, bitIndex) => (
              <motion.span
                key={bitIndex}
                animate={{
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  delay: bitIndex * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                {bit}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Pulsing data nodes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`
          }}
          animate={{
            scale: [1, 2, 1]
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

export const DataStream = memo(DataStreamComponent)