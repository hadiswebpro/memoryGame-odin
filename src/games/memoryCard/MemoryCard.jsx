import { useEffect, useState } from "react";
import Card from "../../components/Card";
import styles from "./MemoryCard.module.css";

import {
    getCardsForLevel,
    shuffleCards,
} from "./memoryCardLogic";

function MemoryCard({ animePool, level, onChangeLevel }) {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [selectedCards, setSelectedCards] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const cards = getCardsForLevel(animePool, level);
        setCurrentCards(cards);
    }, [animePool, level]);

    function handleCardClick(card) {
        const alreadySelected = selectedCards.some(
            (selectedCard) => selectedCard.id === card.id
        );

        if (alreadySelected) {
            setScore(0);
            setSelectedCards([]);
            setGameOver(true);
            return;
        }

        const newSelectedCards = [...selectedCards, card];

        setSelectedCards(newSelectedCards);

        const newScore = score + 1;

        setScore(newScore);

        if (newScore > bestScore) {
            setBestScore(newScore);
        }

        if (newSelectedCards.length === currentCards.length) {
            setGameWon(true);
            return;
        }

        setCurrentCards(shuffleCards(currentCards));
    }

    function startNewGame() {
        setScore(0);
        setSelectedCards([]);
        setGameWon(false);
        setGameOver(false);

        const newCards = getCardsForLevel(animePool, level);

        setCurrentCards(newCards);
    }

    return (
        <div className={styles.game}>
            <header className={styles.header}>
                <p className={styles.eyebrow}>🧠 MEMORY CARD</p>

                <h1>Remember the cards!</h1>

                <p className={styles.subtitle}>
                    Don't click the same card twice.
                </p>
            </header>

            <div className={styles.gameInfo}>
                <div className={styles.stat}>
                    <span>Level</span>
                    <strong>{level}</strong>
                </div>

                <div className={styles.stat}>
                    <span>Score</span>
                    <strong>{score}</strong>
                </div>

                <div className={styles.stat}>
                    <span>Best</span>
                    <strong>{bestScore}</strong>
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
                        You remembered all {currentCards.length} cards!
                    </p>

                    <button onClick={startNewGame}>
                        Play Again
                    </button>
                </div>
            )}

            {gameOver && (
                <div className={styles.result}>
                    <h2>💀 Game Over!</h2>

                    <p>
                        You clicked a card you already selected.
                    </p>

                    <button onClick={startNewGame}>
                        Try Again
                    </button>
                </div>
            )}

            {!gameWon && !gameOver && (
                <div className={styles.cardGrid}>
                    {currentCards.map((card) => (
                        <Card
                            key={card.id}
                            name={card.name}
                            image={card.image}
                            onClick={() => handleCardClick(card)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MemoryCard;