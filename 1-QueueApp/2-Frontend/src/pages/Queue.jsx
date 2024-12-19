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
    <div>

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

        <Button style={"btn btn-primary"} text={'Update'}/>
      </form>

      <Notification message={successMessage}/>

      <h1>{queue.queue_name} Details</h1>
      <p><strong>Queue ID :</strong> {queue.queue_id}</p>
      <p><strong>User :</strong> Buraya bagli oldugu user gelecek</p>
      <p><strong>Desk :</strong> {queue.attached_desk}</p>
      <p><strong>Status :</strong> {queue.status}</p>
      <p><strong>Maximum of customer :</strong> {queue.max_of_customer} </p>
      <p><strong>Active customer :</strong> {queue.active_customer} </p>
      <p><strong>Waiting customer :</strong> {queue.waiting_customer} </p>
      <p><strong>Total customer :</strong> {queue.total_customer} </p>
      <p><strong>Created time :</strong> {queue.createdTime.date} / {queue.createdTime.hour}</p>
      <p><strong>Created by:</strong> Buraya olusturan kisi gelecek</p>
      <p><strong>Qr qode :</strong> </p>
      <p><img src={queue.qr_code} alt="qr_code" className="qr-code" /></p>
      <Button style={"btn btn-dark"} text={"Print"} onClick={() => handlePrint(queue.qr_code)} />
    </div>
  );
};

export default Queue;
