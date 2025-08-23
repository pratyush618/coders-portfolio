import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Path to the resume file in the public directory
    const resumePath = path.join(process.cwd(), 'public', 'resume.pdf')
    
    // Read the file
    const fileBuffer = await readFile(resumePath)
    
    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Pratyush_Sharma_Resume.pdf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

    return response
  } catch (error) {
    console.error('Error downloading resume:', error)
    
    return NextResponse.json(
      { 
        error: 'Resume not found',
        message: 'The requested resume file could not be found or accessed.'
      },
      { status: 404 }
    )
  }
}

// Optional: Add POST method for analytics tracking
export async function POST(request: NextRequest) {
  try {
    const { userAgent, timestamp } = await request.json()
    
    // Here you could log the download event to your analytics/database
    console.log('Resume download tracked:', {
      userAgent,
      timestamp,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('remote-addr'),
      date: new Date().toISOString(),
    })
    
    return NextResponse.json({ success: true, message: 'Download tracked' })
  } catch (error) {
    console.error('Error tracking resume download:', error)
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    )
  }
}