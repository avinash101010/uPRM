import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/api/roles/', { withCredentials: true });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Add a new role
  const handleAddRole = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/accounts/api/roles/',
        { name: newRole },
        { withCredentials: true }
      );
      setNewRole('');
      fetchRoles(); // Refresh role list
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  // Delete a role
  const handleDeleteRole = async (roleId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/accounts/api/roles/${roleId}/`, { withCredentials: true });
      fetchRoles(); // Refresh role list
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h2>Manage Roles</h2>
      <input
        type="text"
        placeholder="New Role"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
      />
      <button onClick={handleAddRole}>Add Role</button>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            {role.name} <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;
