import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Notification from "../components/Notification";
import queuesServices from "../services/queuesService";
import customersService from "../services/customersService";

const CustomerQueue = () => {
  const [queueName, setQueueName] = useState("N/A");
  const [deskNumber, setDeskNumber] = useState("N/A");
  const [maxOfCustomer, setMaxOfCustomer] = useState("N/A");
  const [user, setUser] = useState("N/A");
  const [status, setStatus] = useState("");
  const [waitingCustomers, setWaitingCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();
  const [queue, setQueue] = useState(null);

  useEffect(() => {
    // Fetch all queues and filter by id
    queuesServices.getAll().then((queues) => {
      const queueData = queues.find((queue) => queue.queue_id === id);
      if (queueData) {
        setQueue(queueData);
        setQueueName(queueData.queue_name || "N/A");
        setDeskNumber(queueData.attached_desk || "N/A");
        setMaxOfCustomer(queueData.max_of_customer || "N/A");
        setUser(queueData.user || "N/A");
        setStatus(queueData.status || "N/A");

        // Fetch customers for the queue
        customersService.getAll().then((data) => {
          const queueCustomers = data.filter((customer) => customer.attached_queue?.queue_id === id);
          setTotalCustomers(queueCustomers.length);
          setWaitingCustomers(queueCustomers.filter((customer) => customer.status === "waiting").length);
          setActiveCustomers(queueCustomers.filter((customer) => customer.status === "process").length);
          setCompletedCustomers(queueCustomers.filter((customer) => customer.status === "done").length);
        });
      }
    }).catch(error => {
      console.error("Failed to load queues:", error);
    });
  }, [id]);

  if (!queue) {
    return <div>Loading queue data...</div>;
  }

  return (
    <div className="page-container">
      <div className="right">
        <h1>Queue {queue.queue_name || "Unknown"}</h1>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Queue Name</strong></td>
              <td className="middle-column">:</td>
              <td>{queueName}</td>
            </tr>
            <tr>
              <td><strong>Attached Desk</strong></td>
              <td className="middle-column">:</td>
              <td>{deskNumber}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{status}</td>
            </tr>
            <tr>
              <td><strong>Max Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{maxOfCustomer}</td>
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
        {successMessage && <Notification message={successMessage} />}
      </div>
    </div>
  );
};

export default CustomerQueue;
