'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Settings, 
  X, 
  RotateCcw, 
  Check,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react'

interface ThemeSettings {
  accentColor: string
  animationIntensity: 'low' | 'medium' | 'high'
  reducedMotion: boolean
  glowEffects: boolean
  soundEffects: boolean
}

const DEFAULT_THEME: ThemeSettings = {
  accentColor: '#06b6d4', // Default cyan
  animationIntensity: 'medium',
  reducedMotion: false,
  glowEffects: true,
  soundEffects: false
}

const ACCENT_COLOR_PRESETS = [
  { name: 'Cyan', value: '#06b6d4', description: 'Classic tech cyan' },
  { name: 'Neon Green', value: '#00ff41', description: 'Matrix green' },
  { name: 'Electric Blue', value: '#0066ff', description: 'Cyber blue' },
  { name: 'Hot Pink', value: '#ff0080', description: 'Neon pink' },
  { name: 'Purple', value: '#8a2be2', description: 'Electric purple' },
  { name: 'Orange', value: '#ff6600', description: 'Cyber orange' },
  { name: 'Acid Yellow', value: '#ccff00', description: 'Bright yellow' },
  { name: 'Red', value: '#ff0040', description: 'Alert red' }
]

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('theme-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applyTheme(parsed)
    }
  }, [])

  // Apply theme to CSS custom properties
  const applyTheme = (themeSettings: ThemeSettings) => {
    const root = document.documentElement
    
    // Update CSS custom properties
    root.style.setProperty('--accent-color', themeSettings.accentColor)
    root.style.setProperty('--accent-glow', themeSettings.accentColor + '40')
    
    // Update animation durations based on intensity
    const intensityMultipliers = {
      low: 0.5,
      medium: 1,
      high: 1.5
    }
    const multiplier = intensityMultipliers[themeSettings.animationIntensity]
    root.style.setProperty('--animation-speed', multiplier.toString())
    
    // Apply reduced motion preference
    if (themeSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s')
    } else {
      root.style.removeProperty('--animation-duration')
    }
    
    // Update Tailwind classes dynamically
    document.body.classList.toggle('reduce-motion', themeSettings.reducedMotion)
    document.body.classList.toggle('no-glow', !themeSettings.glowEffects)
  }

  const updateSetting = <K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    setHasChanges(true)
    
    // Apply immediately for real-time preview
    applyTheme(newSettings)
  }

  const saveSettings = () => {
    localStorage.setItem('theme-settings', JSON.stringify(settings))
    setHasChanges(false)
    
    // Trigger a subtle success animation
    const button = document.querySelector('[data-save-button]')
    if (button) {
      button.classList.add('animate-pulse')
      setTimeout(() => button.classList.remove('animate-pulse'), 1000)
    }
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_THEME)
    applyTheme(DEFAULT_THEME)
    localStorage.removeItem('theme-settings')
    setHasChanges(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    // Play a subtle sound effect if enabled
    if (settings.soundEffects) {
      // In a real implementation, you'd play an actual sound
      console.log('🔊 Theme customizer toggled')
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 p-3 bg-bg-secondary border border-accent/20 rounded-full shadow-lg backdrop-blur-sm hover:border-accent/40 transition-colors"
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: settings.glowEffects ? `0 0 20px ${settings.accentColor}40` : 'none'
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-accent" />
          ) : (
            <Palette className="w-5 h-5 text-accent" />
          )}
        </motion.div>
      </motion.button>

      {/* Theme Customizer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-bg-secondary border-l border-accent/20 z-50 shadow-2xl overflow-y-auto"
              style={{
                boxShadow: settings.glowEffects ? `-20px 0 40px ${settings.accentColor}20` : 'none'
              }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-text flex items-center gap-2">
                      <Settings className="w-5 h-5 text-accent" />
                      Theme Studio
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Customize your visual experience
                    </p>
                  </div>
                </div>

                {/* Accent Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-text mb-3">
                    Accent Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_COLOR_PRESETS.map((preset) => (
                      <motion.button
                        key={preset.name}
                        className={`
                          relative p-2 rounded-lg border-2 transition-all
                          ${settings.accentColor === preset.value 
                            ? 'border-text scale-110' 
                            : 'border-border hover:border-text-secondary'
                          }
                        `}
                        onClick={() => updateSetting('accentColor', preset.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={`${preset.name} - ${preset.description}`}
                      >
                        <div
                          className="w-8 h-8 rounded-md"
                          style={{
                            backgroundColor: preset.value,
                            boxShadow: settings.glowEffects ? `0 0 15px ${preset.value}60` : 'none'
                          }}
                        />
                        {settings.accentColor === preset.value && (
                          <Check className="absolute -top-1 -right-1 w-4 h-4 text-text bg-bg rounded-full p-0.5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Animation Intensity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Animation Intensity
                  </label>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map((intensity) => (
                      <motion.button
                        key={intensity}
                        className={`
                          w-full p-3 rounded-lg border transition-all text-left
                          ${settings.animationIntensity === intensity 
                            ? 'border-accent bg-accent/10 text-accent' 
                            : 'border-border hover:border-text-secondary text-text'
                          }
                        `}
                        onClick={() => updateSetting('animationIntensity', intensity as any)}
                        whileHover={{ x: 4 }}
                      >
                        <div className="font-medium capitalize">{intensity}</div>
                        <div className="text-xs text-text-secondary mt-1">
                          {intensity === 'low' && 'Subtle animations, better performance'}
                          {intensity === 'medium' && 'Balanced visual experience'}
                          {intensity === 'high' && 'Maximum visual impact'}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Accessibility & Effects */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-text mb-3">
                    Accessibility & Effects
                  </label>
                  <div className="space-y-3">
                    <motion.label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text">Reduced Motion</span>
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="sr-only"
                      />
                      <motion.div
                        className={`
                          w-10 h-6 rounded-full border-2 relative transition-colors
                          ${settings.reducedMotion ? 'bg-accent border-accent' : 'bg-bg border-border'}
                        `}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-text rounded-full absolute top-0.5"
                          animate={{
                            x: settings.reducedMotion ? 16 : 2
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </motion.label>

                    <motion.label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text">Glow Effects</span>
                      <input
                        type="checkbox"
                        checked={settings.glowEffects}
                        onChange={(e) => updateSetting('glowEffects', e.target.checked)}
                        className="sr-only"
                      />
                      <motion.div
                        className={`
                          w-10 h-6 rounded-full border-2 relative transition-colors
                          ${settings.glowEffects ? 'bg-accent border-accent' : 'bg-bg border-border'}
                        `}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-text rounded-full absolute top-0.5"
                          animate={{
                            x: settings.glowEffects ? 16 : 2
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </motion.label>

                    <motion.label className="flex items-center justify-between cursor-pointer">
                      <span className="text-text flex items-center gap-2">
                        {settings.soundEffects ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                        Sound Effects
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                        className="sr-only"
                      />
                      <motion.div
                        className={`
                          w-10 h-6 rounded-full border-2 relative transition-colors
                          ${settings.soundEffects ? 'bg-accent border-accent' : 'bg-bg border-border'}
                        `}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-text rounded-full absolute top-0.5"
                          animate={{
                            x: settings.soundEffects ? 16 : 2
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </motion.label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    data-save-button
                    className={`
                      flex-1 py-2 px-4 rounded-lg font-medium transition-all
                      ${hasChanges 
                        ? 'bg-accent text-bg hover:bg-accent/90' 
                        : 'bg-bg border border-border text-text-secondary cursor-not-allowed'
                      }
                    `}
                    onClick={saveSettings}
                    disabled={!hasChanges}
                    whileHover={hasChanges ? { scale: 1.02 } : {}}
                    whileTap={hasChanges ? { scale: 0.98 } : {}}
                  >
                    {hasChanges ? 'Save Changes' : 'Saved'}
                  </motion.button>

                  <motion.button
                    className="p-2 border border-border rounded-lg text-text-secondary hover:text-text hover:border-text-secondary transition-colors"
                    onClick={resetToDefaults}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Preview Text */}
                <div className="mt-6 p-4 bg-bg rounded-lg border border-accent/20">
                  <div className="text-sm text-text-secondary mb-2">Preview:</div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: settings.accentColor }}
                  >
                    Cyber Portfolio
                  </div>
                  <div className="text-text text-sm">
                    This is how your theme will look
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
