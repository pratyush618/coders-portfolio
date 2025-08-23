'use client'

import { useEffect, useRef, useState } from 'react'

export function MermaidDebug() {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('Starting...')

  useEffect(() => {
    const testMermaid = async () => {
      try {
        setStatus('Checking if ref exists...')
        if (!ref.current) {
          setStatus('ERROR: No ref element')
          return
        }

        setStatus('Importing mermaid...')
        const mermaid = (await import('mermaid')).default
        
        setStatus('Configuring mermaid...')
        mermaid.initialize({
          theme: 'dark',
          startOnLoad: false
        })

        setStatus('Creating simple diagram...')
        const simpleChart = 'graph TD\n    A[Hello] --> B[World]'
        
        const id = 'test-diagram-' + Date.now()
        const { svg } = await mermaid.render(id, simpleChart)
        
        setStatus('Inserting SVG...')
        ref.current.innerHTML = svg
        
        setStatus('SUCCESS!')
      } catch (error) {
        console.error('Mermaid debug error:', error)
        setStatus(`ERROR: ${error instanceof Error ? error.message : 'Unknown'}`)
      }
    }

    testMermaid()
  }, [])

  return (
    <div className="border-2 border-yellow-500 p-4 m-4 bg-gray-900">
      <h3 className="text-yellow-400 font-bold mb-2">Mermaid Debug Test</h3>
      <div className="text-white mb-2">Status: {status}</div>
      <div 
        ref={ref} 
        className="min-h-[100px] border border-white bg-black p-2"
        style={{ color: 'white' }}
      />
    </div>
  )
}