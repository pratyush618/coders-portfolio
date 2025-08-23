'use client'

import { useEffect, useRef, useState } from 'react'

interface SimpleMermaidTestProps {
  chart: string
}

export function SimpleMermaidTest({ chart }: SimpleMermaidTestProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('Loading...')
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (msg: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        setStatus('Starting...')
        addDebug('Starting mermaid rendering')
        
        setStatus('Importing mermaid...')
        addDebug('Importing mermaid library')
        
        // Dynamically import mermaid
        const mermaid = await import('mermaid')
        addDebug(`Mermaid imported: ${typeof mermaid.default}`)
        
        setStatus('Mermaid imported, initializing...')
        
        // Simple configuration
        mermaid.default.initialize({
          theme: 'dark',
          startOnLoad: false,
          securityLevel: 'loose'
        })
        addDebug('Mermaid initialized')
        
        setStatus('Rendering diagram...')
        addDebug(`Chart content: ${chart.substring(0, 100)}...`)
        
        if (ref.current) {
          // Clear previous content
          ref.current.innerHTML = ''
          addDebug('Cleared ref content')
          
          // Generate unique ID
          const id = `mermaid-test-${Math.random().toString(36).substr(2, 9)}`
          addDebug(`Generated ID: ${id}`)
          
          // Render the diagram
          const result = await mermaid.default.render(id, chart)
          addDebug(`Render result type: ${typeof result}`)
          addDebug(`Render result keys: ${Object.keys(result)}`)
          
          ref.current.innerHTML = result.svg
          addDebug('SVG inserted into DOM')
          
          setStatus('Rendered successfully!')
        } else {
          addDebug('ERROR: ref.current is null')
          setStatus('Error: No ref element')
        }
      } catch (err) {
        console.error('Mermaid error:', err)
        addDebug(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`)
        addDebug(`ERROR Stack: ${err instanceof Error ? err.stack : 'No stack'}`)
        setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    renderMermaid()
  }, [chart])

  return (
    <div className="border border-gray-500 p-4 m-4">
      <div className="text-sm text-gray-400 mb-2">Status: {status}</div>
      <div ref={ref} className="min-h-[200px] bg-black text-white border border-red-500" />
      
      <details className="mt-2">
        <summary className="text-sm text-gray-400 cursor-pointer">Debug Info ({debugInfo.length} entries)</summary>
        <div className="text-xs text-gray-300 mt-2 p-2 bg-gray-800 max-h-32 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </div>
      </details>
      
      <details className="mt-2">
        <summary className="text-sm text-gray-400 cursor-pointer">Show chart source</summary>
        <pre className="text-xs text-gray-300 mt-2 p-2 bg-gray-800">{chart}</pre>
      </details>
    </div>
  )
}