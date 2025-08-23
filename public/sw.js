// Service Worker for Claude Portfolio
// Provides offline functionality and intelligent caching

const CACHE_NAME = 'claude-portfolio-v1.0.0'
const RUNTIME_CACHE = 'runtime-cache-v1.0.0'

// Static assets to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/blog',
  '/offline',
  '/site.webmanifest',
  '/robots.txt'
]

// Different caching strategies for different resource types
const CACHE_STRATEGIES = {
  // Cache first for static assets (images, fonts, etc.)
  static: ['image', 'font', 'style'],
  // Network first for API calls and dynamic content
  networkFirst: ['document', 'script'],
  // Stale while revalidate for API data
  staleWhileRevalidate: ['fetch']
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Service worker activated')
      // Take control of all clients immediately
      return self.clients.claim()
    })
  )
})

// Fetch event - handle requests with different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const { method, url } = request
  
  // Only handle GET requests
  if (method !== 'GET') return
  
  // Skip chrome-extension and other non-http requests
  if (!url.startsWith('http')) return
  
  // Skip API requests that should always be fresh
  if (url.includes('/api/') && !url.includes('/api/blog')) {
    return
  }
  
  const urlObject = new URL(url)
  const destination = request.destination
  
  event.respondWith(
    handleRequest(request, destination, urlObject)
  )
})

// Main request handler with intelligent caching
async function handleRequest(request, destination, urlObject) {
  const cacheName = destination === 'document' ? CACHE_NAME : RUNTIME_CACHE
  
  try {
    // Strategy 1: Cache First (for images, fonts, static assets)
    if (CACHE_STRATEGIES.static.includes(destination)) {
      return await cacheFirst(request, cacheName)
    }
    
    // Strategy 2: Network First (for HTML documents, scripts)
    if (CACHE_STRATEGIES.networkFirst.includes(destination) || destination === '') {
      return await networkFirst(request, cacheName)
    }
    
    // Strategy 3: Stale While Revalidate (for API calls)
    if (urlObject.pathname.startsWith('/api/blog')) {
      return await staleWhileRevalidate(request, cacheName)
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request, cacheName)
    
  } catch (error) {
    console.error('[SW] Request handling failed:', error)
    return await handleOffline(request)
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed for cache-first resource:', request.url)
    throw error
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Start network request in background
  const networkPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // If no cache, wait for network
  return await networkPromise
}

// Network with Cache Fallback
async function networkWithCacheFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return await handleOffline(request)
  }
}

// Offline fallback
async function handleOffline(request) {
  const url = new URL(request.url)
  
  // For navigation requests, show offline page
  if (request.destination === 'document') {
    const cache = await caches.open(CACHE_NAME)
    const offlinePage = await cache.match('/offline')
    if (offlinePage) {
      return offlinePage
    }
    
    // Fallback offline HTML
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - Claude Portfolio</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              background: #000; 
              color: #fff; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              text-align: center;
            }
            .container { max-width: 500px; padding: 2rem; }
            .title { font-size: 2rem; margin-bottom: 1rem; color: #06b6d4; }
            .message { font-size: 1.1rem; line-height: 1.5; margin-bottom: 2rem; }
            .retry-btn { 
              background: #06b6d4; 
              color: #000; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              cursor: pointer; 
              font-size: 1rem;
              font-weight: 600;
            }
            .retry-btn:hover { background: #0891b2; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="title">⚡ Offline Mode</h1>
            <p class="message">
              You're currently offline, but don't worry! Some content may still be available from your cache.
            </p>
            <button class="retry-btn" onclick="window.location.reload()">
              Try Again
            </button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  // For image requests, return a placeholder
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#06b6d4" font-family="system-ui" font-size="18">Image Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
  
  // Generic offline response
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size })
      })
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' })
      })
      break
      
    case 'PRECACHE_ROUTES':
      if (payload && payload.routes) {
        precacheRoutes(payload.routes).then(() => {
          event.ports[0].postMessage({ type: 'ROUTES_PRECACHED' })
        })
      }
      break
  }
})

// Utility functions
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    totalSize += keys.length
  }
  
  return totalSize
}

async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
  console.log('[SW] All caches cleared')
}

async function precacheRoutes(routes) {
  const cache = await caches.open(CACHE_NAME)
  const requests = routes.map(route => new Request(route))
  
  for (const request of requests) {
    try {
      const response = await fetch(request)
      if (response.status === 200) {
        await cache.put(request, response)
      }
    } catch (error) {
      console.log('[SW] Failed to precache:', request.url)
    }
  }
}
