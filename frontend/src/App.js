import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ResourcePage from './components/ResourcePage';
import Roles from './components/Roles';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Employees from './components/Employees';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Home from './components/Home';
// import Hello from './components/Hello';

// for cros origin error
import axios from 'axios';
axios.defaults.withCredentials = true;


function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/resource" element={<ResourcePage />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        {/* <Route path="/hello" element={<Hello/>} />   */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/>


      </Routes>
    </Router>
  );
}

export default App;
