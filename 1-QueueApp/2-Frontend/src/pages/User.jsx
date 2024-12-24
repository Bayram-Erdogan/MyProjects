import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import usersServices from "../services/usersService";

const User = ({ users, setUsers }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdTime, setCreatedTime] = useState({ date: "", hour: "" });
  const [createdBy, setCreatedBy] = useState("");
  const [desk, setDesk] = useState("");
  const [queue, setQueue] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();
  const user = users.find((user) => user.user_id === id);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPassword("");
      setCreatedTime(user.createdTime || { date: "", hour: "" });
      setCreatedBy(user.createdBy || "");
      setDesk(user.desk || "");
      setQueue(user.queue || "");
    }
  }, [user]);

  const updateUser = (event) => {
    event.preventDefault();
    const updatedUser = {
      name,
      email,
      password,
      createdTime,
      createdBy,
      desk,
      queue,
    };

    usersServices.update(id, updatedUser).then((updatedUser) => {
      setUsers(users.map((u) => (u.user_id === id ? updatedUser : u)));
      setSuccessMessage("User updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    });
  };

  return (
    <div className="page-container">
      <div className="left">
        <form onSubmit={updateUser}>
          <Input
            text={"Name :"}
            type={"text"}
            placeholder={"Name"}
            name={"name"}
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <Input
            text={"Email :"}
            type={"email"}
            placeholder={"Email"}
            name={"email"}
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <Input
            text={"Password :"}
            type={"password"}
            placeholder={"Password"}
            name={"password"}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Input
            text={"Created Time (Date) :"}
            type={"text"}
            placeholder={"Created Date"}
            name={"created_date"}
            value={createdTime.date}
            onChange={({ target }) =>
              setCreatedTime({ ...createdTime, date: target.value })
            }
          />
          <Input
            text={"Created Time (Hour) :"}
            type={"text"}
            placeholder={"Created Hour"}
            name={"created_hour"}
            value={createdTime.hour}
            onChange={({ target }) =>
              setCreatedTime({ ...createdTime, hour: target.value })
            }
          />
          <Input
            text={"Created By :"}
            type={"text"}
            placeholder={"Created By"}
            name={"created_by"}
            value={createdBy}
            onChange={({ target }) => setCreatedBy(target.value)}
          />
          <Input
            text={"Desk :"}
            type={"text"}
            placeholder={"Desk"}
            name={"desk"}
            value={desk}
            onChange={({ target }) => setDesk(target.value)}
          />
          <Input
            text={"Queue :"}
            type={"text"}
            placeholder={"Queue"}
            name={"queue"}
            value={queue}
            onChange={({ target }) => setQueue(target.value)}
          />
          <Button text={"Update"} />
        </form>
        <Notification message={successMessage} />
      </div>

      <div className="right">
        <h1>{user.name} Details</h1>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>User ID</strong></td>
              <td className="middle-column">:</td>
              <td>{user.user_id}</td>
            </tr>
            <tr>
              <td><strong>Name</strong></td>
              <td className="middle-column">:</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td className="middle-column">:</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td><strong>Password</strong></td>
              <td className="middle-column">:</td>
              <td>Buraya Password gelecek</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>{user.createdTime.date} / {user.createdTime.hour}</td>
            </tr>
            <tr>
              <td><strong>Created By</strong></td>
              <td className="middle-column">:</td>
              <td>{user.createdBy}</td>
            </tr>
            <tr>
              <td><strong>Desk</strong></td>
              <td className="middle-column">:</td>
              <td>{user.desk}</td>
            </tr>
            <tr>
              <td><strong>Queue</strong></td>
              <td className="middle-column">:</td>
              <td>{user.queue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
