import { useCallback, useEffect, useState } from "react";

const query = `
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(
                type: ANIME
                sort: POPULARITY_DESC
                isAdult: false
            ) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
    }
`;

const CACHE_KEY = "memory-games-anime-pool";
const REQUIRED_ANIME_COUNT = 50;
const REQUEST_TIMEOUT = 10_000;

async function fetchAnimePage(page, signal) {
    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
            variables: {
                page,
                perPage: 25,
            },
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data.Page.media.map((anime) => ({
        animeId: anime.id,
        name: anime.title.english || anime.title.romaji,
        image: anime.coverImage.large,
    }));
}

function readSavedAnime() {
    try {
        const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");

        if (!Array.isArray(saved) || saved.length < REQUIRED_ANIME_COUNT) {
            return [];
        }

        return saved;
    } catch {
        return [];
    }
}

function saveAnime(animePool) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(animePool));

    // The service worker caches these image requests as they are used.
    // We also proactively save the current set when Cache Storage is available.
    if (!("caches" in window)) {
        return;
    }

    caches.open("memory-games-images-v1").then(async (cache) => {
        await Promise.allSettled(
            animePool.map(async (anime) => {
                try {
                    const response = await fetch(anime.image, { mode: "no-cors" });
                    await cache.put(anime.image, response);
                } catch {
                    // A single image failing should not invalidate the saved set.
                }
            }),
        );
    });
}

async function fetchFreshAnime() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT,
    );

    try {
        const results = await Promise.allSettled([
            fetchAnimePage(1, controller.signal),
            fetchAnimePage(2, controller.signal),
        ]);

        const successfulPages = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value)
            .flat();

        const uniqueAnime = Array.from(
            new Map(successfulPages.map((anime) => [anime.animeId, anime])).values(),
        );

        if (uniqueAnime.length < REQUIRED_ANIME_COUNT) {
            const failedPages = results
                .filter((result) => result.status === "rejected")
                .map((result) => result.reason?.message || String(result.reason));

            const details = failedPages.length
                ? failedPages.join(" | ")
                : `Anime API returned only ${uniqueAnime.length} unique cards.`;

            throw new Error(details);
        }

        return uniqueAnime.slice(0, REQUIRED_ANIME_COUNT);
    } finally {
        window.clearTimeout(timeoutId);
    }
}

function useAnimePool() {
    const [animePool, setAnimePool] = useState([]);
    const [savedAnimePool, setSavedAnimePool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAnime = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const freshAnime = await fetchFreshAnime();
            saveAnime(freshAnime);
            setAnimePool(freshAnime);
            setSavedAnimePool(freshAnime);
        } catch (error) {
            setError(error.message || "Failed to load anime.");
            setSavedAnimePool(readSavedAnime());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function initialLoad() {
            setLoading(true);

            try {
                const freshAnime = await fetchFreshAnime();

                if (cancelled) return;

                saveAnime(freshAnime);
                setAnimePool(freshAnime);
                setSavedAnimePool(freshAnime);
                setError(null);
            } catch (error) {
                if (cancelled) return;

                setError(error.message || "Failed to load anime.");
                setSavedAnimePool(readSavedAnime());
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initialLoad();

        return () => {
            cancelled = true;
        };
    }, []);

    const retry = useCallback(() => {
        loadAnime();
    }, [loadAnime]);

    const launchSavedCards = useCallback(() => {
        const saved = readSavedAnime();

        if (saved.length >= REQUIRED_ANIME_COUNT) {
            setAnimePool(saved);
            setSavedAnimePool(saved);
            setError(null);
        }
    }, []);

    return {
        animePool,
        loading,
        error,
        savedAnimePool,
        retry,
        launchSavedCards,
    };
}

export default useAnimePool;
