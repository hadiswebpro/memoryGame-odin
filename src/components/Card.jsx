import styles from "./Card.module.css";

function Card({ name, image, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <img
                src={image}
                alt={name}
                className={styles.image}
            />

            <p>{name}</p>
        </div>
    );
}

export default Card;