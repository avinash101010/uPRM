import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignProject = () => {
    const [employees, setEmployees] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [dueDate, setDueDate]=useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/accounts/api/employees/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data.employees);
        };

        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/accounts/api/projects/',
                {
                    name: projectName,
                    description: description,
                    // employee_id: selectedEmployee,
                    assigned_to: selectedEmployee,
                    due_date: dueDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            alert('Project assigned successfully!');
            setProjectName('');
            setDescription('');
            setSelectedEmployee('');
            setDueDate('');
        } catch (error) {
            console.error(error);
            alert('Failed to assign project.');
        }
    };

    return (
        <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Assign Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="projectName" className="form-label">Project Name</label>
            <input
              type="text"
              id="projectName"
              className="form-control"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="selectedEmployee" className="form-label">Assign To</label>
            <select
              id="selectedEmployee"
              className="form-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.username} value={emp.id}>
                  {emp.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Assign Project</button>
        </form>
      </div>
    </div>
    );
};

export default AssignProject;
