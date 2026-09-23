import { useEffect, useState } from "react";
import LevelSelector from "./components/LevelSelector";
import MemoryCard from "./games/memoryCard/MemoryCard";
import MemoryMatching from "./games/memoryMatching/MemoryMatching";
import styles from "./App.module.css";
import useAnimePool from "./hooks/useAnimePool";

function App() {
    const [game, setGame] = useState(null);
    const [level, setLevel] = useState(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const [preparingSeconds, setPreparingSeconds] = useState(10);
    const [hasPreparedOnce, setHasPreparedOnce] = useState(false);

    const { animePool, loading, error, usingFallback } = useAnimePool();

    function handleGameSelect(selectedGame) {
        setGame(selectedGame);
    }

    function handleLevelSelect(selectedLevel) {
        setLevel(selectedLevel);
        const preparationTime = hasPreparedOnce ? 2 : 10;
        setPreparingSeconds(preparationTime);
        setIsPreparing(true);
    }

    useEffect(() => {
        if (!isPreparing || level === null) return;

        let remaining = preparingSeconds;
        const timerId = setInterval(() => {
            remaining -= 1;
            setPreparingSeconds(remaining);
            if (remaining <= 0) {
                clearInterval(timerId);
                setIsPreparing(false);
                setHasPreparedOnce(true);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [isPreparing, level, preparingSeconds]);

    function handleChangeLevel() {
        setLevel(null);
    }

    function handleBackToGames() {
        setGame(null);
        setLevel(null);
    }

    if (loading && animePool.length === 0) {
        return (
            <div className={styles.app}>
                <div className={styles.message}>
                    <div className={styles.loader}></div>
                    <p>Loading anime...</p>
                </div>
            </div>
        );
    }

    if (isPreparing && level !== null) {
        return (
            <div className={styles.app}>
                <div className={styles.preparing}>
                    <div className={styles.preparingIcon}>✦</div>
                    <p className={styles.eyebrow}>GETTING EVERYTHING READY</p>
                    <h1>Preparing Cards...</h1>
                    <p>Loading your game.</p>
                    <div className={styles.preparingTimer}>{preparingSeconds}</div>
                    <span>Starting in {preparingSeconds}s</span>
                </div>
            </div>
        );
    }

    if (game === null) {
        return (
            <div className={styles.app}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>🧠 MEMORY GAMES</p>
                    <h1>Let's Play!</h1>
                    <p className={styles.subtitle}>
                        Choose a game and test your memory.
                    </p>
                </header>

                {usingFallback && (
                    <div className={styles.notice}>
                        Failed to load the game, please check your internet connection.
                    </div>
                )}

                <div className={styles.gameMenu}>
                    <button
                        className={styles.gameCard}
                        onClick={() => handleGameSelect("memory-card")}
                        type="button"
                    >
                        <span className={styles.gameIcon}>🃏</span>
                        <strong>Memory Card</strong>
                        <span>Don't click the same card twice.</span>
                    </button>

                    <button
                        className={styles.gameCard}
                        onClick={() => handleGameSelect("memory-matching")}
                        type="button"
                    >
                        <span className={styles.gameIcon}>🧩</span>
                        <strong>Memory Matching</strong>
                        <span>Find every matching pair.</span>
                    </button>
                </div>
            </div>
        );
    }

    if (level === null) {
        const isMatching = game === "memory-matching";

        return (
            <div className={styles.app}>
                <div className={styles.levelPage}>
                <button
                    className={styles.backButton}
                    onClick={handleBackToGames}
                    type="button"
                >
                    ← Back to Games
                </button>

                <header className={styles.header}>
                    <p className={styles.eyebrow}>
                        {isMatching ? "🧩 MEMORY MATCHING" : "🃏 MEMORY CARD"}
                    </p>

                    <h1>Select Level</h1>

                    <p className={styles.subtitle}>
                        {isMatching
                            ? "How many pairs can you match?"
                            : "How many cards can you remember?"}
                    </p>
                </header>

                <LevelSelector
                    game={game}
                    onSelectLevel={handleLevelSelect}
                />
                </div>
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

    if (game === "memory-matching") {
        return (
            <div className={styles.app}>
                <MemoryMatching
                    animePool={animePool}
                    level={level}
                    onChangeLevel={handleChangeLevel}
                />
            </div>
        );
    }
}

export default App;
