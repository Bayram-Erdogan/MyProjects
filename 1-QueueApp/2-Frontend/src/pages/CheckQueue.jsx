import customersService from "../services/customersService";
import { useState, useEffect } from "react";
import Notification from "../components/Notification";

const CheckQueue = ({ customers, setCustomers }) => {
  const [id, setId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
            <strong>Id:</strong>{" "}
            {selectedCustomer.customer_id || "N/A"}
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
            <strong>Status:</strong> {selectedCustomer.status || "N/A"}
          </p>
          <p>
            <strong>Number of people waiting before me:</strong>{" "}
            {selectedCustomer.waiting_before_me || 0}
          </p>
          <p>
            {selectedCustomer.waiting_before_me <= 2 ? (
              <Notification
                message={`Lutfen ${selectedCustomer.attached_queue?.attached_desk} numarali masa önune gidiniz`}
              />
            ) : (
              ""
            )}
          </p>
        </div>
      ) : (
        id && <p>No customer found with ID: {id}</p>
      )}
    </div>
  );
};

export default CheckQueue;
