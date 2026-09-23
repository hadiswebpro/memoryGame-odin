import styles from "./Card.module.css";

function Card({ name, image, onClick }) {
    return (
        <button className={styles.card} onClick={onClick} type="button">
            <img
                src={image}
                alt=""
                className={styles.image}
            />
        </button>
    );
}

export default Card;