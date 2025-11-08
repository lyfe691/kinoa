import { Spinner } from '@/components/ui/spinner'

export default function RootLoading() {
  return (
    <div className='flex min-h-[50vh] w-full items-center justify-center'>
      <Spinner className='h-8 w-8 text-muted-foreground' />
    </div>
  )
}

