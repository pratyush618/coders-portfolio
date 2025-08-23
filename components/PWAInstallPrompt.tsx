'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      try {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone) {
          setIsInstalled(true)
          return true
        }
      } catch (error) {
        console.debug('[PWA] Display mode detection not supported:', error)
      }
      return false
    }

    // Check if iOS device
    const checkIfIOS = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      setIsIOSDevice(isIOS)
      return isIOS
    }

    // Check if prompt was previously dismissed
    const checkDismissed = () => {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed')
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0
      const now = Date.now()
      const oneWeek = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
      
      if (now - dismissedTime < oneWeek) {
        setIsDismissed(true)
        return true
      }
      return false
    }

    const installed = checkIfInstalled()
    const iOS = checkIfIOS()
    const dismissed = checkDismissed()

    if (installed || dismissed) return

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      
      // Show prompt after a delay if user hasn't dismissed it
      setTimeout(() => {
        if (!isDismissed && !isInstalled) {
          setShowPrompt(true)
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed successfully')
      setIsInstalled(true)
      setShowPrompt(false)
      setShowIOSPrompt(false)
      
      // Clean up
      setDeferredPrompt(null)
      
      // Show a thank you message
      showInstallationSuccess()
    }

    // iOS specific logic
    if (iOS && !installed && !dismissed) {
      // Check if user has seen iOS prompt recently
      const iosPromptSeen = localStorage.getItem('ios-prompt-seen')
      const iosPromptTime = iosPromptSeen ? parseInt(iosPromptSeen, 10) : 0
      const threeDays = 3 * 24 * 60 * 60 * 1000
      
      if (Date.now() - iosPromptTime > threeDays) {
        setTimeout(() => {
          setShowIOSPrompt(true)
        }, 15000) // Show iOS prompt after 15 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isDismissed, isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log('[PWA] User choice:', outcome)
      
      if (outcome === 'dismissed') {
        handleDismiss()
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('[PWA] Installation failed:', error)
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSPrompt(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
    
    if (isIOSDevice) {
      localStorage.setItem('ios-prompt-seen', Date.now().toString())
    }
  }

  const showInstallationSuccess = () => {
    // Create a simple success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 z-50 bg-accent text-bg px-6 py-3 rounded-lg shadow-lg font-medium'
    notification.textContent = '🎉 Portfolio installed successfully!'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 5000)
  }

  const AndroidPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-bg-secondary border border-accent/20 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-sm"
      style={{
        boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
      }}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-text-secondary hover:text-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-accent/10 rounded-lg">
          <Download className="w-6 h-6 text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text mb-1">
            Install Portfolio App
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            Get faster access with offline support and app-like experience
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-accent text-bg px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="text-text-secondary hover:text-text px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Smartphone className="w-3 h-3" />
          <span>Offline access</span>
          <span>•</span>
          <Monitor className="w-3 h-3" />
          <span>Faster loading</span>
          <span>•</span>
          <span>App shortcuts</span>
        </div>
      </div>
    </motion.div>
  )

  const IOSPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-4 left-4 right-4 bg-bg-secondary border border-accent/20 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-sm"
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-text-secondary hover:text-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-accent/10 rounded-lg">
          <Share className="w-6 h-6 text-accent" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1">
            Install Portfolio App
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            Tap the share button below and select "Add to Home Screen" for a better experience
          </p>
          
          {/* iOS Installation Steps */}
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-[10px]">1</div>
              <span>Tap the Share button in Safari</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-[10px]">2</div>
              <span>Scroll down and tap "Add to Home Screen"</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-[10px]">3</div>
              <span>Tap "Add" to install</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <button
              onClick={handleDismiss}
              className="text-text-secondary hover:text-text text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Don't render anything if app is installed or user dismissed
  if (isInstalled || isDismissed) return null

  return (
    <>
      <AnimatePresence>
        {showPrompt && deferredPrompt && <AndroidPrompt />}
        {showIOSPrompt && isIOSDevice && !deferredPrompt && <IOSPrompt />}
      </AnimatePresence>
    </>
  )
}
