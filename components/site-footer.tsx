import Link from 'next/link'
import { Github, Mail, Twitter } from 'lucide-react'

const navigation = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/search', label: 'Search' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
]

const socials = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'mailto:hello@kinoa.watch', label: 'Email', icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className='border-t border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70'>
      <div className='mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
          <div className='max-w-sm space-y-4'>
            <Link href='/' className='inline-flex items-center gap-3 text-base font-semibold tracking-tight text-foreground'>
              <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base text-primary'>
                K
              </span>
              Kinoa
            </Link>
            <p className='text-sm text-muted-foreground'>
              Curated streaming picks powered by TMDB metadata and seamless VidFast playback, available anywhere you are.
            </p>
            <div className='flex items-center gap-3'>
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary'
                >
                  <span className='sr-only'>{social.label}</span>
                  <social.icon className='h-4 w-4' aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>

          <div className='grid w-full gap-8 sm:grid-cols-2 lg:w-auto'>
            {navigation.map((section) => (
              <div key={section.title} className='space-y-3'>
                <p className='text-sm font-semibold text-foreground'>{section.title}</p>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className='transition hover:text-foreground'>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <p>&copy; {new Date().getFullYear()} Kinoa. All rights reserved.</p>
          <p className='max-w-md leading-relaxed'>
            Data provided by The Movie Database (TMDB). Video playback is hosted via VidFast embeds.
          </p>
        </div>
      </div>
    </footer>
  )
}

