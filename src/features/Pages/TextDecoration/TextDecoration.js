import css from "./TextDecoration.module.css";

const TextDecoration = () => {
    return (
        <div className={css["tools__text-decoration"]}>
            <button className={css["tools__bold"]}>B</button>
            <button className={css["tools__italic"]}>I</button>
            <button className={css["tools__underline"]}>U</button>
            <button className={css["tools__color"]}>A</button>
        </div>
    )
}

export default TextDecoration;