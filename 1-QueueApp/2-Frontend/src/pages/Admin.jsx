import { useState, useEffect } from "react"
import Card from '../components/Card'
import userService from '../services/usersService'
import desksService from "../services/desksService"
import queuesServices from "../services/queuesServices"
import userImage from "../assets/poster.jpeg";
import deskImage from "../assets/desk.jpg";
import queueImage from "../assets/queue.jpg";

const Admin = () => {
  const [users, setUsers] = useState([])
  const [desks, setDesks] = useState([])
  const [queues, setQueues] = useState([])

  useEffect(() => {
    userService
      .getAll()
      .then(initialUsers => {
        setUsers(initialUsers)
      })
  }, [])

  useEffect(() => {
    desksService
      .getAll()
      .then(initialDesks => {
        setDesks(initialDesks)
      })
  }, [])

  useEffect(() => {
    queuesServices
      .getAll()
      .then(initialQueues => {
        setQueues(initialQueues)
      })
  }, [])

  return (
    <div>
      <h1>Admin Page</h1>
      <section>
        <div>
          <div className="container">
            <h2>Users</h2>
            <div className="articles-container">
              {users.slice(0, 5).map((user) => ( // slice() from chatgpt
                <Card
                  key={user.user_id}
                  cardType="User"
                  title={user.name}
                  user={user}
                  text_1="Desk"
                  text_2="Queue"
                  image={userImage}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <div className="container">
            <h2>Desks</h2>
            <div className="articles-container">
              {desks.slice(0, 5).map((desk) => (
                <Card
                  key={desk.desk_id}
                  cardType="Desk"
                  title={desk.desk_number}
                  image={deskImage}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div>
          <div className="container">
            <h2>Queues</h2>
            <div className="articles-container">
              {queues.slice(0, 5).map((queue) => (
                <Card
                  key={queue.queue_id}
                  cardType="Queue"
                  title={queue.queue_name}
                  attached_desk={queue.attached_desk}
                  max_of_customer={queue.max_of_customer}
                  image={queueImage}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2>Customers</h2>
      </section>
      <section>
        <h2>Statistics</h2>
      </section>
    </div>
  )
}

export default Admin

