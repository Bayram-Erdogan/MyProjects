const Input = ({type, placeholder, name, value, onChange, text}) => {
    return (
        <div>
            <div>{text}</div>
            <input className="input"
                type={type}
                placeholder={placeholder}
                name={name}
                value = {value}
                onChange={onChange}
            />
        </div>
    )
}

export default Input
