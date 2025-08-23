'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Hand,
  X
} from 'lucide-react'
import { useNavigationGestures } from '@/hooks/useSwipeGestures'

export function MobileGestureOverlay() {
  const [showGestureHints, setShowGestureHints] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const { gestureRef, currentSection, sections } = useNavigationGestures()

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      
      return isMobileDevice || (isTouchDevice && isSmallScreen)
    }

    setIsMobile(checkMobile())

    // Check if user has seen gesture tutorial
    const tutorialSeen = localStorage.getItem('gesture-tutorial-seen')
    setHasSeenTutorial(!!tutorialSeen)

    // Show tutorial for first-time mobile users
    if (checkMobile() && !tutorialSeen) {
      setTimeout(() => {
        setShowGestureHints(true)
      }, 3000) // Show after 3 seconds
    }
  }, [])

  const dismissTutorial = () => {
    setShowGestureHints(false)
    setHasSeenTutorial(true)
    localStorage.setItem('gesture-tutorial-seen', 'true')
  }

  const toggleGestureHints = () => {
    setShowGestureHints(!showGestureHints)
  }

  if (!isMobile) return null

  return (
    <>
      {/* Gesture Detection Overlay */}
      <div 
        ref={gestureRef as any}
        className="fixed inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Gesture Hints Button */}
      {hasSeenTutorial && (
        <motion.button
          className="fixed bottom-20 right-6 z-40 p-3 bg-bg-secondary/80 backdrop-blur-sm border border-accent/20 rounded-full shadow-lg"
          onClick={toggleGestureHints}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Show gesture hints"
        >
          <Hand className="w-5 h-5 text-accent" />
        </motion.button>
      )}

      {/* Navigation Progress Indicator */}
      <motion.div 
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 bg-bg-secondary/80 backdrop-blur-sm rounded-full p-2 border border-accent/20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="space-y-2">
          {sections.map((section, index) => (
            <motion.div
              key={section}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSection 
                  ? 'bg-accent scale-125' 
                  : 'bg-text-secondary/50'
              }`}
              animate={{
                scale: index === currentSection ? 1.25 : 1,
                backgroundColor: index === currentSection ? '#06b6d4' : '#71717a'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Gesture Tutorial Overlay */}
      <AnimatePresence>
        {showGestureHints && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-bg-secondary border border-accent/20 rounded-xl p-6 max-w-sm w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text">Touch Gestures</h3>
                <button
                  onClick={dismissTutorial}
                  className="p-1 text-text-secondary hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gesture Instructions */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border">
                  <ChevronUp className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-medium text-text">Swipe Up</div>
                    <div className="text-sm text-text-secondary">Next section</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border">
                  <ChevronDown className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-medium text-text">Swipe Down</div>
                    <div className="text-sm text-text-secondary">Previous section</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border">
                  <ChevronLeft className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-medium text-text">Swipe Left</div>
                    <div className="text-sm text-text-secondary">Go to Blog</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-border">
                  <ChevronRight className="w-6 h-6 text-accent" />
                  <div>
                    <div className="font-medium text-text">Swipe Right</div>
                    <div className="text-sm text-text-secondary">Go Home</div>
                  </div>
                </div>
              </div>

              {/* Haptic Feedback Notice */}
              <div className="mt-6 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <span className="text-accent font-medium">💫 Haptic Feedback:</span> 
                  Feel subtle vibrations as you navigate for enhanced interaction
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={dismissTutorial}
                  className="flex-1 bg-accent text-bg font-medium py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Got it!
                </button>
                <button
                  onClick={() => setShowGestureHints(false)}
                  className="px-4 py-3 text-text-secondary hover:text-text transition-colors"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick gesture hints (subtle) */}
      {!showGestureHints && hasSeenTutorial && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-bg-secondary/60 backdrop-blur-sm rounded-lg p-2 border border-accent/10">
            <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <ChevronUp className="w-3 h-3" />
                Next
              </span>
              <span className="flex items-center gap-1">
                <ChevronDown className="w-3 h-3" />
                Prev
              </span>
              <span className="flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" />
                Blog
              </span>
              <span className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                Home
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
