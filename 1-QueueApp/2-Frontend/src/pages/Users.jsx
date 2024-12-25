import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import userService from '../services/usersService'
import Card from "../components/Card"
import userImage from "../assets/user.jpeg";
import Notification from "../components/Notification";

const Users = ({users, setUsers}) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState(null)

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
            setSuccessMessage('User added successfully')
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
        })
      }

    return (
      <div className="page-container">
        <div className="page-con">
          <div className="left">
           <div className="left-container">
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
            <Notification message={successMessage} />
           </div>
          </div>

          <div className="right">
            <div className="container box">
              <h2>All users</h2>
              <div className="articles-container">
                {users.map((user) => (
                  <Card
                    key={user.user_id}
                    cardType="User"
                    user={user}
                    image={userImage}
                  />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Users