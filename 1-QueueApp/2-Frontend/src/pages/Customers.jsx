import { useEffect, useState } from "react";
import customersService from "../services/customersService";
import Notification from "../components/Notification";
import { Link, useNavigate  } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [waitingCustomers, setWaitingCustomers] = useState(0);
  const [processingCustomers, setProcessingCustomers] = useState(0);
  const [completedCustomers, setCompletedCustomers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    customersService.getAll().then((data) => {
      setCustomers(data);
      setTotalCustomers(data.length);

      const waitingCount = data.filter((customer) => customer.status === "waiting").length;
      const processingCount = data.filter((customer) => customer.status === "process").length;
      const completedCount = data.filter((customer) => customer.status === "done").length;
      setWaitingCustomers(waitingCount);
      setProcessingCustomers(processingCount);
      setCompletedCustomers(completedCount);
    });
  }, [setCustomers]);

  return (
    <div className="page-container">
      <div className="page-con">
        <div className="left">
          <div className="left-container">
            <h2>Customers Statistics</h2>
            <p>Total Customers : {totalCustomers}</p>
            <p>Waiting Customers : {waitingCustomers}</p>
            <p>Processing Customers : {processingCustomers}</p>
            <p>Completed Customers : {completedCustomers}</p>
          </div>
        </div>

        <div className="right">
          <div className="container box">
            <h2>All Customers</h2>
            <Notification message={successMessage} />
            <table className="active-queues-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Queue Name</th>
                  <th>Attached Desk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  return (
                    <tr
                      key={customer.customer_id}
                      onClick={() => navigate(`/admin/customers/${customer.customer_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{customer.customer_id}</td>
                      <td>{customer.attached_queue?.queue_name}</td>
                      <td>{customer.attached_queue?.attached_desk}</td>
                      <td>{customer.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
