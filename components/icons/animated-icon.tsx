'use client'

import { Player, type Player as PlayerType } from '@lordicon/react'
import { forwardRef, useImperativeHandle, useRef } from 'react'

export type AnimatedIconRef = {
  playFromBeginning: () => void
  goToFirstFrame: () => void
}

type AnimatedIconProps = {
  icon: object
  size?: number
  colorize?: string
}

export const AnimatedIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
  function AnimatedIcon({ icon, size = 24, colorize }, ref) {
    const playerRef = useRef<PlayerType>(null)

    useImperativeHandle(ref, () => ({
      playFromBeginning: () => playerRef.current?.playFromBeginning(),
      goToFirstFrame: () => playerRef.current?.goToFirstFrame(),
    }))

    return (
      <Player
        ref={playerRef}
        icon={icon}
        size={size}
        colorize={colorize}
      />
    )
  }
)

