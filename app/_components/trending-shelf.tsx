import { TrendingSection } from '@/components/trending-section'
import { getTrending } from '@/lib/tmdb'

export async function TrendingShelf() {
  const trending = await getTrending()
  return <TrendingSection items={trending} />
}
