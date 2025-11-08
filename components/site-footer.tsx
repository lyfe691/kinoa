import Link from 'next/link'

const links = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
]

export function SiteFooter() {
  return (
    <footer className='border-t border-border/60 bg-background/80'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8'>
        <p>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
        <nav className='flex items-center gap-4'>
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

