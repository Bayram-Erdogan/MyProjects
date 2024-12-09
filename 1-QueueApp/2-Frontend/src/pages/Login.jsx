import { useState } from "react"
import Button from "../components/Button"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin =(event) => {
        console.log('logging in with', username, password)
        event.preventDefault();
        setUsername('')
        setPassword('')
    }

    return(
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        name="username"
                        onChange={({target}) => setUsername(target.value)}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        name="password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                </div>
                <Button text={'Sign in'}/>
            </form>

        </div>
    )
}

export default Login