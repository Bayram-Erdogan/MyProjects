import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import customersService from "../services/customersService";
import Notification from "../components/Notification";

const Customers = ({ customers, setCustomers }) => {
  const [searchParams] = useSearchParams();
  const queue_id = searchParams.get("queue_id");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {   // From ChatGPT
    if (queue_id) {
      const customerObject = { queue_id };

      customersService
        .create(customerObject)
        .then((returnedCustomer) => {
          if (!returnedCustomer || !returnedCustomer.customer_id) {
            setSuccessMessage("Failed to join the queue.");
            return;
          }

          setCustomers((prevCustomers) => [...prevCustomers, returnedCustomer]);
          setSuccessMessage("Successfully joined the queue!");
          setTimeout(() => setSuccessMessage(null), 5000);
        })
        .catch((error) => {
          console.error("Error while joining the queue:", error);
          setSuccessMessage("Error: Could not join the queue.");
        });
    }
  }, [queue_id, setCustomers]);

  return (
    <div>
      <h1>Customers</h1>
      <Notification message={successMessage} />
      <ul>
        {customers.map((customer) => (
          <li key={customer.queue_id}>
            Queue Name: {customer.queue_name} - Attached Desk: {customer.attached_desk}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;

