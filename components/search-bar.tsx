'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = 'Enter keywords...', className }: SearchBarProps) {
  const router = useRouter()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const [value, setValue] = React.useState(q)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    setValue(q)
  }, [q])

  React.useEffect(() => {
    const handle = setTimeout(() => {
      if (value.trim() === q.trim()) return
      startTransition(() => {
        const search = value.trim()
        router.replace(search ? `/search?q=${encodeURIComponent(search)}` : '/search')
      })
    }, 300)
    return () => clearTimeout(handle)
  }, [value, q, router, startTransition])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const search = value.trim()
    router.push(search ? `/search?q=${encodeURIComponent(search)}` : '/search')
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
        />
        <Button type='submit' className='sm:w-auto' disabled={isPending}>
          Search
        </Button>
      </div>
    </form>
  )
}


