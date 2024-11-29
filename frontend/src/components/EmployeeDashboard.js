import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const EmployeeDashboard = () => {
    // const [projects, setProjects] = useState([]);

    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         const token = localStorage.getItem('access_token');
    //         const response = await axios.get('http://127.0.0.1:8000/accounts/api/projects/', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         setProjects(response.data);
    //     };

    //     fetchProjects();
    // }, 
    // []);
    // const [selectedStatus, setSelectedStatus] = useState({}); // Track selected status for each project
    // const navigate = useNavigate();

    // Fetch projects function
    // const fetchProjects = async () => {
    //     const token = localStorage.getItem('access_token');
    //     const response = await axios.get('http://127.0.0.1:8000/accounts/api/projects/', {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });
    //     setProjects(response.data);
    // };


    // // Handle status change and send it to the backend
    // const handleStatusChange = async (projectId, newStatus) => {
    //     try {
    //         // Make a PATCH request to update the project status
    //         await axios.patch(
    //             `http://127.0.0.1:8000/accounts/api/projects/${projectId}/`,
    //             { status: newStatus },
    //             {
    //                 headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    //             }
    //         );
    //         fetchProjects(); // Refresh the project list after the update
    //     } catch (error) {
    //         console.error('Failed to update status', error);
    //     }
    // };

    // // Handle status selection change for the dropdown
    // const handleDropdownChange = (projectId, newStatus) => {
    //     setSelectedStatus((prevStatus) => ({
    //         ...prevStatus,
    //         [projectId]: newStatus,
    //     }));
    // };

    // useEffect(() => {
    //     fetchProjects();
    // }, []);
    const EmployeeDashboard = () => {
        const [projects, setProjects] = useState([]);
        const [selectedStatus, setSelectedStatus] = useState({});
        const navigate = useNavigate();
    const fetchProjects = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login'); // Redirect to login if no token exists
          return;
        }
        try {
          const response = await axios.get('http://127.0.0.1:8000/accounts/api/projects/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjects(response.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
          navigate('/login'); // Redirect to login on error
        }
      }, [navigate]);
    
      useEffect(() => {
        fetchProjects();
      }, [fetchProjects]);
    
      const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login'); // Redirect to login page
      };
    
      const handleStatusChange = async (projectId, newStatus) => {
        try {
          await axios.patch(
            `http://127.0.0.1:8000/accounts/api/projects/${projectId}/`,
            { status: newStatus },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            }
          );
          fetchProjects(); // Refresh project list
        } catch (error) {
          console.error('Failed to update status', error);
        }
      };
    
      const handleDropdownChange = (projectId, newStatus) => {
        setSelectedStatus((prevStatus) => ({
          ...prevStatus,
          [projectId]: newStatus,
        }));
      };
    return (
      <div >
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">

          <span className="navbar-brand mb-0 h1">Dashboard</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="card shadow-sm p-4 ">
        <h2 className="text-center text-light mb-4">Assigned Projects</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{new Date(project.due_date).toLocaleDateString().replace(/\//g, '-')}</td>
                <td>{project.status}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={selectedStatus[project.id] || project.status}
                      onChange={(e) => handleDropdownChange(project.id, e.target.value)}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        handleStatusChange(project.id, selectedStatus[project.id] || project.status)
                      }
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default EmployeeDashboard;
