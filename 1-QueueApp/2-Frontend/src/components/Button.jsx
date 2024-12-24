const Button = ({onClick, text, style}) => {
    return (
      <button className="btn" onClick={onClick}>
        {text}
      </button>
    )
  }

export default Button