'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { motion } from 'framer-motion'

interface HexCell {
  x: number
  y: number
  centerX: number
  centerY: number
  active: boolean
  energy: number
  pulsePhase: number
}

const HexGridComponent = function HexGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hexGridRef = useRef<HexCell[][]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const targetFPS = 24
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const hexSize = 30
    const hexWidth = hexSize * 2
    const hexHeight = Math.sqrt(3) * hexSize
    let rows: number
    let cols: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      rows = Math.ceil(canvas.height / hexHeight * 1.2) + 1
      cols = Math.ceil(canvas.width / (hexWidth * 0.75)) + 1
    }

    const initHexGrid = () => {
      hexGridRef.current = []
      for (let row = 0; row < rows; row++) {
        hexGridRef.current[row] = []
        for (let col = 0; col < cols; col++) {
          const x = col * hexWidth * 0.75
          const y = row * hexHeight + (col % 2) * hexHeight * 0.5
          
          hexGridRef.current[row][col] = {
            x,
            y,
            centerX: x,
            centerY: y,
            active: false,
            energy: 0,
            pulsePhase: Math.random() * Math.PI * 2
          }
        }
      }
      setIsLoaded(true)
    }

    const drawHexagon = (centerX: number, centerY: number, size: number, ctx: CanvasRenderingContext2D) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const x = centerX + size * Math.cos(angle)
        const y = centerY + size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
    }

    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    }

    const updateHexGrid = () => {
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const influence = 150

      hexGridRef.current.forEach((row, rowIndex) => {
        row.forEach((hex, colIndex) => {
          const distance = getDistance(hex.centerX, hex.centerY, mouseX, mouseY)
          
          // Update pulse phase
          hex.pulsePhase += 0.03
          if (hex.pulsePhase > Math.PI * 2) hex.pulsePhase = 0

          // Mouse influence
          if (distance < influence) {
            hex.active = true
            hex.energy = Math.max(hex.energy, (1 - distance / influence) * 100)
          } else {
            hex.active = false
            hex.energy *= 0.95 // Gradual decay
          }

          // Random activation for ambient effect (reduced frequency)
          if (Math.random() < 0.0005) {
            hex.energy = Math.max(hex.energy, Math.random() * 30)
          }
        })
      })
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      hexGridRef.current.forEach((row) => {
        row.forEach((hex) => {
          const baseOpacity = 0.1
          const energyOpacity = Math.min(hex.energy / 100, 0.8)
          const pulseEffect = Math.sin(hex.pulsePhase) * 0.3 + 0.7
          const finalOpacity = (baseOpacity + energyOpacity) * pulseEffect

          if (finalOpacity > 0.05) {
            ctx.save()
            
            // Set colors based on energy level
            if (hex.energy > 70) {
              ctx.strokeStyle = `rgba(0, 255, 65, ${finalOpacity})` // Matrix green
              ctx.shadowColor = '#00ff41'
              ctx.shadowBlur = 5
              ctx.lineWidth = 2
            } else if (hex.energy > 40) {
              ctx.strokeStyle = `rgba(6, 182, 212, ${finalOpacity})` // Cyan
              ctx.shadowColor = '#06b6d4'
              ctx.shadowBlur = 3
              ctx.lineWidth = 1.5
            } else if (hex.energy > 10) {
              ctx.strokeStyle = `rgba(64, 224, 208, ${finalOpacity})` // Turquoise
              ctx.lineWidth = 1
            } else {
              ctx.strokeStyle = `rgba(100, 150, 200, ${finalOpacity})` // Dim blue
              ctx.lineWidth = 0.5
            }

            // Draw hexagon
            drawHexagon(hex.centerX, hex.centerY, hexSize * 0.8, ctx)
            ctx.stroke()

            // Draw center dot for high energy cells
            if (hex.energy > 50) {
              ctx.beginPath()
              ctx.arc(hex.centerX, hex.centerY, 2, 0, Math.PI * 2)
              ctx.fillStyle = ctx.strokeStyle
              ctx.fill()
            }

            ctx.restore()
          }
        })
      })

      // Draw connection lines between active hexagons
      hexGridRef.current.forEach((row, rowIndex) => {
        row.forEach((hex, colIndex) => {
          if (hex.energy > 30) {
            // Check neighboring hexagons
            const neighbors = [
              { row: rowIndex - 1, col: colIndex },
              { row: rowIndex + 1, col: colIndex },
              { row: rowIndex, col: colIndex - 1 },
              { row: rowIndex, col: colIndex + 1 },
              { row: rowIndex + (colIndex % 2 === 0 ? -1 : 1), col: colIndex - 1 },
              { row: rowIndex + (colIndex % 2 === 0 ? -1 : 1), col: colIndex + 1 }
            ]

            neighbors.forEach(({ row: nRow, col: nCol }) => {
              if (
                nRow >= 0 && nRow < hexGridRef.current.length &&
                nCol >= 0 && nCol < hexGridRef.current[nRow].length
              ) {
                const neighbor = hexGridRef.current[nRow][nCol]
                if (neighbor.energy > 30) {
                  const connectionOpacity = Math.min(hex.energy, neighbor.energy) / 200
                  if (connectionOpacity > 0.1) {
                    ctx.save()
                    ctx.strokeStyle = `rgba(6, 182, 212, ${connectionOpacity})`
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(hex.centerX, hex.centerY)
                    ctx.lineTo(neighbor.centerX, neighbor.centerY)
                    ctx.stroke()
                    ctx.restore()
                  }
                }
              }
            })
          }
        })
      })
    }

    const animate = (frameTime: number) => {
      const deltaTime = frameTime - lastFrameTimeRef.current
      const targetDelta = 1000 / targetFPS
      
      if (deltaTime >= targetDelta) {
        updateHexGrid()
        drawGrid()
        lastFrameTimeRef.current = frameTime
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleResize = () => {
      resizeCanvas()
      initHexGrid()
    }

    resizeCanvas()
    initHexGrid()
    animate(0)

    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 0.7 : 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'screen',
        filter: 'contrast(1.1) brightness(1.2)'
      }}
    />
  )
}

export const HexGrid = memo(HexGridComponent)