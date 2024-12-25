import { useState, useEffect } from "react";
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
import Statistics from "./pages/Statistics";
import SignIn from "./pages/SignIn";
import './css/base.css';

import userService from '../src/services/usersService';
import desksService from "../src/services/desksService";
import queuesServices from "../src/services/queuesServices";
import customersServices from "../src/services/customersService";

import { Routes, Route } from "react-router-dom";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [desks, setDesks] = useState([]);
  const [queues, setQueues] = useState([]);
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate("/");  // Ana sayfaya yönlendir
  };

  useEffect(() => {
    userService.getAll().then(initialUsers => {
      setUsers(initialUsers);
    });
  }, []);

  useEffect(() => {
    desksService.getAll().then(initialDesks => {
      setDesks(initialDesks);
    });
  }, []);

  useEffect(() => {
    queuesServices.getAll().then(initialQueues => {
      setQueues(initialQueues);
    });
  }, []);

  useEffect(() => {
    customersServices.getAll().then(initialCustomers => {
      setCustomers(initialCustomers);
    });
  }, []);

  return (
    <div className="app-container">
      <header>
        {user ? <AdminNavbar onSignOut={handleSignOut} /> : <Navbar />}
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn setUser={setUser} />} />
          <Route path="/admin" element={<Admin users={users} desks={desks} queues={queues} />} />
          <Route path="/admin/users" element={<Users users={users} setUsers={setUsers} />} />
          <Route path="/admin/users/:id" element={<User users={users} />} />
          <Route path="/admin/desks" element={<Desks desks={desks} setDesks={setDesks} />} />
          <Route path="/admin/desks/:id" element={<Desk desks={desks} />} />
          <Route path="/admin/queues" element={<Queues queues={queues} setQueues={setQueues} />} />
          <Route path="/admin/queues/:id" element={<Queue queues={queues} setQueues={setQueues} />} />
          <Route path="/admin/queues/actives" element={<ActiveQueues />} />
          <Route path="/admin/customers" element={<Customers customers={customers} setCustomers={setCustomers} />} />
          <Route path="/admin/statistics" element={<Statistics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
