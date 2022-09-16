import css from "./TextSizing.module.css";

const TextSizing = () => {
    return (
        <div className={css["tools__text-size"]}>
            <button className={css["tools__text-size-minus"]}>-</button>
            <input type="number" />
            <button className={css["tools__text-size-plus"]}>+</button>
        </div>
    )
}

export default TextSizing;