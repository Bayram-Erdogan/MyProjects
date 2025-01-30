import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <h2 className="brand">
        <Link to="/"> <span>Queue</span> App</Link>
      </h2>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/customerDesks">Desks</Link>
        <Link to="/customerQueues">Queues</Link>
        <Link to="/checkQueue">Check Queue</Link>
        <Link to="/signIn">Sign in</Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export const AdminNavbar = ({ onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <h2 className="brand">
        <Link to="/admin"> <span>Queue</span> App</Link>
      </h2>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/desks">Desks</Link>
        <Link to="/admin/queues">Queues</Link>
        <Link to="/admin/queues/actives">Active Queues</Link>
        <Link to="/admin/customers">Customers</Link>
        <Link to="/admin/statistics">Statistics</Link>
        <Link to="/" onClick={onSignOut}>Sign out</Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};
