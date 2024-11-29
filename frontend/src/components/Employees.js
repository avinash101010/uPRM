import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const accessToken = localStorage.getItem('access_token'); // Get the stored token
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/accounts/api/employees/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the token here
          },
        });
        setEmployees(response.data.employees); // Assuming `employees` is in the response
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.detail || 'Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, []);

  return (
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Employee List</h2>
        {error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : employees.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No employees found.</p>
        )}
      </div>
  );
};

export default EmployeeList;
