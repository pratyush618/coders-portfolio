/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#020202',
        'bg-secondary': '#0a0a0a',
        text: '#e6ffff',
        'text-secondary': '#99d6ea',
        accent: '#00ffff',
        'accent-hover': '#33ffff',
        border: '#1a4a4a',
        // Enhanced Cyberpunk colors
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff0080',
        'neon-green': '#00ff41',
        'neon-purple': '#8a2be2',
        'cyber-blue': '#0099ff',
        'matrix-green': '#00ff41',
        'hologram': '#40e0d0',
        'electric-blue': '#0099ff',
        'cyber-orange': '#ff6600',
        'plasma-purple': '#9966ff',
        'scan-blue': '#00ccff',
        'grid-cyan': '#006666',
        'terminal-green': '#00cc41',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'Space Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 3s ease infinite',
        'typewriter': 'typewriter 3s steps(20) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'progress': 'progress 2s ease-out forwards',
        // Enhanced Cyber animations
        'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
        'cyber-scan': 'cyberScan 3s linear infinite',
        'data-flow': 'dataFlow 4s linear infinite',
        'hologram-flicker': 'hologramFlicker 0.5s ease-in-out infinite alternate',
        'matrix-scroll': 'matrixScroll 20s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'neon-border': 'neonBorder 4s linear infinite',
        'cyber-border-flow': 'cyber-border-flow 6s ease-in-out infinite',
        'hologram-scan': 'hologram-scan 8s linear infinite',
        'cyber-pulse': 'cyber-pulse 3s ease-in-out infinite',
        'data-corruption': 'data-corruption 2s ease-in-out infinite',
        'neural-network': 'neural-network 4s ease-in-out infinite',
        'quantum-flicker': 'quantum-flicker 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #06b6d4' },
          '100%': { boxShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        typewriter: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        // Cyber keyframes
        neonPulse: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            textShadow: '0 0 5px currentColor'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
          }
        },
        cyberScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' }
        },
        dataFlow: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        hologramFlicker: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' }
        },
        matrixScroll: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        neonBorder: {
          '0%': { borderColor: '#00ffff' },
          '25%': { borderColor: '#0099ff' },
          '50%': { borderColor: '#00ff41' },
          '75%': { borderColor: '#ff0080' },
          '100%': { borderColor: '#00ffff' }
        },
        'cyber-border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'hologram-scan': {
          '0%': { transform: 'translateX(-100%) translateY(-100%)' },
          '100%': { transform: 'translateX(100vw) translateY(100vh)' }
        },
        'cyber-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff'
          },
          '50%': { 
            boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff'
          }
        },
        'data-corruption': {
          '0%, 100%': { filter: 'hue-rotate(0deg) saturate(1) contrast(1)' },
          '25%': { filter: 'hue-rotate(90deg) saturate(1.5) contrast(1.2)' },
          '50%': { filter: 'hue-rotate(180deg) saturate(2) contrast(0.8)' },
          '75%': { filter: 'hue-rotate(270deg) saturate(1.2) contrast(1.1)' }
        },
        'neural-network': {
          '0%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
          '100%': { opacity: '0.3', transform: 'scale(1)' }
        },
        'quantum-flicker': {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.8' },
          '20%': { opacity: '1' },
          '30%': { opacity: '0.9' },
          '40%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '60%': { opacity: '1' },
          '70%': { opacity: '0.95' },
          '80%': { opacity: '1' },
          '90%': { opacity: '0.85' }
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            h1: {
              color: '#ffffff',
            },
            h2: {
              color: '#ffffff',
            },
            h3: {
              color: '#ffffff',
            },
            h4: {
              color: '#ffffff',
            },
            strong: {
              color: '#ffffff',
            },
            code: {
              color: '#06b6d4',
              backgroundColor: '#111111',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#111111',
              border: '1px solid #27272a',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            a: {
              color: '#06b6d4',
              '&:hover': {
                color: '#0891b2',
              },
            },
            blockquote: {
              color: '#a1a1aa',
              borderLeftColor: '#06b6d4',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
