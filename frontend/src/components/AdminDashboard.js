import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'Admin') {
        navigate('/resource'); // Redirect if the user is not an Admin
      }
      fetchAdminMessage();
    }
  }, [navigate]);

  const fetchAdminMessage = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/api/admin-only/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Failed to fetch message:', error);
    }
  };

  return <div>{message}</div>;
};

export default AdminDashboard;
