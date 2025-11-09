'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  placeholder?: string
  className?: string
  initialQuery?: string
}

export function SearchBar({
  placeholder = 'Enter keywords...',
  className,
  initialQuery = '',
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = React.useState(initialQuery)
  const [isPending, startTransition] = React.useTransition()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  const navigate = React.useCallback(
    (search: string) => {
      const normalized = search.trim()
      const href = normalized ? `/search?q=${encodeURIComponent(normalized)}` : '/search'

      if (pathname === '/search') {
        router.replace(href)
      } else {
        router.push(href)
      }
    },
    [pathname, router]
  )

  React.useEffect(() => {
    const handle = setTimeout(() => {
      if (value.trim() === initialQuery.trim()) return
      startTransition(() => {
        navigate(value)
      })
    }, 300)
    return () => clearTimeout(handle)
  }, [value, initialQuery, navigate, startTransition])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate(value)
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        <Input
          name='q'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label='Search movies and series'
          autoComplete='off'
          spellCheck={false}
          ref={inputRef}
        />
        <Button type='submit' className='sm:w-auto' disabled={isPending}>
          Search
        </Button>
      </div>
    </form>
  )
}


