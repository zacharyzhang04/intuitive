import React from 'react';
import { Link } from 'react-router-dom';

// self explanatory; navigation bar
const Navbar = ({ authenticatedUser, onLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
            <Link to='/findprocedure'>Existing Procedures</Link>
        </li>
        <li>
            <Link to='/createprocedure'>Create New Procedures</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        {authenticatedUser ? (
          <li>
            <Link to="/">Logout Page</Link>
          </li>
        ) : (
          <li>
            <Link to="/">Login / Sign in Page</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
