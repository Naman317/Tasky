import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [userInfo, setUserInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, notesResponse, tasksResponse] = await Promise.all([
          axios.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/notes', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUserInfo(userResponse.data);
        setNotes(notesResponse.data);
        setTasks(tasksResponse.data);

       
        const completed = tasksResponse.data.filter(task => task.completed);
        const pending = tasksResponse.data.filter(task => !task.completed);

        setCompletedTasks(completed);
        setPendingTasks(pending);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">To-Do Tasks</Link>
        {userInfo?.role === 'admin' && (
          <Link to="/Assign">Task Analytics</Link>
        )}
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main>
        <h1>Welcome, {userInfo.name}</h1>

        <section className="notes-summary">
          <h2>Notes Summary</h2>
          <p>Total Notes: {notes.length}</p>
          <p>Total Tasks: {tasks.length}</p>

              <h3>Task Completion Analysis</h3>
              <p>Completed Tasks: {completedTasks.length}</p>
              <p>Pending Tasks: {pendingTasks.length}</p>
            
       
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
