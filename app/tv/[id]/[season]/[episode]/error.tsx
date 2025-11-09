'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/error-state'

type EpisodeErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function EpisodeError({ error, reset }: EpisodeErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorState
      title='Episode unavailable'
      message='We ran into an issue loading this episode. Try again or return to the homepage.'
      reset={reset}
    />
  )
}

