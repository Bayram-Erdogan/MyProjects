const Input = ({type, placeholder, name, value, onChange}) => {
    return (
        <div>
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
