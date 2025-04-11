//pages/Logout.jsx
import React from 'react';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const Logout = ({ onClick: closeNavHandler }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // prevent the default navigation
    logout();           // clear token & user
    closeNavHandler?.(); // optional: close mobile nav
    navigate('/login'); // redirect to login
  };

  return (
    <Link to="/login" onClick={handleLogout}>
      Logout
    </Link>
  );
};

export default Logout;
