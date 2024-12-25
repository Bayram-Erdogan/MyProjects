import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from '../components/Button'
import Input from "../components/Input";
import Notification from "../components/Notification"
import handlePrint  from '../utils/printHelper';
import queuesServices from "../services/queuesServices"

const Queue = ({ queues, setQueues }) => {
  const [queueName, setQueueName] = useState('')
  const [deskNumber, setDeskNumber] = useState('')
  const [maxOfCustomer, setMaxOfCustomer] = useState('')
  const [user, setUser] = useState('')
  const [status, setStatus] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  const { id } = useParams();
  const queue = queues.find((queue) => queue.queue_id === id);

  useEffect(() => {
    if (queue) {
      setQueueName(queue.queue_name || '');
      setDeskNumber(queue.attached_desk || '');
      setMaxOfCustomer(queue.max_of_customer || '');
      setUser(queue.user || '');
      setStatus(queue.status || '');
    }
  }, [queue]);


  const updateQueue = (event) => {
    event.preventDefault();
    const queueObject = {
      queue_name: queueName,
      desk_number: deskNumber,
      max_of_customer: maxOfCustomer,
      user: user,
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
              type = {"text"}
              placeholder = {"Queue name"}
              name = {"queue_name"}
              value={queueName}
              onChange={({target}) => setQueueName(target.value)}

            />

            <Input
              text={"Desk number : "}
              type = {"text"}
              placeholder = {"Desk number"}
              name = {"desk_number"}
              value={deskNumber}
              onChange={({target}) => setDeskNumber(target.value)}
            />

            <Input
              text={"Max of customer : "}
              type = {"text"}
              placeholder = {"Max of customer"}
              name = {"max_of_customer"}
              value={maxOfCustomer}
              onChange={({target}) => setMaxOfCustomer(target.value)}
            />

            <Input
              text={"User : "}
              type = {"text"}
              placeholder = {"User"}
              name = {"user"}
              value={user}
              onChange={({target}) => setUser(target.value)}
            />

            <Input
              text={"Status : "}
              type = {"text"}
              placeholder = {"Status"}
              name = {"status"}
              value={status}
              onChange={({target}) => setStatus(target.value)}
            />

            <Button text={'Update'}/>
          </form>
          <Notification message={successMessage}/>
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
              <td><strong>User</strong></td>
              <td className="middle-column">:</td>
              <td>Buraya bağlı olduğu user gelecek</td>
            </tr>
            <tr>
              <td><strong>Desk</strong></td>
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
              <td>{queue.active_customer}</td>
            </tr>
            <tr>
              <td><strong>Waiting Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.waiting_customer}</td>
            </tr>
            <tr>
              <td><strong>Total Customer</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.total_customer}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>{queue.createdTime.date} / {queue.createdTime.hour}</td>
            </tr>
            <tr>
              <td><strong>Created By</strong></td>
              <td className="middle-column">:</td>
              <td>Buraya oluşturan kişi gelecek</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queue;
