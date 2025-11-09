import { cn } from '@/lib/utils'

type MediaOverviewProps = {
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function MediaOverview({ subtitle, children, className }: MediaOverviewProps) {
  if (!subtitle && !children) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h2 className='text-lg font-semibold'>Overview</h2>
      {subtitle && <p className='text-xs text-muted-foreground'>{subtitle}</p>}
      {children && <div className='leading-relaxed text-muted-foreground'>{children}</div>}
    </div>
  )
}

