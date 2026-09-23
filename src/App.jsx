import { useState } from "react";
import LevelSelector from "./components/LevelSelector";
import MemoryCard from "./games/memoryCard/MemoryCard";
import styles from "./App.module.css";
import useAnimePool from "./hooks/useAnimePool";

function App() {
    const [game, setGame] = useState(null);
    const [level, setLevel] = useState(null);

    const { animePool, loading, error } = useAnimePool();

    function handleGameSelect(selectedGame) {
        setGame(selectedGame);
    }

    function handleLevelSelect(selectedLevel) {
        setLevel(selectedLevel);
    }

    function handleChangeLevel() {
        setLevel(null);
    }

    function handleBackToGames() {
        setGame(null);
        setLevel(null);
    }

    if (loading) {
        return (
            <div className={styles.app}>
                <div className={styles.message}>
                    <div className={styles.loader}></div>
                    <p>Loading anime...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.app}>
                <div className={styles.message}>
                    <h2>Something went wrong 😢</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (game === null) {
        return (
            <div className={styles.app}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>
                        🧠 MEMORY GAMES
                    </p>

                    <h1>Let's Play!</h1>

                    <p className={styles.subtitle}>
                        Choose a game and test your memory.
                    </p>
                </header>

                <div className={styles.gameMenu}>
                    <button
                        className={styles.gameCard}
                        onClick={() => handleGameSelect("memory-card")}
                    >
                        <span className={styles.gameIcon}>🃏</span>

                        <strong>Memory Card</strong>

                        <span>
                            Don't click the same card twice.
                        </span>
                    </button>

                    <button
                        className={styles.gameCard}
                        disabled
                    >
                        <span className={styles.gameIcon}>🧩</span>

                        <strong>Memory Matching</strong>

                        <span>Coming soon...</span>
                    </button>
                </div>
            </div>
        );
    }

    if (level === null) {
        return (
            <div className={styles.app}>
                <button
                    className={styles.backButton}
                    onClick={handleBackToGames}
                >
                    ← Back to Games
                </button>

                <header className={styles.header}>
                    <p className={styles.eyebrow}>
                        🃏 MEMORY CARD
                    </p>

                    <h1>Select Level</h1>

                    <p className={styles.subtitle}>
                        How many cards can you remember?
                    </p>
                </header>

                <LevelSelector
                    onSelectLevel={handleLevelSelect}
                />
            </div>
        );
    }

    if (game === "memory-card") {
        return (
            <div className={styles.app}>
                <MemoryCard
                    animePool={animePool}
                    level={level}
                    onChangeLevel={handleChangeLevel}
                />
            </div>
        );
    }
}

export default App;