const Input = ({type, placeholder, name, value, onChange, text}) => {
    return (
        <div>
            {text}
            <input
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
