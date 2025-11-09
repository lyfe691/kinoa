'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/40'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='text-base font-semibold lowercase tracking-tight text-foreground transition hover:text-foreground/80'
          >
            kinoa
          </Link>
          <nav className='hidden items-center gap-3 text-sm text-muted-foreground md:flex'>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-3 py-1 transition',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'hover:bg-muted/70 hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='md:hidden' asChild aria-label='Search'>
            <Link href='/search'>
              <Search className='h-5 w-5' />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

