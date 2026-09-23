import { useEffect, useState } from "react";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAnimePage(page) {
    const response = await fetch(
        `https://api.jikan.moe/v4/anime?page=${page}&limit=25`
    );

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((item) => ({
        animeId: item.mal_id,
        name: item.title,
        image: item.images.jpg.image_url,
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

                await delay(1000);

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