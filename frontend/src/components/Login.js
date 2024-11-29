import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import '../css/Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Fetch user info to determine role
      const userInfoResponse = await axios.get('http://127.0.0.1:8000/accounts/api/user-info/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const { role } = userInfoResponse.data;
      console.log('Role:', role);

      // Navigate based on role
      if (role === 'Admin') {
        navigate('/register');
      } else if (role === 'Manager') {
        navigate('/manager-dashboard');
      } else if (role === 'Employee') {
        navigate('/employee-dashboard');
      } else {
        alert('Unknown role: Cannot determine dashboard.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
    <div className="card p-4 shadow-sm" style={{ width: '24rem' }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="text-center mt-3">
        <small>Don't have an account? <a href="/register">Register here</a>.</small>
      </div>
    </div>
  </div>
  );
};

export default Login;
