const Button = ({onClick, text}) => {
    return (
      <button className="btn" onClick={onClick}>
        {text}
      </button>
    )
  }

export default Button