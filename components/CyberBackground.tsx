'use client'

import { useEffect, useRef, memo, useMemo } from 'react'

interface CyberBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  enableParticles?: boolean
  enableGrid?: boolean
  enableScanLines?: boolean
}

const CyberBackgroundComponent = function CyberBackground({
  intensity = 'medium',
  className = '',
  enableParticles = true,
  enableGrid = true,
  enableScanLines = true
}: CyberBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    hue: number
    type: 'node' | 'data' | 'energy'
  }>>([])
  const lastFrameTimeRef = useRef<number>(0)

  // Performance settings based on intensity
  const settings = useMemo(() => {
    const configs = {
      low: {
        particleCount: 15,
        targetFPS: 20,
        gridOpacity: 0.02,
        scanIntensity: 0.1
      },
      medium: {
        particleCount: 25,
        targetFPS: 30,
        gridOpacity: 0.04,
        scanIntensity: 0.15
      },
      high: {
        particleCount: 35,
        targetFPS: 45,
        gridOpacity: 0.06,
        scanIntensity: 0.2
      }
    }
    return configs[intensity]
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    const initParticles = () => {
      if (!enableParticles) return
      
      particlesRef.current = Array.from({ length: settings.particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        hue: 180 + Math.random() * 40,
        type: Math.random() > 0.7 ? 'energy' : Math.random() > 0.4 ? 'node' : 'data'
      }))
    }

    const updateParticles = () => {
      if (!enableParticles) return

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Subtle opacity animation
        particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01
        particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity))
      })
    }

    const drawParticles = () => {
      if (!enableParticles) return

      particlesRef.current.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity

        // Different styles based on particle type
        switch (particle.type) {
          case 'node':
            ctx.fillStyle = `hsl(${particle.hue}, 100%, 50%)`
            ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`
            ctx.shadowBlur = particle.size * 2
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fill()
            break

          case 'data':
            ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`
            ctx.shadowBlur = particle.size
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2)
            ctx.fill()
            break

          case 'energy':
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size * 3
            )
            gradient.addColorStop(0, `hsl(${particle.hue}, 100%, 60%)`)
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
            ctx.fill()
            break
        }

        ctx.restore()
      })
    }

    const drawConnections = () => {
      if (!enableParticles || particlesRef.current.length < 2) return

      const maxDistance = 100
      let connectionCount = 0
      const maxConnections = 8

      for (let i = 0; i < particlesRef.current.length && connectionCount < maxConnections; i++) {
        for (let j = i + 1; j < particlesRef.current.length && connectionCount < maxConnections; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            connectionCount++
            const opacity = (1 - distance / maxDistance) * 0.2

            ctx.save()
            ctx.globalAlpha = opacity
            ctx.strokeStyle = `hsl(${185}, 60%, 50%)`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current
      const targetDelta = 1000 / settings.targetFPS

      if (deltaTime >= targetDelta) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        updateParticles()
        drawConnections()
        drawParticles()
        
        lastFrameTimeRef.current = currentTime
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate(0)

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [settings, enableParticles])

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Animated grid background */}
      {enableGrid && (
        <div 
          className="absolute inset-0 data-visualization opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, ${settings.gridOpacity}) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, ${settings.gridOpacity}) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
            animation: 'cyber-border-flow 20s linear infinite'
          }}
        />
      )}

      {/* Particle canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 mix-blend-screen"
        style={{ opacity: 0.7 }}
      />

      {/* Scan lines */}
      {enableScanLines && (
        <>
          <div 
            className="absolute inset-0 interference opacity-20"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, ${settings.scanIntensity * 0.3}) 2px,
                rgba(0, 255, 255, ${settings.scanIntensity * 0.3}) 4px
              )`
            }}
          />
          
          {/* Moving scan line */}
          <div
            className="absolute w-full h-0.5 scan-line opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
              boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff'
            }}
          />
        </>
      )}

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400 opacity-40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400 opacity-40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400 opacity-40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 opacity-40" />

      {/* Ambient glow spots */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 energy-core"
        style={{
          background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-10 energy-core"
        style={{
          background: 'radial-gradient(circle, #0099ff 0%, transparent 70%)',
          filter: 'blur(40px)',
          animationDelay: '2s'
        }}
      />
    </div>
  )
}

export const CyberBackground = memo(CyberBackgroundComponent)
