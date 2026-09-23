import styles from "./LevelSelector.module.css";

function LevelSelector({ onSelectLevel }) {
    const levels = [
        { level: 1, cards: 6 },
        { level: 2, cards: 12 },
        { level: 3, cards: 20 },
    ];

    return (
        <div className={styles.selector}>
            <h2>Choose your level</h2>

            <div className={styles.levels}>
                {levels.map(({ level, cards }) => (
                    <button
                        key={level}
                        className={styles.levelButton}
                        onClick={() => onSelectLevel(level)}
                        type="button"
                    >
                        <span className={styles.levelNumber}>{level}</span>
                        <span className={styles.levelTitle}>Level {level}</span>
                        <span className={styles.levelCards}>{cards} cards</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LevelSelector;
