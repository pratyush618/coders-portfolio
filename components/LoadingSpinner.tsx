'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function LoadingSpinner({ size = 'md', color = 'accent' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-transparent border-t-${color} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

export function PulsingDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="w-2 h-2 bg-accent rounded-full"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay
      }}
    />
  )
}

export function LoadingDots() {
  return (
    <div className="flex space-x-2 items-center justify-center">
      <PulsingDot delay={0} />
      <PulsingDot delay={0.2} />
      <PulsingDot delay={0.4} />
    </div>
  )
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton animate-pulse rounded ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <SkeletonLoader className="h-48 rounded-lg" />
      <div className="space-y-3">
        <SkeletonLoader className="h-6 w-3/4" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-2/3" />
        <div className="flex space-x-2">
          <SkeletonLoader className="h-6 w-16" />
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-6 w-18" />
        </div>
      </div>
    </div>
  )
}