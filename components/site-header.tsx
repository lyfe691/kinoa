'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

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
    <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
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
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu" className="h-8 w-8">
                <div className="flex h-4 w-4 flex-col items-center justify-center gap-1">
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </div>
              </Button>
            </DrawerTrigger>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <DrawerContent className="flex h-[70vh] flex-col">
        <VisuallyHidden>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </VisuallyHidden>

        <nav className="flex flex-col gap-2 p-6 pt-4">
          {navItems.map(({ href, label }) => {
            const isActive =
              pathname === href || (href !== '/' && pathname?.startsWith(href))
            return (
              <DrawerClose asChild key={href}>
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
              </DrawerClose>
            )
          })}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t px-6 py-4">
          <span className="text-sm font-medium text-muted-foreground">Appearance</span>
          <ModeToggle />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
