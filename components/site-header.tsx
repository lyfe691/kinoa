import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='text-base font-semibold lowercase tracking-tight text-foreground transition hover:text-foreground/80'
        >
          kinoa
        </Link>
        <nav className='flex flex-1 items-center gap-6 text-sm text-muted-foreground'>
          <Link href='/search' className='transition hover:text-foreground'>
            Search
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </header>
  )
}

