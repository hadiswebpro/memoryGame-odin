import { useEffect, useState } from "react";

const query = `
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(
                type: ANIME
                sort: POPULARITY_DESC
                isAdult: true
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

    useEffect(() => {
        async function fetchAnime() {
            try {
                const pageOne = await fetchAnimePage(1);
                const pageTwo = await fetchAnimePage(2);

                setAnimePool([...pageOne, ...pageTwo]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAnime();
    }, []);

    return {
        animePool,
        loading,
        error,
    };
}

export default useAnimePool;