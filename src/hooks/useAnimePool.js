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

const fallbackAnime = [
    [21, "One Piece", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-8d6e5d6f.jpg"],
    [20, "Naruto", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-d7f6b4d6.jpg"],
    [16498, "Attack on Titan", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-6VvXwG9Q.jpg"],
    [101922, "Demon Slayer", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-9J6M0q9m.jpg"],
    [113415, "Jujutsu Kaisen", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-8z8m2X2G.jpg"],
    [1535, "Death Note", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-7Y3n3k1G.jpg"],
    [21459, "My Hero Academia", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-2H5k4V4Y.jpg"],
    [20464, "Haikyuu!!", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20464-8M4c9V3P.jpg"],
    [142838, "SPY x FAMILY", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142838-3J4m9K7P.jpg"],
    [21087, "One Punch Man", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21087-5K7p2M8Q.jpg"],
    [269, "Bleach", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-4R8n6T2W.jpg"],
    [5114, "Fullmetal Alchemist: Brotherhood", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-6Q2v9N4L.jpg"],
    [11061, "Hunter x Hunter", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-1X5m7P3K.jpg"],
    [9253, "Steins;Gate", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-2Z8k4L6M.jpg"],
    [99147, "March Comes in Like a Lion", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx99147-7N3q5R8T.jpg"],
    [100166, "Violet Evergarden", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx100166-4M6p8K2V.jpg"],
    [106479, "Fruits Basket", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx106479-9L2n5Q7W.jpg"],
    [11757, "Sword Art Online", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11757-3P6r8M1K.jpg"],
    [101280, "Made in Abyss", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101280-5T7v2N9Q.jpg"],
    [98659, "Kaguya-sama: Love is War", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98659-8W4m1P6R.jpg"],
];

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

                if (successfulPages.length >= 20) {
                    setAnimePool(successfulPages);
                    setUsingFallback(false);
                    setError(null);
                } else {
                    throw new Error("Anime API returned too little data.");
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setAnimePool(
                    fallbackAnime.map(([animeId, name, image]) => ({
                        animeId,
                        name,
                        image,
                    }))
                );
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
