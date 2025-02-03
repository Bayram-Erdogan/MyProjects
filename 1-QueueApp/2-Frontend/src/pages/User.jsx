import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import desksServices from "../services/desksService";
import usersServices from "../services/usersService";
import queuesServices from "../services/queuesService";
import profileImage from "../assets/unisex-profile.jpg";

const User = () => {
  const [users, setUsers] = useState([]);
  const [desks, setDesks] = useState([]);
  const [queues, setQueues] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desk, setDesk] = useState("");
  const [queue, setQueue] = useState("");
  const [status, setStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    usersServices
      .getAll()
      .then((users) => setUsers(users));

    desksServices
      .getAll()
      .then((desks) => setDesks(desks));

      queuesServices.getAll().then((queues) => setQueues(queues));
  }, []);

  const user = users.find((user) => String(user.user_id) === id);
  const userDesk = desks.find((desk) => String(desk.user) === String(user?.user_id));
  const attached_queue = user?.queues && user.queues.length > 0
  ? queues.find(queue => queue.queue_id === user.queues[0].queue_id)
  : null; //From ChatGPT


  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPassword("");
      setDesk(userDesk ? userDesk.desk_number : "");
      setQueue(user.queue || "");
    }
  }, [user, userDesk]);



  const updateUser = (event) => {
    event.preventDefault();
    const userObject = {
      name: name,
      email: email,
      password: password,
      desk: desk,
      queue: queue,
      status: status,
    };

    usersServices.update(id, userObject).then((updatedUser) => {
      setUsers(users.map((u) => (u.user_id === id ? updatedUser : u)));
      setSuccessMessage("User updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    });
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
          <div className="text-align">
            <img src={profileImage} alt="User Profile" />
          </div>
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

            <select className="select"
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Free">Free</option>
              <option value="Onwork">Onwork</option>
            </select>
            <Button text={"Update"} />
          </form>
          <Notification message={successMessage} />
        </div>
      </div>

      <div className="right">
        <div className="section-header">
          <h1>{user.name} Details</h1>
        </div>
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
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{user.status}</td>
            </tr>
            <tr>
              <td><strong>Created by</strong></td>
              <td className="middle-column">:</td>
              <td>{user.createdBy.username || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Attached desk</strong></td>
              <td className="middle-column">:</td>
              <td>{userDesk ? userDesk.desk_number : "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Attached queue</strong></td>
              <td className="middle-column">:</td>
              <td>{attached_queue ? attached_queue.queue_name : "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
