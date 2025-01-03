import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, AdminNavbar } from "./components/Navbar";
import Footer from "./components/Footer";
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
import Statistics from "./pages/Statistics";
import SignIn from "./pages/SignIn";
import './css/base.css';

import { Routes, Route } from "react-router-dom";

const App = () => {
  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [customers, setCustomers] = useState([]);


  const navigate = useNavigate();

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
          <Route path="/admin/statistics" element={<Statistics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
