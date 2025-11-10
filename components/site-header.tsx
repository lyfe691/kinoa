'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Drawer } from 'vaul'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Drawer.Root shouldScaleBackground>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl'
            : 'bg-background/50 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            kinoa
          </Link>

          <div className="flex-1" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== '/' && pathname?.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop theme toggle */}
          <div className="hidden md:flex ml-6">
            <ModeToggle />
          </div>

          {/* Mobile trigger */}
          <div className="flex md:hidden">
            <Drawer.Trigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu" className="h-8 w-8">
                <div className="flex h-4 w-4 flex-col items-center justify-center gap-1">
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </div>
              </Button>
            </Drawer.Trigger>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[70vh] flex-col rounded-t-3xl  bg-background shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom">
          <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-muted" aria-hidden="true" />

          <VisuallyHidden>
            <Drawer.Title>Navigation Menu</Drawer.Title>
          </VisuallyHidden>

          <nav className="flex flex-col gap-2 p-6 pt-4">
            {navItems.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== '/' && pathname?.startsWith(href))
              return (
                <Drawer.Close asChild key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'py-2 text-base font-medium transition-colors',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                  </Link>
                </Drawer.Close>
              )
            })}
          </nav>

          <div className="mt-auto flex items-center justify-between border-t px-6 py-4">
            <span className="text-sm font-medium text-muted-foreground">Appearance</span>
            <ModeToggle />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
