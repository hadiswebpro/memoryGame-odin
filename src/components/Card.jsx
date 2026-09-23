import styles from "./Card.module.css";

function Card({ image, name, isFlipped = true, isMatched = false, onClick }) {
    const isVisible = isFlipped || isMatched;

    return (
        <button
            className={`${styles.card} ${isVisible ? styles.flipped : ""}`}
            onClick={onClick}
            type="button"
            aria-label={isVisible ? name : "Hidden card"}
        >
            <span className={styles.cardInner}>
                <span className={styles.cardFront}>
                    <img src={image} alt={name} className={styles.image} />
                </span>

                <span className={styles.cardBack} aria-hidden="true">
                    <span className={styles.star}>✦</span>
                </span>
            </span>
        </button>
    );
}

export default Card;
