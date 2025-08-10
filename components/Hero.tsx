'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { siteConfig } from '@/lib/siteConfig'
import { scrollToElement } from '@/lib/utils'
import { CyberBackground } from './CyberBackground'
import { MatrixRain } from './MatrixRain'
import { GlitchText } from './GlitchText'
import { CyberTerminal } from './CyberTerminal'

export function Hero() {
  const handleScrollToAbout = () => {
    scrollToElement('about')
  }

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail,
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden interference"
    >
      {/* Enhanced cyberpunk background */}
      <div className="absolute inset-0 cyber-gradient" />
      
      {/* Optimized background elements */}
      <CyberBackground intensity="medium" enableParticles enableGrid enableScanLines />
      <MatrixRain />
      
      {/* Animated background elements - reduced count */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent/4 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg cyber-text font-medium"
            >
              <GlitchText intensity="low" trigger="continuous">
                {'> NEURAL_LINK_ESTABLISHED'}
              </GlitchText>
            </motion.p>

            <h1 className="heading-1 text-text">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block neon-glow"
              >
                <GlitchText intensity="medium" trigger="hover">
                  {siteConfig.author.name}
                </GlitchText>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold quantum-text"
            >
              <GlitchText intensity="low" trigger="hover">
                {siteConfig.author.role}
              </GlitchText>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-2xl mx-auto body-large"
            >
              Specializing in modern web technologies, TypeScript, and creating
              exceptional user experiences. Let&apos;s build something amazing together.
            </motion.p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center space-x-6 mt-8"
          >
            {Object.entries(siteConfig.social).map(([platform, url], index) => {
              const Icon = socialIcons[platform as keyof typeof socialIcons]
              if (!Icon) return null

              return (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="group relative p-3 rounded-full terminal-window cyber-border text-text-secondary hover:text-accent transition-all duration-300 neural-glow"
                  aria-label={`Follow on ${platform}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Icon className="h-5 w-5 relative z-10" />
                  
                  {/* Ripple effect on click */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent/50"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ 
                      scale: [0, 1.5, 2], 
                      opacity: [0.8, 0.3, 0] 
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              )
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToAbout}
              className="terminal-window group relative overflow-hidden cyber-border neural-glow px-6 py-3"
            >
              <span className="relative z-10 cyber-text">
                <GlitchText intensity="low" trigger="hover">
                  {'> INITIALIZE_NEURAL_INTERFACE'}
                </GlitchText>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-hover to-accent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgb(6, 182, 212)",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-window group relative overflow-hidden cyber-border px-6 py-3"
            >
              <span className="relative z-10 flex items-center space-x-2 cyber-text">
                <Github className="h-4 w-4" />
                <GlitchText intensity="low" trigger="hover">
                  {'> ACCESS_MAINFRAME'}
                </GlitchText>
              </span>
              <motion.div
                className="absolute inset-0 bg-accent/5"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>

          {/* Cyberpunk Terminal Display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-16 max-w-md mx-auto"
          >
            <CyberTerminal 
              commands={[
                'SCANNING NEURAL PATHWAYS...',
                'QUANTUM ENCRYPTION: ACTIVE',
                'AI CONSCIOUSNESS: ONLINE',
                'REALITY.EXE INITIALIZED'
              ]}
              speed="medium"
              autoStart={true}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              onClick={handleScrollToAbout}
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.2,
                color: "rgb(6, 182, 212)",
              }}
              whileTap={{ scale: 0.9 }}
              className="group relative p-3 text-text-secondary hover:text-accent transition-all duration-300"
              aria-label="Scroll to content"
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-text-secondary/20"
                whileHover={{
                  borderColor: "rgb(6, 182, 212)",
                  scale: 1.2,
                }}
                transition={{ duration: 0.2 }}
              />
              <ArrowDown className="h-6 w-6 relative z-10" />
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-accent/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
