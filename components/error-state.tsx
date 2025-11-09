'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title: string
  message: string
  reset?: () => void
  className?: string
}

export function ErrorState({ title, message, reset, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-muted/20 p-8 text-center', className)}>
      <AlertTriangle className='h-10 w-10 text-muted-foreground' />
      <div className='space-y-1'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        {reset && (
          <Button onClick={() => reset()} variant='default'>
            Try again
          </Button>
        )}
        <Button variant='secondary' asChild>
          <Link href='/'>Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
