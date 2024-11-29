import React, { useEffect, useState } from 'react';
import API from '../api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get('/tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks/', { name: newTask, project_id: projectId });
      setNewTask('');
      alert('Task added successfully!');
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Error adding task');
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name} (Project: {task.project.name})
          </li>
        ))}
      </ul>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default Tasks;
