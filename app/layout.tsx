import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/lib/siteConfig'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CommandPaletteProvider } from '@/components/CommandPaletteProvider'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'
import { DebugPanel } from '@/components/DebugPanel'
import { MobileGestureOverlay } from '@/components/MobileGestureOverlay'
import { SearchProvider } from '@/components/SearchProvider'
import { SearchModal } from '@/components/SearchModal'
import { MagneticCursor } from '@/components/MagneticCursor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Full Stack Developer',
    'AI Assistant',
    'Web Development',
    'Portfolio',
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@anthropicai',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceMono.variable} font-mono bg-bg text-text antialiased`}
      >
        <SearchProvider>
          <MagneticCursor />
          <ScrollProgress />
          <CommandPaletteProvider />
          <ThemeCustomizer />
          <ServiceWorkerProvider />
          <PWAInstallPrompt />
          <MobileGestureOverlay />
          <SearchModal />
          {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
          {process.env.NODE_ENV === 'development' && <DebugPanel />}
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </SearchProvider>
      </body>
    </html>
  )
}
