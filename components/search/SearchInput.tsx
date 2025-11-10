'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  placeholder: string
  isFocused: boolean
  isNavigating: boolean
  hasResultsOpen: boolean
}

export function SearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  isFocused,
  isNavigating,
  hasResultsOpen,
}: SearchInputProps) {
  const trimmedValue = value.trim()

  return (
    <motion.div
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative flex w-full items-center overflow-hidden border bg-background transition-all duration-300 ease-out',
        hasResultsOpen ? 'rounded-t-2xl' : 'rounded-2xl',
      )}
    >
      <Search
        className={cn(
          'pointer-events-none absolute left-4 h-4 w-4 transition-colors duration-200',
          isFocused ? 'text-primary' : 'text-muted-foreground'
        )}
      />
      <Input
        name='q'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label='Search movies and series'
        autoComplete='off'
        spellCheck={false}
        className='h-14 w-full border-0 bg-background pl-11 pr-28 text-base focus-visible:ring-0 focus-visible:ring-offset-0'
      />
      <motion.button
        type='submit'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isNavigating || !trimmedValue}
        className={cn(
          'absolute right-2 h-10 rounded-xl px-6 text-sm font-medium transition-all duration-200',
          'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none'
        )}
      >
        Search
      </motion.button>
    </motion.div>
  )
}


