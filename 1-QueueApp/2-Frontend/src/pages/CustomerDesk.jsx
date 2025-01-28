import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import desksServices from "../services/desksService";
import usersService from "../services/usersService";
import customersService from "../services/customersService";

const CustomerDesk = () => {
  const [desks, setDesks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [queueName, setQueueName] = useState("N/A");
  const [waitingCustomers, setWaitingCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);


  const { id } = useParams();
  const desk = desks.find((desk) => desk.desk_id === id);

  useEffect(() => {
    desksServices.getAll().then((desks) => setDesks(desks));
    usersService.getAll().then((users) => setUsers(users));
  }, []);

  useEffect(() => {
    if (desk && users.length > 0) {
      const foundUser = users.find((user) => user.user_id === desk.user);
      setUser(foundUser || "N/A");
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
        });
      } else {
        setQueueName("N/A");
      }
    } else {
      setQueueName("N/A");
    }
  }, [desk]);


  if (!desk) {
    return <div>Loading desk data...</div>;
  }

  return (
    <div className="page-container">
      <div className="right">
        <h1> Desk {desk?.desk_number || "Unknown"}</h1>
        <table className="details-table">
          <tbody>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDesk;
