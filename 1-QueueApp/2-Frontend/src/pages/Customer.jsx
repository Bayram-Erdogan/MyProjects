import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import customersService from "../services/customersService";
import profileImage from "../assets/unisex-profile.jpg";
import { calculateWaitingTime, calculateProcessingTime, calculateDoneTime } from "../utils/customersHelper";

const Customer = ({ customers, setCustomers }) => {
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();
  const customer = customers.find((customer) => customer.customer_id === id);

  useEffect(() => {
    customersService.getAll().then((customers) => setCustomers(customers));
  }, [setCustomers]);

  const updateCustomer = (event) => {
    event.preventDefault();
    const customerObject = { status };

    customersService.update(id, customerObject).then((updatedCustomer) => {
      setCustomers(customers.map((c) => (c.customer_id === id ? updatedCustomer : c)));
      setSuccessMessage("Customer updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    });
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
          <div className="text-align">
            <img src={profileImage} alt="Profile" />
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
              <td>{customer.customer_id}</td>
            </tr>
            <tr>
              <td><strong>Queue</strong></td>
              <td className="middle-column">:</td>
              <td>{customer.attached_queue?.queue_name || "Loading..."}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{customer.status || "Loading..."}</td>
            </tr>
            <tr>
              <td><strong>Joining Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {(() => {
                  if (!customer.joining_time) return "Loading...";
                  const joiningTime = new Date(`${customer.joining_time.date}T${customer.joining_time.hour}:00Z`);
                  return joiningTime.toLocaleString();
                })()}
              </td>
            </tr>
            <tr>
              <td><strong>Waiting Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {calculateWaitingTime(customer.joining_time, customer.process_start_time)}
              </td>
            </tr>
            <tr>
              <td><strong>Processing Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {calculateProcessingTime(customer.process_start_time, customer.done_time)}
              </td>
            </tr>
            <tr>
              <td><strong>Done Time</strong></td>
              <td className="middle-column">:</td>
              <td>
              {calculateDoneTime(customer.done_time)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customer;
