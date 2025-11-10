import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center'>
      <div className='space-y-2'>
        <h1 className='text-4xl font-semibold tracking-tight'>Page not found</h1>
        <p className='text-sm text-muted-foreground'>
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Button asChild>
          <Link href='/'>Go home</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/search'>Search</Link>
        </Button>
      </div>
    </section>
  )
}


