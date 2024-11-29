import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the RBAC System</h1>
      <p  >Manage roles and resources seamlessly.</p>
      <div className="home-buttons">
        <Link to="/login" className="home-link">Login</Link>
        <Link to="/register" className="home-link">Register</Link>
      </div>
    </div>
  );
};

export default Home;
