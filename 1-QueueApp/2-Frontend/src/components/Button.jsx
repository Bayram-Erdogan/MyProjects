const Button = ({onClick, text, style}) => {
    return (
      <button className={style} onClick={onClick}>
        {text}
      </button>
    )
  }

export default Button