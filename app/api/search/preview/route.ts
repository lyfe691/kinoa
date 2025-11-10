import { NextResponse } from 'next/server'
import { searchPreviews } from '@/lib/tmdb'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') ?? ''

  if (!query.trim()) {
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const results = await searchPreviews(query)
    return NextResponse.json({ results }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Search preview error', error)
    return NextResponse.json({ results: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
}


