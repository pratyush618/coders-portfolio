'use client'

import { useEffect, useRef, memo } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  pulsePhase: number
  glowIntensity: number
  type: 'node' | 'data' | 'pulse'
  energy: number
}

const ParticleBackgroundComponent = function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const targetFPS = 30

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => {
      const particleType = Math.random()
      let type: 'node' | 'data' | 'pulse'
      let size: number
      let speed: number

      if (particleType < 0.6) {
        type = 'node'
        size = Math.random() * 3 + 2
        speed = 0.2
      } else if (particleType < 0.85) {
        type = 'data'
        size = Math.random() * 1.5 + 0.5
        speed = 0.8
      } else {
        type = 'pulse'
        size = Math.random() * 4 + 1
        speed = 0.3
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: size,
        opacity: Math.random() * 0.6 + 0.3,
        hue: 188 + Math.random() * 30 - 15,
        pulsePhase: Math.random() * Math.PI * 2,
        glowIntensity: Math.random() * 0.8 + 0.2,
        type: type,
        energy: Math.random() * 100
      }
    }

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(25, Math.floor((canvas.width * canvas.height) / 25000))
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    const updateParticle = (particle: Particle, time: number) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      // Update pulse phase for animations
      particle.pulsePhase += 0.02
      if (particle.pulsePhase > Math.PI * 2) particle.pulsePhase = 0

      // Different update behavior based on type
      switch (particle.type) {
        case 'node':
          // Nodes pulse slowly and maintain position
          particle.opacity = 0.4 + Math.sin(particle.pulsePhase) * 0.3
          particle.glowIntensity = 0.5 + Math.sin(particle.pulsePhase) * 0.5
          break
        case 'data':
          // Data packets move faster and flicker
          particle.opacity = 0.3 + Math.sin(particle.pulsePhase * 3) * 0.4
          particle.energy -= 0.5
          if (particle.energy <= 0) {
            particle.energy = 100
            particle.hue = 188 + Math.random() * 30 - 15
          }
          break
        case 'pulse':
          // Pulse particles have expanding/contracting glow
          particle.glowIntensity = 0.2 + Math.sin(particle.pulsePhase * 2) * 0.8
          particle.size = particle.size * (1 + Math.sin(particle.pulsePhase) * 0.1)
          break
      }
    }

    const drawParticle = (particle: Particle) => {
      const { x, y, size, opacity, hue, glowIntensity, type } = particle
      
      ctx.save()
      ctx.globalAlpha = opacity

      // Different rendering based on particle type
      switch (type) {
        case 'node':
          // Main node circle with strong glow
          ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
          ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
          ctx.shadowBlur = size * glowIntensity * 3
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()

          // Inner core
          ctx.globalAlpha = opacity * 1.5
          ctx.fillStyle = `hsl(${hue}, 100%, 80%)`
          ctx.shadowBlur = size
          ctx.beginPath()
          ctx.arc(x, y, size * 0.4, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'data':
          // Smaller, flickering data packets
          ctx.fillStyle = `hsl(${hue}, 80%, 50%)`
          ctx.shadowColor = `hsl(${hue}, 80%, 50%)`
          ctx.shadowBlur = size * 1.5
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()

          // Add trailing effect
          if (particle.energy > 80) {
            ctx.globalAlpha = opacity * 0.3
            ctx.fillStyle = `hsl(${hue}, 60%, 40%)`
            ctx.beginPath()
            ctx.arc(x - particle.vx * 5, y - particle.vy * 5, size * 0.7, 0, Math.PI * 2)
            ctx.fill()
          }
          break

        case 'pulse':
          // Pulsing particles with dynamic size
          const pulseSize = size * (1 + glowIntensity * 0.5)
          ctx.fillStyle = `hsl(${hue}, 90%, 55%)`
          ctx.shadowColor = `hsl(${hue}, 90%, 55%)`
          ctx.shadowBlur = pulseSize * glowIntensity * 2
          ctx.beginPath()
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
          ctx.fill()

          // Outer ring effect
          ctx.globalAlpha = opacity * 0.3
          ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, pulseSize * 1.5, 0, Math.PI * 2)
          ctx.stroke()
          break
      }
      
      ctx.restore()
    }

    const drawConnections = () => {
      const particles = particlesRef.current
      const maxDistance = 120
      const maxConnections = 3
      let connectionCount = 0

      for (let i = 0; i < particles.length && connectionCount < maxConnections * particles.length; i++) {
        let particleConnections = 0
        for (let j = i + 1; j < particles.length && particleConnections < maxConnections; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            connectionCount++
            particleConnections++
            const opacity = (1 - distance / maxDistance) * 0.3
            
            // Different connection styles based on particle types
            ctx.save()
            ctx.globalAlpha = opacity

            if (p1.type === 'node' && p2.type === 'node') {
              // Strong connections between nodes
              ctx.strokeStyle = `hsl(188, 100%, 50%)`
              ctx.lineWidth = 2
              ctx.shadowColor = `hsl(188, 100%, 50%)`
              ctx.shadowBlur = 3
            } else if ((p1.type === 'data' && p2.type === 'node') || (p1.type === 'node' && p2.type === 'data')) {
              // Data flow connections
              ctx.strokeStyle = `hsl(200, 80%, 45%)`
              ctx.lineWidth = 1.5
              
              // Animated dash pattern for data flow
              const dashOffset = (Date.now() * 0.01) % 10
              ctx.setLineDash([5, 5])
              ctx.lineDashOffset = dashOffset
            } else {
              // Weak connections between other particles
              ctx.strokeStyle = `hsl(180, 60%, 40%)`
              ctx.lineWidth = 0.8
            }

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.setLineDash([]) // Reset dash pattern
            ctx.restore()

            // Add energy pulse effect on strong connections
            if (p1.type === 'node' && p2.type === 'node' && Math.random() < 0.02) {
              const pulsePosition = Math.random()
              const pulseX = p1.x + (p2.x - p1.x) * pulsePosition
              const pulseY = p1.y + (p2.y - p1.y) * pulsePosition
              
              ctx.save()
              ctx.globalAlpha = 0.8
              ctx.fillStyle = `hsl(180, 100%, 70%)`
              ctx.shadowColor = `hsl(180, 100%, 70%)`
              ctx.shadowBlur = 8
              ctx.beginPath()
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          }
        }
      }
    }

    const animate = (frameTime: number) => {
      const deltaTime = frameTime - lastFrameTimeRef.current
      const targetDelta = 1000 / targetFPS
      
      if (deltaTime >= targetDelta) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const currentTime = Date.now() * 0.001

        particlesRef.current.forEach(particle => {
          updateParticle(particle, currentTime)
          drawParticle(particle)
        })

        drawConnections()
        lastFrameTimeRef.current = frameTime
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export const ParticleBackground = memo(ParticleBackgroundComponent)