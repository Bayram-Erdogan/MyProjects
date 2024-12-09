import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"

const Users = () => {
    const [users, setUsers] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleUsers =(event) => {
        console.log('User added with', username, email, password)
        event.preventDefault();
        setUsername('')
        setPassword('')
        setEmail('')
    }

    return (
        <div>
            <h1>Users</h1>
            <h2>Add new user</h2>
            <form onSubmit={handleUsers}>
                <Input
                    type = {"text"}
                    placeholder = {"Username"}
                    name = {"username"}
                    value = {username}
                    onChange={({target}) => setUsername(target.value)}
                />

                <Input
                    type = {"email"}
                    placeholder = {"Email"}
                    name = {"email"}
                    value = {email}
                    onChange={({target}) => setEmail(target.value)}
                />

                <Input
                    type = {"password"}
                    placeholder = {"Password"}
                    name = {"password"}
                    value = {password}
                    onChange={({target}) => setPassword(target.value)}
                />

                <Button text={'Create new user'}/>
            </form>
            <h2>All users</h2>
        </div>
    )
}

export default Users