import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import desksService from "../services/desksService";
import usersService from "../services/usersService";
import Card from "../components/Card";
import deskImage from "../assets/desk.jpg";
import Notification from "../components/Notification";

const Desks = () => {
  const [users, setUsers] = useState([]);
  const [desks, setDesks] = useState([]);
  const [deskNumber, setDeskNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("Token is missing");
    } else {
      desksService
        .getAll()
        .then((initialDesks) => {
          setDesks(initialDesks);
        })
        .catch(() => {
          setMessage("Error fetching desks.");
        });
    }
  }, []);

  useEffect(() => {
    usersService.getAll().then((initialUsers) => {
      setUsers(initialUsers);
    });
  }, []);

  const addDesk = (event) => {
    event.preventDefault();

    const deskObject = {
      desk_number: deskNumber,
      userId: selectedUser || null,
    };

    desksService.create(deskObject).then((returnedDesk) => {
      setDesks(desks.concat(returnedDesk));
      setDeskNumber("");
      setSelectedUser(null);
      setMessage("Desk added successfully");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  return (
    <div className="page-container">
      <div className="page-con">
        <div className="left">
          <div className="left-container">
            <h2>Add new desk</h2>
            <form onSubmit={addDesk}>
              <Input
                type={"text"}
                placeholder={"Desk number"}
                name={"desk_number"}
                value={deskNumber}
                onChange={({ target }) => setDeskNumber(target.value)}
              />

              <div>
                <select className="select"
                  value={selectedUser || ""}
                  onChange={({ target }) => setSelectedUser(target.value)}
                >
                  <option value="" disabled>
                    Select a user
                  </option>
                  {users
                    .filter((user) => user.status === "Free")
                    .map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <Button text={"Create new desk"} />
            </form>
            <Notification message={message} />
          </div>
        </div>

        <div className="right">
          <div className="container box">
            <h2>All Desks</h2>
            <div className="cards-row">
              {desks.map((desk) => (
                <Card
                  key={desk.desk_id}
                  cardType="Desk"
                  desk={desk}
                  image={deskImage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desks;
