'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/supabase/auth'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function useWatchlistStatus(mediaId: number, mediaType: 'movie' | 'tv') {
  const { user } = useSession()
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkWatchlist() {
      if (!user) {
        setIsInWatchlist(false)
        setLoading(false)
        return
      }

      try {
        const supabase = createSupabaseBrowserClient()
        const { data, error } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
          .maybeSingle()

        if (!error && data) {
          setIsInWatchlist(true)
        } else {
          setIsInWatchlist(false)
        }
      } catch (error) {
        console.error('Failed to check watchlist status:', error)
        setIsInWatchlist(false)
      } finally {
        setLoading(false)
      }
    }

    checkWatchlist()
  }, [user, mediaId, mediaType])

  return { isInWatchlist, loading }
}

