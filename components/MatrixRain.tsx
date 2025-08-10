'use client'

import { useEffect, useRef, memo } from 'react'

interface MatrixChar {
  x: number
  y: number
  char: string
  speed: number
  opacity: number
}

const MatrixRainComponent = function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<MatrixChar[][]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const targetFPS = 15 // Reduced FPS for better performance

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Optimized character set - fewer characters for better performance
    const characters = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF01!@#$%'
    const fontSize = 12
    const columns = Math.floor(window.innerWidth / fontSize / 1.5)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initColumns = () => {
      columnsRef.current = []
      for (let i = 0; i < columns; i++) {
        columnsRef.current[i] = []
        // Start some columns at different heights for variety
        const startHeight = Math.random() * canvas.height
        for (let j = 0; j < Math.floor(canvas.height / fontSize / 1.2); j++) {
          columnsRef.current[i].push({
            x: i * fontSize,
            y: startHeight + (j * fontSize),
            char: characters[Math.floor(Math.random() * characters.length)],
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.1
          })
        }
      }
    }

    const updateMatrix = () => {
      columnsRef.current.forEach((column, colIndex) => {
        column.forEach((char, charIndex) => {
          // Move character down
          char.y += char.speed

          // Reset character when it goes off screen
          if (char.y > canvas.height + fontSize) {
            char.y = -fontSize * Math.random() * 20
            char.char = characters[Math.floor(Math.random() * characters.length)]
            char.speed = Math.random() * 2 + 0.5
            char.opacity = Math.random() * 0.8 + 0.1
          }

          // Randomly change character (reduced frequency)
          if (Math.random() < 0.002) {
            char.char = characters[Math.floor(Math.random() * characters.length)]
          }

          // Create fade effect - brighter at the front of the trail
          const isLeadChar = charIndex === column.findIndex(c => c.y === Math.max(...column.map(ch => ch.y)))
          char.opacity = isLeadChar ? 1 : char.opacity * 0.98
        })
      })
    }

    const drawMatrix = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'Space Mono', monospace`
      ctx.textAlign = 'start'

      columnsRef.current.forEach(column => {
        column.forEach(char => {
          // Skip if character is not visible
          if (char.y < -fontSize || char.y > canvas.height + fontSize) return

          const opacity = Math.max(0.1, char.opacity)
          
          // Create gradient effect - brighter green at the front
          if (char.opacity > 0.7) {
            // Leading character - bright green with glow
            ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`
            ctx.shadowColor = '#00ff41'
            ctx.shadowBlur = 8
          } else if (char.opacity > 0.4) {
            // Middle characters - medium green
            ctx.fillStyle = `rgba(0, 200, 50, ${opacity})`
            ctx.shadowColor = '#00ff41'
            ctx.shadowBlur = 4
          } else {
            // Trailing characters - dark green
            ctx.fillStyle = `rgba(0, 150, 30, ${opacity})`
            ctx.shadowBlur = 0
          }

          ctx.fillText(char.char, char.x, char.y)
          ctx.shadowBlur = 0
        })
      })
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current
      const targetDelta = 1000 / targetFPS
      
      if (deltaTime >= targetDelta) {
        updateMatrix()
        drawMatrix()
        lastFrameTimeRef.current = currentTime
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initColumns()
    animate(0)

    const handleResize = () => {
      resizeCanvas()
      initColumns()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-15 z-0 gpu-accelerated"
      style={{ 
        mixBlendMode: 'multiply',
        filter: 'contrast(1.1) brightness(1.05)'
      }}
    />
  )
}

export const MatrixRain = memo(MatrixRainComponent)