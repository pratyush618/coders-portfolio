'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  useEffect(() => {
    // Update document title
    document.title = 'Offline - Claude Portfolio'
  }, [])
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative">
            <WifiOff 
              className="w-24 h-24 mx-auto text-accent mb-4" 
              strokeWidth={1.5}
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 w-24 h-24 mx-auto border-2 border-accent rounded-full"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-bold text-text mb-4"
        >
          You're Offline
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-text-secondary mb-8 leading-relaxed"
        >
          Don't worry! Some content might still be available from your cache. 
          Check your connection and try again.
        </motion.p>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8 p-4 bg-bg-secondary border border-border rounded-lg"
        >
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <WifiOff className="w-5 h-5" />
            <span>Connection Status: Offline</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-accent hover:bg-accent-hover text-bg font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 bg-bg-secondary hover:bg-border text-text font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-border hover:border-accent"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-bg-secondary hover:bg-border text-text font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-border hover:border-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Cached Content Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-lg"
        >
          <p className="text-sm text-text-secondary">
            <strong className="text-accent">Pro Tip:</strong> Previously visited pages 
            might still work offline thanks to smart caching!
          </p>
        </motion.div>

        {/* Auto-retry indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-6"
        >
          <div className="text-xs text-text-secondary">
            Auto-retrying when connection returns...
          </div>
          <motion.div
            className="w-full bg-bg-secondary rounded-full h-1 mt-2 overflow-hidden"
          >
            <motion.div
              className="h-full bg-accent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ width: '30%' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Auto-retry logic */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-retry when back online
            window.addEventListener('online', function() {
              setTimeout(function() {
                window.location.reload();
              }, 1000);
            });
            
            // Periodic retry
            let retryCount = 0;
            const maxRetries = 5;
            
            function periodicRetry() {
              if (retryCount < maxRetries) {
                fetch('/', { method: 'HEAD' })
                  .then(() => {
                    window.location.reload();
                  })
                  .catch(() => {
                    retryCount++;
                    setTimeout(periodicRetry, 10000); // Retry every 10 seconds
                  });
              }
            }
            
            setTimeout(periodicRetry, 5000); // Start after 5 seconds
          `
        }}
      />
    </div>
  )
}
