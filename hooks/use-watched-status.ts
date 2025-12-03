"use client";

import * as React from "react";

export function useWatchedStatus(mediaId: number, mediaType: "movie" | "tv") {
    const key = `watched-${mediaType}-${mediaId}`;
    const [isWatched, setIsWatched] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const stored = localStorage.getItem(key);
        if (stored) {
            setIsWatched(JSON.parse(stored));
        }
        setIsLoading(false);
    }, [key]);

    const toggleWatched = React.useCallback(() => {
        setIsWatched((prev) => {
            const newState = !prev;
            // Perform side effects asynchronously to avoid updating other components during render
            setTimeout(() => {
                localStorage.setItem(key, JSON.stringify(newState));
                window.dispatchEvent(new Event("watched-status-change"));
            }, 0);
            return newState;
        });
    }, [key]);

    // Listen for changes from other components
    React.useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem(key);
            if (stored) {
                setIsWatched(JSON.parse(stored));
            }
        };

        window.addEventListener("watched-status-change", handleStorageChange);
        return () => {
            window.removeEventListener("watched-status-change", handleStorageChange);
        };
    }, [key]);

    return { isWatched, toggleWatched, isLoading };
}
