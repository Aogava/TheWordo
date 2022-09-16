import css from "./TextAligning.module.css";

const TextAligning = () => {
    return (
        <div className={css["tools__aligning"]}>
            <button className={css["tools__left-text-align"]}><img src='./img/left-align.svg' /></button>
            <button className={css["tools__center-text-align"]}><img src='./img/center-align.svg' /></button>
            <button className={css["tools__right-text-align"]}><img src='./img/right-align.svg' /></button>
        </div>
    )
}

export default TextAligning;