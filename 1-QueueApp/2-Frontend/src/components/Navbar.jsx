import { Link } from 'react-router-dom'


export const Navbar = () => {
    const padding = {
        padding: 5
      }
    return (
        <div>
            <Link style={padding} to="/">Home</Link>
            <Link style={padding} to="/signIn">Sign in</Link>
        </div>
    )
}

export const AdminNavbar = () => {
    const padding = {
        padding: 5
      }
    return (
        <div>
            <Link style={padding} to="/">Home</Link>
            <Link style={padding} to="/admin">Admin</Link>
            <Link style={padding} to="/admin/users">Users</Link>
            <Link style={padding} to="/admin/desks">Desks</Link>
            <Link style={padding} to="/admin/queues">Queues</Link>
            <Link style={padding} to="/admin/queues/actives">Active Queues</Link>
            <Link style={padding} to="/admin/customers">Customers</Link>
            <Link style={padding} to="/admin/statistics">Statistics</Link>
        </div>
    )
}
