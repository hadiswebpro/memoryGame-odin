function LevelSelector({ onSelectLevel }) {
    return (
        <div>
            <h2>Select Level</h2>

            <button onClick={() => onSelectLevel(1)}>
                Level 1
            </button>

            <button onClick={() => onSelectLevel(2)}>
                Level 2
            </button>

            <button onClick={() => onSelectLevel(3)}>
                Level 3
            </button>
        </div>
    );
}

export default LevelSelector;