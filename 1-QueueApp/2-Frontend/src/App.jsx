import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, AdminNavbar } from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Desks from "./pages/Desks";
import Queues from "./pages/Queues";
import ActiveQueues from "./pages/ActiveQueues";
import Customers from "./pages/Customers";
import Statistics from "./pages/Statistics";
import SignIn from "./pages/SignIn";
import './css/base.css';

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div>
        {user ? <AdminNavbar /> : <Navbar setUser={setUser} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn setUser={setUser} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/desks" element={<Desks />} />
          <Route path="/admin/queues" element={<Queues />} />
          <Route path="/admin/queues/actives" element={<ActiveQueues />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/statistics" element={<Statistics />} />
        </Routes>

        <div>
          <i>Queue app, 2025</i>
        </div>
      </div>
    </Router>
  );
};

export default App;
