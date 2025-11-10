'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  placeholder?: string
  className?: string
  enableSuggestions?: boolean
}

type Suggestion = {
  id: number
  type: 'movie' | 'tv'
  name: string
  posterUrl: string | null
  releaseYear?: string
  href: string
  rating?: number
}

export function SearchBar({
  placeholder = 'Enter keywords...',
  className,
  enableSuggestions = true,
}: SearchBarProps) {
  const router = useRouter()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const [value, setValue] = React.useState(q)
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [isInputFocused, setIsInputFocused] = React.useState(false)
  const [isNavigating, startTransition] = React.useTransition()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setValue(q)
  }, [q])

  React.useEffect(() => {
    if (!enableSuggestions) {
      setSuggestions([])
      setIsFetching(false)
      setIsDropdownOpen(false)
      return
    }

    const trimmed = value.trim()

    if (trimmed.length < 2) {
      setSuggestions([])
      setIsFetching(false)
      setIsDropdownOpen(false)
      return
    }

    const controller = new AbortController()
    const debounce = setTimeout(async () => {
      try {
        setIsFetching(true)
        const response = await fetch(`/api/search/preview?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Failed to load suggestions')
        }
        const data = (await response.json()) as { results?: Suggestion[] }
        const items = Array.isArray(data.results) ? data.results : []
        setSuggestions(items)
        if (items.length > 0 && isInputFocused) {
          setIsDropdownOpen(true)
        } else {
          setIsDropdownOpen(false)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([])
          setIsDropdownOpen(false)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsFetching(false)
        }
      }
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(debounce)
    }
  }, [value, isInputFocused, enableSuggestions])

  const trimmedValue = value.trim()

  function handleFocus() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsInputFocused(true)
    if (
      enableSuggestions &&
      suggestions.length > 0 &&
      !isDropdownOpen
    ) {
      setIsDropdownOpen(true)
    }
  }

  function handleBlur() {
    closeTimerRef.current = setTimeout(() => {
      setIsInputFocused(false)
      setIsDropdownOpen(false)
    }, 120)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const search = trimmedValue
    setIsDropdownOpen(false)
    startTransition(() => {
      router.push(search ? `/search?q=${encodeURIComponent(search)}` : '/search')
    })
  }

  function navigateTo(href: string) {
    setIsDropdownOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  function renderRating(rating?: number) {
    if (!rating) {
      return null
    }
    return (
      <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
        <Star className='h-3 w-3 fill-current text-yellow-500' />
        {rating.toFixed(1)}
      </span>
    )
  }

  const hasResults = enableSuggestions && isDropdownOpen && suggestions.length > 0

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className='relative'>
        <motion.div
          animate={{
            boxShadow: hasResults
              ? '0 20px 40px -12px rgba(0, 0, 0, 0.18)'
              : isInputFocused
                ? '0 4px 20px -4px rgba(0, 0, 0, 0.12)'
                : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'relative flex w-full overflow-hidden border bg-background transition-all duration-300 ease-out',
            hasResults ? 'rounded-t-2xl border-b-0' : 'rounded-2xl',
            isInputFocused && !hasResults && 'ring-2 ring-primary/20'
          )}
        >
          <div className='relative flex-1'>
            <Search
              className={cn(
                'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200',
                isInputFocused ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <Input
              name='q'
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              aria-label='Search movies and series'
              autoComplete='off'
              spellCheck={false}
              ref={inputRef}
              className='h-14 border-0 bg-transparent pl-11 pr-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>

          <Button
            type='submit'
            size='lg'
            className='h-14 rounded-none border-l-0 px-8 shadow-none hover:bg-primary/90'
            disabled={isNavigating}
          >
            Search
          </Button>
        </motion.div>

        <AnimatePresence>
          {hasResults && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className='overflow-hidden'
            >
          <motion.div
            layout
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className='rounded-b-2xl border border-t-0 bg-background shadow-2xl'
          >
                <div className='max-h-[440px] overflow-y-auto scrollbar-thin'>
                  <div className='sticky top-0 z-10 border-b bg-background px-4 py-2.5 backdrop-blur-sm'>
                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground'>
                      Quick results
                    </span>
                  </div>

              <motion.div layout className='p-2'>
                    {suggestions.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className='group relative mb-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:bg-muted/60'
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => navigateTo(item.href)}
                      >
                        <div className='flex items-center gap-3.5 p-3'>
                          <div className='relative h-[72px] w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted/80 shadow-sm ring-1 ring-border/40 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:ring-primary/30'>
                            {item.posterUrl ? (
                              <Image
                                src={item.posterUrl}
                                alt={item.name}
                                fill
                                sizes='48px'
                                className='object-cover'
                              />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground/30'>
                                {item.type === 'movie' ? 'MV' : 'TV'}
                              </div>
                            )}
                          </div>

                          <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
                            <span className='truncate text-[15px] font-semibold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary'>
                              {item.name}
                            </span>
                            <div className='flex flex-wrap items-center gap-2'>
                              <span className='inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary transition-all duration-200 group-hover:bg-primary/20 group-hover:shadow-sm'>
                                {item.type === 'movie' ? 'Movie' : 'TV'}
                              </span>
                              {item.releaseYear && (
                                <span className='text-xs font-medium text-muted-foreground/70'>
                                  {item.releaseYear}
                                </span>
                              )}
                              {renderRating(item.rating)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </motion.div>

                  {isFetching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='border-t bg-gradient-to-b from-muted/20 to-transparent px-4 py-3 text-center text-xs font-medium text-muted-foreground'
                    >
                      <span className='inline-flex items-center gap-2'>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                          className='inline-block text-base'
                        >
                          ⟳
                        </motion.span>
                        Loading more…
                      </span>
                    </motion.div>
                  )}
                </div>
          </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
