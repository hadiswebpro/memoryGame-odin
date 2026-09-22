import styles from "./Card.module.css";

function Card({ name, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            {name}
        </div>
    );
}

export default Card;

