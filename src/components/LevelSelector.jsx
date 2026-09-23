import styles from "./LevelSelector.module.css";

function LevelSelector({ game, onSelectLevel }) {
    const levels = game === "memory-matching"
        ? [
            { level: 1, cards: 12, label: "6 pairs" },
            { level: 2, cards: 16, label: "8 pairs" },
            { level: 3, cards: 20, label: "10 pairs" },
        ]
        : [
            { level: 1, cards: 6, label: "6 cards" },
            { level: 2, cards: 12, label: "12 cards" },
            { level: 3, cards: 20, label: "20 cards" },
        ];

    return (
        <div className={styles.selector}>
            <h2>Choose your level</h2>

            <div className={styles.levels}>
                {levels.map(({ level, cards, label }) => (
                    <button
                        key={level}
                        className={styles.levelButton}
                        onClick={() => onSelectLevel(level)}
                        type="button"
                    >
                        <span className={styles.levelNumber}>{level}</span>
                        <span className={styles.levelTitle}>Level {level}</span>
                        <span className={styles.levelCards}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LevelSelector;
