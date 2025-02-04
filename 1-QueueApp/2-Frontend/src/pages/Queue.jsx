import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from '../components/Button'
import Input from "../components/Input";
import Notification from "../components/Notification"
import handlePrint from '../utils/printHelper';
import queuesServices from "../services/queuesService";
import customersService from "../services/customersService";
import desksService from "../services/desksService";

const Queue = ({ queues, setQueues }) => {
  const [queueName, setQueueName] = useState('');
  const [deskNumber, setDeskNumber] = useState('');
  const [maxOfCustomer, setMaxOfCustomer] = useState('');
  const [user, setUser] = useState('');
  const [status, setStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const [waitingCustomers, setWaitingCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [desks, setDesks] = useState([]);

  const { id } = useParams();
  const queue = queues.find((queue) => queue.queue_id === id);

  useEffect(() => {
    if (queue) {
      setQueueName(queue.queue_name || '');
      setDeskNumber(queue.attached_desk || '');
      setMaxOfCustomer(queue.max_of_customer || '');
      setUser(queue.user || '');
      setStatus(queue.status || '');

      customersService.getAll().then((data) => {
        const queueCustomers = data.filter((customer) => customer.attached_queue?.queue_id === id);
        setTotalCustomers(queueCustomers.length);
        setWaitingCustomers(queueCustomers.filter((customer) => customer.status === "waiting").length);
        setActiveCustomers(queueCustomers.filter((customer) => customer.status === "process").length);
        setCompletedCustomers(queueCustomers.filter((customer) => customer.status === "done").length);
      });
    }

    desksService.getAll().then((initialDesks) => {
      setDesks(initialDesks);
    });
  }, [queue, id]);

  const updateQueue = (event) => {
    event.preventDefault();
    const queueObject = {
      queue_name: queueName,
      desk_number: deskNumber,
      max_of_customer: maxOfCustomer,
      user: user.id,
      status: status
    };
    queuesServices
      .update(id, queueObject)
      .then(updatedQueue => {
        setQueues(queues.map(q => (q.queue_id === id ? updatedQueue : q)));
        setSuccessMessage('Queue updated successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
      })
  };

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
          <div className="text-align">
            <img src={queue.qr_code} alt="qr_code" className="qr-code" />
            <Button text={"Print"} onClick={() => handlePrint(queue.qr_code)} />
          </div>
          <form onSubmit={updateQueue}>
            <Input
              text={"Queue name : "}
              type={"text"}
              placeholder={"Queue name"}
              name={"queue_name"}
              value={queueName}
              onChange={({ target }) => setQueueName(target.value)}
            />

            <div>
              <select className="select"
                value={deskNumber}
                onChange={({ target }) => setDeskNumber(target.value)}
              >
                <option value="" dis>Select a desk</option>
                {desks
                  .filter(desk => desk.status === "Nonactive")
                  .map(desk => (
                    <option key={desk.desk_id} value={desk.desk_number}>
                      {desk.desk_number}
                    </option>
                  ))}
              </select>
            </div>

            <Input
              text={"Max of customer : "}
              type={"text"}
              placeholder={"Max of customer"}
              name={"max_of_customer"}
              value={maxOfCustomer}
              onChange={({ target }) => setMaxOfCustomer(target.value)}
            />

            <label>Status:</label>
            <select className="select"
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Active">Active</option>
              <option value="Nonactive">Nonactive</option>
            </select>

            <Button text={"Update"} />
          </form>
          <Notification message={successMessage} />
        </div>
      </div>

      <div className="right">
        <div className="section-header">
          <h1>{queue.queue_name} Details</h1>
        </div>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Queue ID</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.queue_id}</td>
            </tr>
            <tr>
              <td><strong>Attached user</strong></td>
              <td className="middle-column">:</td>
              <td>{user? user.name : "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Attached desk</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.attached_desk}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.status}</td>
            </tr>
            <tr>
              <td><strong>Maximum of Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.max_of_customer}</td>
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
              <td><strong>Total Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{totalCustomers}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {queue.createdTime
                  ? `${queue.createdTime.date} / ${queue.createdTime.hour}`
                  : 'N/A'}
              </td>
            </tr>
            <tr>
              <td><strong>Created By</strong></td>
              <td className="middle-column">:</td>
              <td>
                {queue.createdBy ? queue.createdBy.username : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queue;

