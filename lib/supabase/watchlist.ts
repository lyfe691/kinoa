'use server'

import { createSupabaseServerClient } from './server'

export type WatchlistItem = {
  id: string
  user_id: string
  media_id: number
  media_type: 'movie' | 'tv'
  created_at: string
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch watchlist:', error)
    return []
  }

  return data ?? []
}

export async function isInWatchlist(
  mediaId: number,
  mediaType: 'movie' | 'tv',
): Promise<boolean> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error('Failed to check watchlist:', error)
    return false
  }

  return !!data
}

export async function addToWatchlist(
  mediaId: number,
  mediaType: 'movie' | 'tv',
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase.from('watchlist').insert({
    user_id: user.id,
    media_id: mediaId,
    media_type: mediaType,
  })

  if (error) {
    console.error('Failed to add to watchlist:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function removeFromWatchlist(
  mediaId: number,
  mediaType: 'movie' | 'tv',
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', user.id)
    .eq('media_id', mediaId)
    .eq('media_type', mediaType)

  if (error) {
    console.error('Failed to remove from watchlist:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

