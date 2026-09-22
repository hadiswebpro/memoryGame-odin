import { useState } from "react";
import Card from "./components/Card";
import styles from "./App.module.css";

const cards = [
    { id: 1, name: "Kirby" },
    { id: 2, name: "Minecraft" },
    { id: 3, name: "Pikachu" },
    { id: 4, name: "Creeper" },
];

function App() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [selectedCards, setSelectedCards] = useState([]);
    const [currentCards, setCurrentCards] = useState(cards);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    function handleCardClick(card) {
        // Check if this card was already selected
        const alreadySelected = selectedCards.some(
            (selectedCard) => selectedCard.id === card.id
        );

        // Game Over
        if (alreadySelected) {
    setScore(0);
    setSelectedCards([]);
    setCurrentCards(cards);
    setGameOver(true);

    return;
}

        // Add the new card to selected cards
        const newSelectedCards = [...selectedCards, card];

        setSelectedCards(newSelectedCards);
        setScore(score + 1);

        // Update best score
        if (score + 1 > bestScore) {
            setBestScore(score + 1);
        }

        // Check if the player selected every card
        if (newSelectedCards.length === cards.length) {
            setGameWon(true);
            return;
        }

        // Shuffle cards
        const shuffledCards = [...currentCards];
        shuffledCards.sort(() => Math.random() - 0.5);

        setCurrentCards(shuffledCards);
    }

    function restartGame() {
        setScore(0);
        setSelectedCards([]);
        setCurrentCards(cards);
        setGameWon(false);
    }

    return (
        <div>
            <h1>Memory Game</h1>

            <p>Score: {score}</p>
            <p>Best Score: {bestScore}</p>

            
             {gameWon ? (
    <div>
        <h2>🎉 You Win!</h2>
        <button onClick={restartGame}>Play Again</button>
    </div>
) : gameOver ? (
    <div>
        <h2>💀 Game Over!</h2>
        <button onClick={restartGame}>Try Again</button>
    </div>
) : (
    <div className={styles.cardGrid}>
        {currentCards.map((card) => (
            <Card
                key={card.id}
                name={card.name}
                onClick={() => handleCardClick(card)}
            />
        ))}
    </div>
)}
        </div>
    );
}

export default App;