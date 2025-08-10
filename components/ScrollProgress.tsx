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
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-accent origin-left pointer-events-none"
      style={{ scaleX }}
      initial={{ scaleX: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ opacity: { duration: 0.3 } }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-accent blur-sm opacity-70"
        style={{ scaleX }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent w-24"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </motion.div>
  )
}