'use client'

import { motion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface HolographicCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function HolographicCard({ 
  children, 
  className = '', 
  glowColor = '06b6d4',
  intensity = 0.5 
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseMove={(e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      }}
      onMouseLeave={() => {
        if (cardRef.current) {
          cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
        }
      }}
    >
      {/* Holographic border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: `linear-gradient(45deg, transparent, #${glowColor}40, transparent)`,
          filter: 'blur(1px)',
        }}
        animate={{
          background: [
            `linear-gradient(0deg, transparent, #${glowColor}40, transparent)`,
            `linear-gradient(90deg, transparent, #${glowColor}40, transparent)`,
            `linear-gradient(180deg, transparent, #${glowColor}40, transparent)`,
            `linear-gradient(270deg, transparent, #${glowColor}40, transparent)`,
            `linear-gradient(360deg, transparent, #${glowColor}40, transparent)`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main card background */}
      <div className="relative bg-bg-secondary/80 backdrop-blur-sm border border-border rounded-xl">
        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, #${glowColor}, transparent)`,
              boxShadow: `0 0 10px #${glowColor}`
            }}
            animate={{
              y: [0, 300, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-accent rounded-tl-xl opacity-60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-accent rounded-tr-xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-accent rounded-bl-xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-accent rounded-br-xl opacity-60" />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-20"
          style={{
            boxShadow: `inset 0 0 50px rgba(6, 182, 212, ${intensity})`,
          }}
          animate={{
            boxShadow: [
              `inset 0 0 50px rgba(6, 182, 212, ${intensity})`,
              `inset 0 0 80px rgba(6, 182, 212, ${intensity * 1.5})`,
              `inset 0 0 50px rgba(6, 182, 212, ${intensity})`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* External glow */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-30 -z-10"
        style={{
          boxShadow: `0 0 30px rgba(6, 182, 212, ${intensity * 0.5})`,
        }}
        whileHover={{
          boxShadow: `0 0 50px rgba(6, 182, 212, ${intensity})`,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}