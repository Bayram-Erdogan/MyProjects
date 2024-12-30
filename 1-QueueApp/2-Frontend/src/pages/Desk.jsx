import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Notification from "../components/Notification";
import desksServices from "../services/desksService";

const Desk = () => {
  const [desks, setDesks] = useState([]);
  const [deskNumber, setDeskNumber] = useState("");
  const [user, setUser] = useState("");
  const [queue, setQueue] = useState("");
  const [status, setStatus] = useState("");
  const [totalCustomers, setTotalCustomers] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { id } = useParams();
  const desk = desks.find((desk) => desk.desk_id === id);

  useEffect(() => {
    desksServices
      .getAll()
      .then((desks) => setDesks(desks));
  }, []);

  useEffect(() => {
    if (desk) {
      setDeskNumber(desk?.desk_number || "");
      setUser(desk?.user || "");
      setQueue(desk?.queue || "");
      setStatus(desk?.status || "");
      setTotalCustomers(desk?.totalCustomers || "");
    }
  }, [desk]);

  const updateDesk = (event) => {
    event.preventDefault();
    const deskObject = {
      desk_number: deskNumber,
      user,
      queue,
      status,
      totalCustomers,
    };

    desksServices
      .update(id, deskObject)
      .then((updatedDesk) => {
        setDesks(desks.map((d) => (d.desk_id === id ? updatedDesk : d)));
        setSuccessMessage("Desk updated successfully");
        setTimeout(() => setSuccessMessage(null), 5000);
      });
  };

  if (!desk) {
    return <div>Loading desk data...</div>;
  }

  return (
    <div className="page-container">
      <div className="left">
        <div className="left-container">
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
      </div>
      <div className="right">
        <h1> Desk {desk?.desk_number || "Unknown"} Details</h1>
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
              <td>{desk.createdBy.username || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>User</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.user || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Queue</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.queue || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.status || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Total Customers</strong></td>
              <td className="middle-column">:</td>
              <td>{desk.totalCustomers || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Created Time</strong></td>
              <td className="middle-column">:</td>
              <td>
                {desk.createdTime?.date || "N/A"} / {desk.createdTime?.hour || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Desk;
