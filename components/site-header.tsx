'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl'
          : 'bg-background/50 backdrop-blur-sm'
      )}
    >
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link
          href='/'
          className='text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-70'
        >
          kinoa
        </Link>

        {/* Spacer */}
        <div className='flex-1' />

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Theme Toggle */}
        <div className='hidden md:flex ml-6'>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className='flex md:hidden'>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                aria-label='Toggle menu'
              >
                <div className='flex flex-col items-center justify-center w-4 h-4 gap-1'>
                  <span className='w-full h-0.5 bg-current rounded-full' />
                  <span className='w-full h-0.5 bg-current rounded-full' />
                </div>
              </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[70vh]'>
              <VisuallyHidden>
                <DrawerTitle>Navigation Menu</DrawerTitle>
              </VisuallyHidden>
              <nav className='flex flex-col gap-2 p-6 pt-4'>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'py-2 text-base font-medium transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <div className='flex items-center justify-between px-6 py-4 mt-auto border-t'>
                <span className='text-sm font-medium text-muted-foreground'>Appearance</span>
                <ModeToggle />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}