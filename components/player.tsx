import { cn } from '@/lib/utils'

const PLAYER_ALLOW = 'accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen'

/*
  VidFast embeds require full iframe capabilities (including storage access). Adding a sandbox
  breaks playback on their side, so we rely on their origin allowlist instead of sandboxing.
*/

type MoviePlayerProps = {
  kind: 'movie'
  imdbId?: string | null
  title?: string
  className?: string
}

type TvPlayerProps = {
  kind: 'tv'
  tmdbId: number
  season: number
  episode: number
  title?: string
  className?: string
}

type PlayerProps = MoviePlayerProps | TvPlayerProps

export function Player(props: PlayerProps) {
  if (props.kind === 'movie') {
    const { imdbId, title, className } = props

    if (!imdbId) {
      return (
        <div className={cn('rounded-lg border border-dashed p-6 text-sm text-muted-foreground', className)}>
          Playback is currently unavailable for this title.
        </div>
      )
    }

    return (
      <div className={cn('relative w-full pt-[56.25%] overflow-hidden rounded-lg bg-muted/30', className)}>
        <iframe
          src={`https://vidfast.pro/movie/${imdbId}?autoPlay=true&theme=16A085`}
          title={title ?? 'Video player'}
          className='absolute inset-0 h-full w-full rounded-lg border-0'
          frameBorder='0'
          allowFullScreen
          allow={PLAYER_ALLOW}
          referrerPolicy='no-referrer'
        />
      </div>
    )
  }

  const { tmdbId, season, episode, title, className } = props

  return (
    <div className={cn('relative w-full pt-[56.25%] overflow-hidden rounded-lg bg-muted/30', className)}>
      <iframe
        src={`https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?autoPlay=true&theme=16A085`}
        title={title ?? 'Video player'}
        className='absolute inset-0 h-full w-full rounded-lg border-0'
        frameBorder='0'
        allowFullScreen
        allow={PLAYER_ALLOW}
        referrerPolicy='no-referrer'
      />
    </div>
  )
}

