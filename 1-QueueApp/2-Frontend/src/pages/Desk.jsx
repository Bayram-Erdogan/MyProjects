import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import desksServices from "../services/desksService";
import usersService from "../services/usersService";
import customersService from "../services/customersService";

const Desk = () => {
  const [desks, setDesks] = useState([]);
  const [users, setUsers] = useState([]);
  const [deskNumber, setDeskNumber] = useState("");
  const [user, setUser] = useState(null);
  const [queueName, setQueueName] = useState("N/A");
  const [status, setStatus] = useState("");
  const [waitingCustomers, setWaitingCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { id } = useParams();
  const desk = desks.find((desk) => desk.desk_id === id);

  useEffect(() => {
    desksServices.getAll().then((desks) => setDesks(desks));
    usersService.getAll().then((users) => setUsers(users));
  }, []);

  useEffect(() => {
    if (desk && users.length > 0) {
      const foundUser = users.find((user) => user.user_id === desk.user);
      setUser(foundUser || null);
    }
  }, [desk, users]);

  useEffect(() => {
    if (desk && Array.isArray(desk.queues)) {
      const queueId = desk.queues[0]?.queue_id;
      const foundQueue = desk.queues.find((q) => q.queue_id === queueId);

      if (foundQueue) {
        setQueueName(foundQueue.queue_name);
        customersService.getAll().then((data) => {
          const queueCustomers = data.filter(
            (customer) => customer.attached_queue?.queue_id === queueId
          );
          setTotalCustomers(queueCustomers.length);
          setWaitingCustomers(
            queueCustomers.filter((customer) => customer.status === "waiting")
              .length
          );
          setActiveCustomers(
            queueCustomers.filter((customer) => customer.status === "process")
              .length
          );
          setCompletedCustomers(
            queueCustomers.filter((customer) => customer.status === "done")
              .length
          );
        });
      } else {
        setQueueName("N/A");
      }
    } else {
      setQueueName("N/A");
    }
  }, [desk]);

  const updateDesk = async (event) => {
    event.preventDefault();

    const selectedUser = users.find((u) => u.user_id === selectedUserId);

    const deskObject = {
      desk_number: deskNumber,
      status: status,
      userId: selectedUser ? selectedUser.user_id : null,
    };

    try {
      await desksServices.update(id, deskObject);

      const updatedDesks = await desksServices.getAll();
      setDesks(updatedDesks);

      setUser(selectedUser);

      setSuccessMessage("Desk updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error updating desk:", error);
    }
  };


  if (!desk) {
    return <div>Loading desk data...</div>;
  }

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
          <form onSubmit={updateDesk}>
            <Input
              text={"Desk Number:"}
              type={"text"}
              placeholder={"Desk Number"}
              name={"desk_number"}
              value={deskNumber}
              onChange={({ target }) => setDeskNumber(target.value)}
            />
            <select
              className="select"
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Active">Active</option>
              <option value="Nonactive">Nonactive</option>
            </select>

            <select
              className="select"
              value={selectedUserId}
              onChange={({ target }) => setSelectedUserId(target.value)}
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

            <Button text={"Update"} />
          </form>
          <Notification message={successMessage} />
        </div>
      </div>

      <div className="right">
        <div className="section-header">
          <h1> Desk {desk?.desk_number || "Unknown"} Details</h1>
        </div>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Desk ID</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.desk_id}</td>
            </tr>
            <tr>
              <td><strong>Created By</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.createdBy.username || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Attached user</strong></td>
              <td className="middle-column">:</td>
              <td>{user ? user.name : "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Attached queue</strong></td>
              <td className="middle-column">:</td>
              <td>{queueName}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.status || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Active Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{activeCustomers}</td>
            </tr>
            <tr>
              <td><strong>Waiting Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{waitingCustomers}</td>
            </tr>
            <tr>
              <td><strong>Completed Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{completedCustomers}</td>
            </tr>
            <tr>
              <td><strong>Total Customers</strong></td>
              <td className="middle-column">:</td>
              <td>{totalCustomers}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {desk.createdTime?.date || "N/A"} / {desk.createdTime?.hour || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Desk;
