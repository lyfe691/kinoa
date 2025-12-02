"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { Player } from "@lordicon/react";

export type AnimatedIconHandle = {
  play: () => void;
};

type AnimatedIconProps = {
  icon: object;
  size?: number;
  colorize?: string;
};

export const AnimatedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function AnimatedIcon({ icon, size = 24, colorize = "currentColor" }, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playFromBeginning(),
    }));

    return (
      <Player ref={playerRef} icon={icon} size={size} colorize={colorize} />
    );
  },
);
