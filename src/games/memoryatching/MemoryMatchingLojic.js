export function createMatchingCards(animePool, level) {
    const levelPairs = {
        1: 6,
        2: 8,
        3: 10,
    };

    const pairCount = levelPairs[level];

    if (!pairCount) {
        throw new Error("Invalid level");
    }

    const shuffledAnime = [...animePool].sort(
        () => Math.random() - 0.5
    );

    const selectedAnime = shuffledAnime.slice(0, pairCount);

    const cards = selectedAnime.flatMap((anime) => [
        {
            id: `${anime.animeId}-1`,
            animeId: anime.animeId,
            name: anime.name,
            image: anime.image,
        },
        {
            id: `${anime.animeId}-2`,
            animeId: anime.animeId,
            name: anime.name,
            image: anime.image,
        },
    ]);

    return cards.sort(() => Math.random() - 0.5);
}