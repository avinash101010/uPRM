import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResourcePage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResourceMessage();
  }, []);

  const fetchResourceMessage = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/api/resource/', {
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

export default ResourcePage;
