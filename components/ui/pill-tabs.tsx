'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type TabItemType = {
  id: string
  label: string
}

type PillTabsProps = {
  tabs: TabItemType[]
  defaultActiveId?: string
  onTabChange?: (id: string) => void
  className?: string
}

const PillTabs = React.forwardRef<HTMLDivElement, PillTabsProps>(
  (props, ref) => {
    const {
      tabs,
      defaultActiveId = tabs[0]?.id,
      onTabChange,
      className,
    } = props

    const [activeTab, setActiveTab] = React.useState(defaultActiveId)

    const handleClick = React.useCallback(
      (id: string) => {
        setActiveTab(id)
        onTabChange?.(id)
      },
      [onTabChange]
    )

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-0.5 p-0.5 bg-muted rounded-full w-full sm:w-auto',
          className
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            onClick={() => handleClick(tab.id)}
            className={cn(
              'relative flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition touch-none',
              'text-xs sm:text-sm font-medium whitespace-nowrap',
              activeTab === tab.id
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId='pill-tabs-active-pill'
                className='absolute inset-0 bg-primary rounded-full'
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <span className='relative z-10'>{tab.label}</span>
          </button>
        ))}
      </div>
    )
  }
)

PillTabs.displayName = 'PillTabs'

export { PillTabs }
