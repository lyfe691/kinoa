'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Plus, Check, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { useSession } from '@/lib/supabase/auth'
import { addToWatchlist, removeFromWatchlist } from '@/lib/supabase/watchlist'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type MediaMenuProps = {
  mediaId: number
  mediaType: 'movie' | 'tv'
  isInWatchlist: boolean
  className?: string
  size?: 'sm' | 'default'
}

export function MediaMenu({
  mediaId,
  mediaType,
  isInWatchlist: initialInWatchlist,
  className,
  size = 'default',
}: MediaMenuProps) {
  const router = useRouter()
  const { user } = useSession()
  const [isInWatchlist, setIsInWatchlist] = React.useState(initialInWatchlist)
  const [loading, setLoading] = React.useState(false)
  const [showAuthDialog, setShowAuthDialog] = React.useState(false)

  const handleToggleWatchlist = React.useCallback(
    async (e: Event) => {
      e.preventDefault()

      if (!user) {
        setShowAuthDialog(true)
        return
      }

      setLoading(true)

      try {
        if (isInWatchlist) {
          const result = await removeFromWatchlist(mediaId, mediaType)
          if (result.success) {
            setIsInWatchlist(false)
            toast.success('Removed from watchlist')
            router.refresh()
          } else {
            toast.error(result.error ?? 'Failed to remove from watchlist')
          }
        } else {
          const result = await addToWatchlist(mediaId, mediaType)
          if (result.success) {
            setIsInWatchlist(true)
            toast.success('Added to watchlist')
            router.refresh()
          } else {
            toast.error(result.error ?? 'Failed to add to watchlist')
          }
        }
      } catch (error) {
        console.error('Watchlist error:', error)
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    },
    [user, isInWatchlist, mediaId, mediaType, router],
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size === 'sm' ? 'icon-sm' : 'icon'}
            className={cn(
              'rounded-full bg-background/90 backdrop-blur-sm hover:bg-background',
              className,
            )}
            aria-label="More options"
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleToggleWatchlist} disabled={loading}>
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : isInWatchlist ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {loading
              ? 'Loading...'
              : isInWatchlist
                ? 'Remove from watchlist'
                : 'Add to watchlist'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be signed in to add items to your watchlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAuthDialog(false)
                router.push('/login')
              }}
              className="w-full sm:w-auto"
            >
              Sign in
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  )
}

