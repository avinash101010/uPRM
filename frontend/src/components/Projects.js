import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/accounts/api/projects/', { withCredentials: true });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Add a new project
  const handleAddProject = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/accounts/api/projects/',
        { name: newProject },
        { withCredentials: true }
      );
      setNewProject('');
      fetchProjects(); // Refresh project list
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <input
        type="text"
        placeholder="New Project"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
      />
      <button onClick={handleAddProject}>Add Project</button>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
