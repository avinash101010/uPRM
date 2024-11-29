import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import Employees from './Employees';
import AssignProject from './AssignProject';

const ManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);  // Track which project is being edited
  const navigate = useNavigate();
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    due_date: '',
  });
  const [activeTab, setActiveTab] = useState('projects'); // Tracks the active tab


  useEffect(() => {
    const fetchAssignedProjects = async () => {
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
    };

    fetchAssignedProjects();
  }, [navigate]);

  const deleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('access_token');
      // Send DELETE request to backend
      await axios.delete(`http://127.0.0.1:8000/accounts/api/projects/${projectId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the project list after deletion
      setProjects(projects.filter((project) => project.id !== projectId));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Failed to delete project', error);
      alert('Error deleting project');
    }
  };
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  
    // Redirect to the login page
    navigate('/login');
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEditSubmit = async (e, projectId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const updatedData = {
        name: editFormData.name,
        description: editFormData.description,
        due_date: editFormData.due_date,
      };

      // Send PATCH request to update the project
      await axios.patch(`http://127.0.0.1:8000/accounts/api/projects/${projectId}/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the project list after updating
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, ...updatedData } : project
        )
      );
      setEditingProject(null);  // Reset editing state
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Failed to update project', error);
      alert('Error updating project');
    }
  };
  return (
    <div className="bg-dark bg-gradient" style={{
      minHeight: '100vh', // Ensures the background gradient covers the full height
      background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/manager-dashboard">Dashboard</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button
                  className={`nav-link btn ${activeTab === 'projects' ? 'active text-light' : 'text-white'}`}
                  style={{
                    backgroundColor: activeTab === 'projects' ? '#004085' : 'transparent',
                  }}
                  onClick={() => setActiveTab('projects')}
                >
                  Assigned Projects
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn ${activeTab === 'employees' ? 'active text-light' : 'text-white'}`}
                  style={{
                    backgroundColor: activeTab === 'employees' ? '#004085' : 'transparent',
                  }}
                  onClick={() => setActiveTab('employees')}
                >
                  Employees
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn ${activeTab === 'assign' ? 'active text-light' : 'text-white'}`}
                  style={{
                    backgroundColor: activeTab === 'assign' ? '#004085' : 'transparent',
                  }}
                  onClick={() => setActiveTab('assign')}
                >
                  Assign Project
                </button>
              </li>
            </ul>
            <button className="btn  btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4 ">
        {activeTab === 'projects' && (
          <section id="projects-section">
            <h2 className="text-center text-light">Assigned Projects</h2>
            {projects.map((project) => (
              <div className="card mb-3 position-relative" key={project.id}>
                <div className="card-body">
                  <div className="position-absolute top-0 end-0 mt-2 me-2">
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => {
                        setEditingProject(project.id);
                        setEditFormData({
                          name: project.name,
                          description: project.description,
                          due_date: project.due_date,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                  {editingProject === project.id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, project.id)}>
                      <div className="mb-3">
                        <label className="form-label">Project Title</label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          name="due_date"
                          value={editFormData.due_date}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-success me-2">Save Changes</button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingProject(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      <p className="card-text">
                        <strong>Status:</strong> {project.status}
                      </p>
                      <p className="card-text">
                        <strong>Due Date:</strong> {new Date(project.due_date).toLocaleDateString().replace(/\//g, '-')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'employees' && (
          <section id="employees-section">
            {/* <h2 className="text-center text-light">Employees List</h2> */}
              <Employees />
          </section>
        )}

        {activeTab === 'assign' && (
          <section id="assign-project-section">
            {/* <h2 className="text-center">Assign a Project</h2> */}
              <AssignProject />
            
          </section>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
