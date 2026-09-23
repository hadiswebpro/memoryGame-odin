import { useEffect, useState } from "react";

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

const fallbackAnimeNames = [
    "One Piece", "Naruto", "Attack on Titan", "Demon Slayer",
    "Jujutsu Kaisen", "Death Note", "My Hero Academia", "Haikyuu!!",
    "SPY x FAMILY", "One Punch Man", "Bleach", "Fullmetal Alchemist",
    "Hunter x Hunter", "Steins;Gate", "Violet Evergarden", "Fruits Basket",
    "Sword Art Online", "Made in Abyss", "Kaguya-sama", "Your Name",
];

function createFallbackImage(name, index) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
            <rect width="600" height="800" rx="32" fill="#dcefe7"/>
            <circle cx="300" cy="285" r="120" fill="#f8e3ea"/>
            <text x="300" y="315" text-anchor="middle" font-size="110" fill="#8aa89d">✦</text>
            <text x="300" y="540" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#6f665d">${name}</text>
            <text x="300" y="590" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#8a8178">backup card ${index + 1}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const fallbackAnime = fallbackAnimeNames.map((name, index) => ({
    animeId: `fallback-${index + 1}`,
    name,
    image: createFallbackImage(name, index),
}));

async function fetchAnimePage(page) {
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

function useAnimePool() {
    const [animePool, setAnimePool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchAnime() {
            try {
                const results = await Promise.allSettled([
                    fetchAnimePage(1),
                    fetchAnimePage(2),
                ]);

                if (cancelled) {
                    return;
                }

                const successfulPages = results
                    .filter((result) => result.status === "fulfilled")
                    .map((result) => result.value)
                    .flat();

                const failedPages = results
                    .filter((result) => result.status === "rejected")
                    .map((result) => result.reason?.message || String(result.reason));

                if (successfulPages.length >= 50) {
                    setAnimePool(successfulPages);
                    setUsingFallback(false);
                    setError(null);
                } else {
                    const details = failedPages.length
                        ? failedPages.join(" | ")
                        : `Anime API returned only ${successfulPages.length} cards.`;

                    throw new Error(details);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setAnimePool(fallbackAnime);
                setUsingFallback(true);
                setError(error.message);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchAnime();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        animePool,
        loading,
        error,
        usingFallback,
    };
}

export default useAnimePool;
