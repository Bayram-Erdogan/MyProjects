import { useState, useEffect } from "react"
import Card from '../components/Card'
import profileImage from "../assets/unisex-profile.jpg"
import deskImage from "../assets/desk.jpg"
import userService from '../services/usersService'
import desksService from "../services/desksService"
import customersService from "../services/customersService"

const Admin = ({ queues }) => {
    const [users, setUsers] = useState([]);
    const [desks, setDesks] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setMessage('Token is missing');
        } else {
            userService.getAll()
              .then(initialUsers => {
                setUsers(initialUsers);
              })
              .catch(() => {
                setMessage('Error fetching users.');
              });
        }
      }, []);

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('Token is missing');
      } else {
          desksService.getAll()
          .then(initialDesks => {
            setDesks(initialDesks);
            })
            .catch(() => {
              setMessage('Error fetching desks.');
            });
        }
      }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setMessage('Token is missing');
        } else {
            customersService.getAll()
              .then(initialCustomers => {
                setCustomers(initialCustomers);
              })
              .catch(() => {
                setMessage('Error fetching users.');
              });
        }
      }, []);

    return (
    <div id='admin' className='page-container'>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Users</h2>
          </header>
          <div className="articles-container">
            {users.slice(0, 5).map((user) => ( // slice() from chatgpt
              <Card
                key={user.user_id}
                cardType="User"
                user={user}
                image={profileImage}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Desks</h2>
          </header>
          <div className="articles-container">
            {desks.slice(0, 5).map((desk) => (
              <Card
                key={desk.desk_id}
                cardType="Desk"
                desk = {desk}
                queue_name = {desk.queue_name}
                image={deskImage}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Queues</h2>
          </header>
          <div className="articles-container">
            {queues.slice(0, 5).map((queue) => (
              <Card
                key={queue.queue_id}
                cardType="Queue"
                queue={queue}
                image={queue.qr_code}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
  <div className="box">
    <header className="section-header">
      <h2>Customers</h2>
    </header>
    <div className="articles-container">
      {customers.slice(0, 5).map((customer) => (
        <Card
          key={customer.customer_id}
          cardType="Customer"
          customer={customer}
          image={profileImage}
        />
      ))}
    </div>
  </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Statistics</h2>
          </header>
        </div>
      </section>
    </div>
  )
}

export default Admin

