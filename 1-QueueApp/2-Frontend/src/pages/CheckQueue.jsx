import customersService from "../services/customersService";
import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { calculateAverageWaitingTime } from '../utils/customersHelper';
import { filterByDate } from '../utils/statisticsHelper';
import Button from '../components/Button';

const CheckQueue = ({ customers, setCustomers }) => {
  const [id, setId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = () => {
      customersService
        .getAll()
        .then((customers) => {
          setCustomers(customers);
          const customer = customers.find(
            (customer) => customer.customer_id === id
          );
          setSelectedCustomer(customer || null);
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
          setCustomers([]);
        });
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [id, setCustomers]);

  if (!Array.isArray(customers)) {
    console.error("Customers is not an array:", customers);
    return <p>Error: Invalid customers data.</p>;
  }

  const customCustomers = filterByDate(customers, 'custom', startDate, endDate);
  const averageWaitingTime = calculateAverageWaitingTime(customCustomers);

  const handleLeaveQueue = () => {
    if (selectedCustomer) {
      customersService
        .leaveQueue(selectedCustomer.customer_id)
        .then((response) => {
          setNotification("You have successfully left the queue.");
          setSelectedCustomer(null);
          setTimeout(() => setNotification(""), 5000);
        })
        .catch((error) => {
          console.error("Error leaving the queue:", error);
          setNotification("An error occurred while leaving the queue.");
          setTimeout(() => setNotification(""), 5000);
        });
    }
  };

  return (
    <div className="page-container">
      <h1>Welcome</h1>
      <div>
        <label htmlFor="customer-id">Enter Customer ID:</label>
        <input
          id="customer-id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Customer ID"
        />
        <button onClick={() => setSelectedCustomer(null)}>Search</button>
      </div>

      {selectedCustomer ? (
        <div>
          <h2>Customer Details</h2>
          <p>
            <strong>Id:</strong> {selectedCustomer.customer_id || "N/A"}
          </p>
          <p>
            <strong>Your position in the queue:</strong>{" "}
            {selectedCustomer.status === "done"
              ? "Done"
              : selectedCustomer.waiting_before_me + 1}
          </p>
          <p>
            <strong>Attached Desk:</strong>{" "}
            {selectedCustomer.attached_queue?.attached_desk || "N/A"}
          </p>
          <p>
            <strong>Attached Queue:</strong>{" "}
            {selectedCustomer.attached_queue?.queue_name || "N/A"}
          </p>
          <p>
            <strong>Your Status:</strong>{" "}
            {selectedCustomer.status}
          </p>
          <p>
            <strong>Average Waiting Time :</strong> {averageWaitingTime.toFixed(2)} minutes
          </p>
          <p>
            <strong>Number of people waiting before me:</strong>{" "}
            {selectedCustomer.waiting_before_me || 0}
          </p>
          <p>
            {selectedCustomer.waiting_before_me <= 2 &&
            selectedCustomer.status !== "done" ? (
              <Notification
                message={`Lütfen ${selectedCustomer.attached_queue?.attached_desk} numaralı masa önüne gidiniz`}
              />
            ) : (
              ""
            )}
          </p>
          <Button text="Leave Queue" onClick={handleLeaveQueue} />
        </div>
      ) : (
        id && <p>No customer found with ID: {id}</p>
      )}
      {notification && <Notification message={notification} />}
    </div>
  );
};

export default CheckQueue;
