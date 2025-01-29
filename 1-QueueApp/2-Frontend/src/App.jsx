import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import './css/base.css';
//import './css/denemeBase.css';
import { Navbar, AdminNavbar } from "./components/Navbar";
import Footer from "./components/Footer";
import queuesService from "../src/services/queuesService"
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import User from "./pages/User";
import Desks from "./pages/Desks";
import Desk from "./pages/Desk";
import Queues from "./pages/Queues";
import Queue from "./pages/Queue";
import ActiveQueues from "./pages/ActiveQueues";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import CustomerDesks from "./pages/CustomerDesks";
import CustomerDesk from "./pages/CustomerDesk";
import CustomerQueues from "./pages/CustomerQueues";
import CustomerQueue from "./pages/CustomerQueue";
import Statistics from "./pages/Statistics";
import CheckQueue from "./pages/CheckQueue";
import SignIn from "./pages/SignIn";


const App = () => {
  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    queuesService.getAll().then(initialQueues => {
      setQueues(initialQueues);
    });
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app-container">
      <header>
        {user ? <AdminNavbar onSignOut={handleSignOut} /> : <Navbar />}
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkQueue" element = {<CheckQueue customers={customers} setCustomers={setCustomers} />} />
          <Route path="/customerDesks" element = {<CustomerDesks/>} />
          <Route path="/customerDesks/:id" element={<CustomerDesk customers={customers} setCustomers={setCustomers} />} />
          <Route path="/customerQueues" element = {<CustomerQueues/>} />
          <Route path="/customerQueues/:id" element={<CustomerQueue customers={customers} setCustomers={setCustomers} />} />
          <Route path="/signIn" element={<SignIn setUser={setUser} />} />
          <Route path="/admin" element={<Admin  queues={queues} />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<User />} />
          <Route path="/admin/desks" element={<Desks />} />
          <Route path="/admin/desks/:id" element={<Desk />} />
          <Route path="/admin/queues" element={<Queues queues={queues} setQueues={setQueues} />} />
          <Route path="/admin/queues/:id" element={<Queue queues={queues} setQueues={setQueues} />} />
          <Route path="/admin/customers" element={<Customers customers={customers} setCustomers={setCustomers} />} />
          <Route path="/admin/customers/:id" element={<Customer customers={customers} setCustomers={setCustomers} />} />
          <Route path="/admin/queues/actives" element={<ActiveQueues customers={customers} />} />
          <Route path="/admin/statistics" element={<Statistics queues={queues} setQueues={setQueues}/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
