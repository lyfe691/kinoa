import Link from 'next/link'

const links = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
]

export function SiteFooter() {
  return (
    <footer className='border-t border-border/60 bg-background/80 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
        <p className='text-center sm:text-left'>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
        <nav className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:justify-end' aria-label='Footer'>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className='transition hover:text-foreground'>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

