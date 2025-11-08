'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MovieError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-col items-start gap-4 rounded-lg border border-border/60 bg-background/80 p-6'>
      <div>
        <h2 className='text-lg font-semibold'>We couldn&apos;t load this title.</h2>
        <p className='text-sm text-muted-foreground'>
          Give it another try, or head back to the home feed.
        </p>
      </div>
      <Button variant='outline' onClick={reset}>
        Try again
      </Button>
    </div>
  )
}

