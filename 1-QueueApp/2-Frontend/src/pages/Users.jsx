import { useState, useEffect } from "react"
import axios from "axios"
import Input from "../components/Input"
import Button from "../components/Button"
import userService from '../services/usersService'

const Users = () => {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
      userService
        .getAll()
        .then(initialUsers => {
          setUsers(initialUsers)
        })
    },[])

    const addUser = event => {
        event.preventDefault()
        const userObject = {
            name : username,
            email : email,
            password : password
        }

        userService
          .create(userObject)
          .then(returnedUser => {
            setUsers(users.concat(returnedUser))
            setUsername('')
            setEmail('')
            setPassword('')
        })
      }

    return (
        <div>
            <h1>Users</h1>
            <h2>Add new user</h2>
            <form onSubmit={addUser}>
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
            <div>
                {users.map((user) => (
                    <div key={user.user_id}>
                        <p><strong>User:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {/* <p><strong>Password:</strong> {user.password}</p> */}
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users