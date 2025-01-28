import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
      <div className='navbar'>
        <h2 className='brand'>
          <Link to="/"> <span>Queue</span> App</Link>
        </h2>
        <div>
          <Link to="/customerDesks">Desks</Link>
          <Link to="/customerQueues">Queues</Link>
          <Link to="/checkQueue">Check Queue</Link>
        </div>
        <Link to="/signIn">Sign in</Link>
      </div>
    );
  };

export const AdminNavbar = ({ onSignOut }) => {
    return (
      <div className='navbar'>
        <h2 className='brand'>
          <Link to="/admin"> <span>Queue</span> App</Link>
        </h2>
        <div>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/desks">Desks</Link>
          <Link to="/admin/queues">Queues</Link>
          <Link to="/admin/queues/actives">Active Queues</Link>
          <Link to="/admin/customers">Customers</Link>
          <Link to="/admin/statistics">Statistics</Link>
        </div>
        <Link to="/" onClick={onSignOut}>Sign out</Link>
      </div>
    );
  };
