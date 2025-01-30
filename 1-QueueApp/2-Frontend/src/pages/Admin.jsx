import { useState, useEffect } from "react";
import Card from "../components/Card";
import profileImage from "../assets/unisex-profile.jpg";
import deskImage from "../assets/desk.jpg";
import userService from "../services/usersService";
import desksService from "../services/desksService";
import customersService from "../services/customersService";
import queuesService from "../services/queuesService";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [desks, setDesks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token is missing");
    } else {
      userService
        .getAll()
        .then((initialUsers) => {
          setUsers(initialUsers);
        })
        .catch(() => {
          console.error("Error fetching users.");
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token is missing");
    } else {
      desksService
        .getAll()
        .then((initialDesks) => {
          setDesks(initialDesks);
        })
        .catch(() => {
          console.error("Error fetching desks.");
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token is missing");
    } else {
      queuesService
        .getAll()
        .then((initialQueues) => {
          setQueues(initialQueues);
        })
        .catch(() => {
          console.error("Error fetching queues.");
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token is missing");
    } else {
      customersService
        .getAll()
        .then((initialCustomers) => {
          setCustomers(initialCustomers);
        })
        .catch(() => {
          console.error("Error fetching customers.");
        });
    }
  }, []);

  return (
    <div id="admin" className="page-container">
      <div className="container">
        <div className="articles-container">
          <section>
            <div className="box">
              <header className="section-header">
                <h2>Users</h2>
              </header>
              <div className="cards-row">
                {users
                  .slice()
                  .reverse()
                  .slice(0, 1)
                  .map((user) => (
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
              <div className="cards-row">
                {desks
                  .slice()
                  .reverse()
                  .slice(0, 1)
                  .map((desk) => (
                    <Card
                      key={desk.desk_id}
                      cardType="Desk"
                      desk={desk}
                      queue_name={desk.queue_name}
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
              <div className="cards-row">
                {queues
                  .slice()
                  .reverse()
                  .slice(0, 1)
                  .map((queue) => (
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
              <div className="cards-row">
                {customers
                  .slice()
                  .reverse()
                  .slice(0, 1)
                  .map((customer) => (
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
