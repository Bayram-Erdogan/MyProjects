import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import customersService from "../services/customersService";
import profileImage from "../assets/unisex-profile.jpg"

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);


  const { id } = useParams();
  const customer = customers.find((customer) => customer.customer_id === id);

  useEffect(() => {
    customersService
      .getAll()
      .then((customers) => setCustomers(customers));
  }, []);



  const updateCustomer = (event) => {
    event.preventDefault();
    const customerObject = {
      status,
    };

    customersService
      .update(id, customerObject)
      .then((updateCustomer) => {
        setCustomers(customers.map((c) => (c.customer_id === id ? updateCustomer : c)));
        setSuccessMessage("Customer updated successfully");
        setTimeout(() => setSuccessMessage(null), 5000);
      });
  };

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
          <div className="text-align">
              <img src={profileImage}/>
          </div>
          <form onSubmit={updateCustomer}>
            <Input
              text={"Status :"}
              type={"text"}
              placeholder={"Status"}
              name={"status"}
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            />
            <Button text={"Update"} />
          </form>
          <Notification message={successMessage} />
        </div>
      </div>
      <div className="right">
        <h1>Customer Details</h1>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Customer ID</strong></td>
              <td className="middle-column">:</td>
              <td>{customer ? customer.customer_id : "Loading..."}</td>
            </tr>
            <tr>
              <td><strong>Queue</strong></td>
              <td className="middle-column">:</td>
              <td>{customer ? customer.attached_queue.queue_name : "Loading..."}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{customer ? customer.status : "Loading..."}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>{customer ? `${customer.joining_time.date} - ${customer.joining_time.hour}` : "Loading..."}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customer;
