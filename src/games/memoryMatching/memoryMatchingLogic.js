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

    if (animePool.length < pairCount) {
        throw new Error("Not enough anime cards available.");
    }

    const shuffledAnime = [...animePool];

    for (let i = shuffledAnime.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffledAnime[i], shuffledAnime[randomIndex]] = [
            shuffledAnime[randomIndex],
            shuffledAnime[i],
        ];
    }

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

    for (let i = cards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [cards[i], cards[randomIndex]] = [
            cards[randomIndex],
            cards[i],
        ];
    }

    return cards;
}
