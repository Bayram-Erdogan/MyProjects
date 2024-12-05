import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home'
import Admin from '../pages/Admin'
import Users from '../pages/Users'
import Desks from '../pages/Desks'
import Queues from '../pages/Queues'
import Customers from '../pages/Customers'
import Statistics from '../pages/Statistics'
import Login from '../pages/Login'

const Navbar = () => {
    const padding = {
        padding: 5
      }
    return (
    <Router>
        <div>
            <Link style={padding} to="/">Home</Link>
            <Link style={padding} to="/login">Login</Link>
            <Link style={padding} to="/admin">Admin</Link>
            <Link style={padding} to="/admin/users">Users</Link>
            <Link style={padding} to="/admin/desks">Desks</Link>
            <Link style={padding} to="/admin/queues">Queues</Link>
            <Link style={padding} to="/admin/customers">Customers</Link>
            <Link style={padding} to="/admin/statistics">Statistics</Link>
        </div>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/desks" element={<Desks />} />
            <Route path="/admin/queues" element={<Queues />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/statistics" element={<Statistics />} />
        </Routes>
        <div>
            <i>Queue app, 2025</i>
        </div>
    </Router>
    )
}

export default Navbar