'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const legalLinks = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
]

export function SiteFooter() {
  return (
    <footer className='border-t border-border/60 bg-background/80 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
        <p className='text-center sm:text-left'>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
        <nav className='flex items-center' aria-label='Footer'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 text-sm text-muted-foreground hover:text-foreground'>
                Legal
                <ChevronDown className='ml-1 h-3 w-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {legalLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className='cursor-pointer'>
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </footer>
  )
}

