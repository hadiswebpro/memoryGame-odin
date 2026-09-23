export function shuffleCards(cards) {
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[i],
        ];
    }

    return shuffled;
}

export function getCardsForLevel(animePool, level) {
    const levelSizes = {
        1: 6,
        2: 12,
        3: 20,
    };

    const cardCount = levelSizes[level];

    if (!cardCount) {
        throw new Error("Invalid level");
    }

    if (animePool.length < cardCount) {
        throw new Error("Not enough anime cards available.");
    }

    const shuffledAnime = shuffleCards(animePool);

    return shuffledAnime.slice(0, cardCount).map((anime, index) => ({
        id: index + 1,
        animeId: anime.animeId,
        name: anime.name,
        image: anime.image,
    }));
}
