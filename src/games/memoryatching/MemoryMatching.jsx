import { useEffect, useState } from "react";
import Card from "../../components/Card";
import styles from "./MemoryMatching.module.css";

import { createMatchingCards } from "./memoryMatchingLogic";

function MemoryMatching({ animePool, level, onChangeLevel }) {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        startNewGame();
    }, [animePool, level]);

    function startNewGame() {
        const newCards = createMatchingCards(
            animePool,
            level
        );

        setCards(newCards);
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
        setIsChecking(false);
        setGameWon(false);
    }

    function handleCardClick(card) {
        if (isChecking) {
            return;
        }

        if (flippedCards.includes(card.id)) {
            return;
        }

        if (matchedCards.includes(card.id)) {
            return;
        }

        if (flippedCards.length === 2) {
            return;
        }

        const newFlippedCards = [...flippedCards, card.id];

        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length < 2) {
            return;
        }

        setMoves((currentMoves) => currentMoves + 1);

        const firstCard = cards.find(
            (item) => item.id === newFlippedCards[0]
        );

        const secondCard = cards.find(
            (item) => item.id === newFlippedCards[1]
        );

        if (firstCard.animeId === secondCard.animeId) {
            const newMatchedCards = [
                ...matchedCards,
                firstCard.id,
                secondCard.id,
            ];

            setMatchedCards(newMatchedCards);
            setFlippedCards([]);

            if (newMatchedCards.length === cards.length) {
                setGameWon(true);
            }

            return;
        }

        setIsChecking(true);

        setTimeout(() => {
            setFlippedCards([]);
            setIsChecking(false);
        }, 800);
    }

    return (
        <div className={styles.game}>
            <header className={styles.header}>
                <p className={styles.eyebrow}>
                    🧩 MEMORY MATCHING
                </p>

                <h1>Find the matching pairs!</h1>

                <p className={styles.subtitle}>
                    Match every pair of anime cards.
                </p>
            </header>

            <div className={styles.gameInfo}>
                <div className={styles.stat}>
                    <span>Level</span>
                    <strong>{level}</strong>
                </div>

                <div className={styles.stat}>
                    <span>Moves</span>
                    <strong>{moves}</strong>
                </div>

                <div className={styles.stat}>
                    <span>Pairs</span>
                    <strong>
                        {matchedCards.length / 2}
                    </strong>
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={startNewGame}>
                    New Game
                </button>

                <button onClick={onChangeLevel}>
                    Change Level
                </button>
            </div>

            {gameWon && (
                <div className={styles.result}>
                    <h2>🎉 You Win!</h2>

                    <p>
                        You found all {cards.length / 2} pairs!
                    </p>

                    <button onClick={startNewGame}>
                        Play Again
                    </button>
                </div>
            )}

            {!gameWon && (
                <div className={styles.cardGrid}>
                    {cards.map((card) => {
                        const isFlipped =
                            flippedCards.includes(card.id);

                        const isMatched =
                            matchedCards.includes(card.id);

                        return (
                            <Card
                                key={card.id}
                                name={
                                    isFlipped || isMatched
                                        ? card.name
                                        : "?"
                                }
                                image={
                                    isFlipped || isMatched
                                        ? card.image
                                        : null
                                }
                                onClick={() =>
                                    handleCardClick(card)
                                }
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MemoryMatching;