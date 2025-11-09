import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  placeholder?: string
  className?: string
  query?: string
}

export function SearchBar({
  placeholder = 'Enter keywords...',
  className,
  query = '',
}: SearchBarProps) {
  const initialValue = query

  return (
    <form action='/search' method='get' className={className}>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        <Input
          key={`search-${initialValue}`}
          name='q'
          type='search'
          defaultValue={initialValue}
          placeholder={placeholder}
          aria-label='Search movies and series'
          autoComplete='off'
          spellCheck={false}
        />
        <Button type='submit' className='sm:w-auto'>
          Search
        </Button>
      </div>
    </form>
  )
}


