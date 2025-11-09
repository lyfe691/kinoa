import Link from 'next/link'
export function SiteFooter() {
  return (
    <footer className='border-t border-border/60 bg-background/80'>
      <div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left'>
          <p className='text-sm text-muted-foreground'>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
          <nav aria-label='Footer' className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:justify-end'>
            <Link href='/' className='transition hover:text-foreground'>
              Home
            </Link>
            <Link href='/search' className='transition hover:text-foreground'>
              Search
            </Link>
            <Link href='/terms' className='transition hover:text-foreground'>
              Terms
            </Link>
            <Link href='/privacy' className='transition hover:text-foreground'>
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

