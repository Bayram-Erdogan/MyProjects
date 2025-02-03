import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import queuesService from "../services/queuesService";
import desksService from "../services/desksService";
import Notification from "../components/Notification";

const Queues = ({ queues, setQueues }) => {
  const [queueName, setQueueName] = useState("");
  const [deskNumber, setDeskNumber] = useState("");
  const [maxOfCustomer, setMaxOfCustomer] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [desks, setDesks] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState("");

  useEffect(() => {
    queuesService.getAll().then((initialQueues) => {
      setQueues(initialQueues);
    });

    desksService.getAll().then((initialDesks) => {
      setDesks(initialDesks);
    });
  }, [setQueues]);

  const addQueue = (event) => {
    event.preventDefault();

    const queueObject = {
      queue_name: queueName,
      desk_number: selectedDesk,
      max_of_customer: maxOfCustomer,
    };

    queuesService
      .create(queueObject)
      .then((returnedQueue) => {
        setQueues(queues.concat(returnedQueue));
        setQueueName("");
        setDeskNumber("");
        setMaxOfCustomer("");
        setSelectedDesk("");
        setSuccessMessage("Queue added successfully");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
  };

  return (
    <div className="page-container">
      <div className="page-con">
        <div className="left">
          <div className="left-container">
            <h2>Add new queue</h2>
            <form onSubmit={addQueue}>
              <Input
                type={"text"}
                placeholder={"Queue name"}
                name={"queue_name"}
                value={queueName}
                onChange={({ target }) => setQueueName(target.value)}
              />

              <div>
                <select className="select"
                  value={selectedDesk || ""}
                  onChange={({ target }) => setSelectedDesk(target.value)}
                >
                  <option value="" disabled>
                    Select a desk
                  </option>
                  {desks
                    .filter((desk) => desk.status === "Nonactive")
                    .map((desk) => (
                      <option key={desk.desk_id} value={desk.desk_number}>
                        {desk.desk_number}
                      </option>
                    ))}
                </select>
              </div>

              <Input
                type={"text"}
                placeholder={"Max of customer"}
                name={"max_of_customer"}
                value={maxOfCustomer}
                onChange={({ target }) => setMaxOfCustomer(target.value)}
              />

              <Button text={"Create new queue"} />
            </form>
            <Notification message={successMessage} />
          </div>
        </div>
        <div className="right">
          <div className="container box">
            <h2>All Queues</h2>
            <div className="cards-row">
              {queues.map((queue) => (
                <Card
                  key={queue.queue_id}
                  cardType="Queue"
                  queue={queue}
                  image={queue.qr_code}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queues;
