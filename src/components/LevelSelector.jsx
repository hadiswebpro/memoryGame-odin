import styles from "./LevelSelector.module.css";

function LevelSelector({ game, onSelectLevel }) {
    const levels = game === "memory-matching"
        ? [
            { level: 1, cards: 20, label: "10 pairs", emoji: "🟢" },
            { level: 2, cards: 30, label: "15 pairs", emoji: "🟠" },
            { level: 3, cards: 50, label: "25 pairs", emoji: "🔥" },
        ]
        : [
            { level: 1, cards: 12, label: "12 cards", emoji: "🟢" },
            { level: 2, cards: 20, label: "20 cards", emoji: "🟠" },
            { level: 3, cards: 40, label: "40 cards", emoji: "🔥" },
        ];

    return (
        <div className={styles.selector}>
            <h2>Choose your level</h2>

            <div className={styles.levels}>
                {levels.map(({ level, cards, label, emoji }) => (
                    <button
                        key={level}
                        className={styles.levelButton}
                        onClick={() => onSelectLevel(level)}
                        type="button"
                    >
                        <span className={styles.levelNumber}>{level}</span>
                        <span aria-hidden="true">{emoji}</span>
                        <span className={styles.levelTitle}>Level {level}</span>
                        <span className={styles.levelCards}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LevelSelector;
