import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import desksServices from "../services/desksService";

const Desk = ({ desks, setDesks }) => {
  const [deskNumber, setDeskNumber] = useState("");
  const [createdTime, setCreatedTime] = useState({ date: "", hour: "" });
  const [createdBy, setCreatedBy] = useState("");
  const [user, setUser] = useState("");
  const [queue, setQueue] = useState("");
  const [status, setStatus] = useState("");
  const [totalCustomers, setTotalCustomers] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();
  const desk = desks.find((desk) => desk.desk_id === id);

  useEffect(() => {
    if (desk) {
      setDeskNumber(desk.desk_number || "");
      setCreatedTime(desk.createdTime || { date: "", hour: "" });
      setCreatedBy(desk.createdBy || "");
      setUser(desk.user || "");
      setQueue(desk.queue || "");
      setStatus(desk.status || "");
      setTotalCustomers(desk.totalCustomers || "");
    }
  }, [desk]);

  const updateDesk = (event) => {
    event.preventDefault();
    const updatedDesk = {
      desk_number: deskNumber,
      createdTime,
      createdBy,
      user,
      queue,
      status,
      totalCustomers,
    };

    desksServices.update(id, updatedDesk).then((updatedDesk) => {
      setDesks(desks.map((d) => (d.desk_id === id ? updatedDesk : d)));
      setSuccessMessage("Desk updated successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
    });
  };

  return (
    <div className="page-container">
      <div className="left">
        <form onSubmit={updateDesk}>
          <Input
            text={"Desk Number :"}
            type={"text"}
            placeholder={"Desk Number"}
            name={"desk_number"}
            value={deskNumber}
            onChange={({ target }) => setDeskNumber(target.value)}
          />
          <Input
            text={"Created Time (Date) :"}
            type={"text"}
            placeholder={"Created Date"}
            name={"created_date"}
            value={createdTime.date}
            onChange={({ target }) =>
              setCreatedTime({ ...createdTime, date: target.value })
            }
          />
          <Input
            text={"Created Time (Hour) :"}
            type={"text"}
            placeholder={"Created Hour"}
            name={"created_hour"}
            value={createdTime.hour}
            onChange={({ target }) =>
              setCreatedTime({ ...createdTime, hour: target.value })
            }
          />
          <Input
            text={"Created By :"}
            type={"text"}
            placeholder={"Created By"}
            name={"created_by"}
            value={createdBy}
            onChange={({ target }) => setCreatedBy(target.value)}
          />
          <Input
            text={"User :"}
            type={"text"}
            placeholder={"User"}
            name={"user"}
            value={user}
            onChange={({ target }) => setUser(target.value)}
          />
          <Input
            text={"Queue :"}
            type={"text"}
            placeholder={"Queue"}
            name={"queue"}
            value={queue}
            onChange={({ target }) => setQueue(target.value)}
          />
          <Input
            text={"Status :"}
            type={"text"}
            placeholder={"Status"}
            name={"status"}
            value={status}
            onChange={({ target }) => setStatus(target.value)}
          />
          <Input
            text={"Total Customers :"}
            type={"text"}
            placeholder={"Total Customers"}
            name={"total_customers"}
            value={totalCustomers}
            onChange={({ target }) => setTotalCustomers(target.value)}
          />
          <Button text={"Update"} />
        </form>
        <Notification message={successMessage} />
      </div>
      <div className="right">
        <h1> Desk {desk.desk_number} Details</h1>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Desk ID</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.desk_id}</td>
            </tr>
            <tr>
              <td><strong>Created By</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.createdBy}</td>
            </tr>
            <tr>
              <td><strong>User</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.user}</td>
            </tr>
            <tr>
              <td><strong>Queue</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.queue}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.status}</td>
            </tr>
            <tr>
              <td><strong>Total Customers</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.totalCustomers}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {desk.createdTime.date} / {desk.createdTime.hour}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Desk;

