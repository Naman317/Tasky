import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import './Assign.css';

const Assign = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState({ task: '', priority: 'Low', assignedUser: '' }); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedPriority, setSelectedPriority] = useState('Low'); 
  const [selectedStatus, setSelectedStatus] = useState('All'); 
  const [editingTask, setEditingTask] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [userSearchResults, setUserSearchResults] = useState([]); 
  const [assignedUser, setAssignedUser] = useState(''); 
  const username = localStorage.getItem('username'); 

  
  useEffect(() => {
    fetchTasks();
  }, []);

 
  const fetchTasks = async (search = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks/assigned', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
      });
      setTasks(response.data); 
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      alert('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
    if (name === 'priority') {
      setSelectedPriority(value);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.task.trim()) {
      alert('Task description is required.');
      return;
    }

    if (!assignedUser) {
      alert('Please specify a username to assign the task to.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login first.');
        return;
      }

      const response = await axios.post(
        '/api/tasks',
        {
          task: newTask.task,
          priority: newTask.priority,
          assignedUser: assignedUser,
          isAssignedByAdmin: true, 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewTask({ task: '', priority: selectedPriority, assignedUser:' ' });
      fetchTasks(); 
      alert('Task created and assigned successfully!');
    } catch (error) {
      console.error('Failed to create task:', error.response?.data || error.message);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== id)); 
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error.response?.data || error.message);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ task: task.task, priority: task.priority, assignedUser: task.assignedUser });
    setSelectedPriority(task.priority);
  };
const handleUpdateTask = async () => {
  if (!editingTask) return;

  try {
    const token = localStorage.getItem('token');

    const updatedTaskData = {
      task: newTask.task,
      priority: newTask.priority,
      assignedUser: newTask.assignedUser
    };
    

    console.log('Updated Task Data:', updatedTaskData);  

    const response = await axios.put(
      `/api/tasks/${editingTask._id}`,
      updatedTaskData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingTask(null);
    setNewTask({ task: '', priority: selectedPriority, assignedUser: '' });
    fetchTasks(); 
    alert('Task updated successfully!');
  } catch (error) {
    console.error('Failed to update task:', error.response?.data || error.message);
    alert('Failed to update task. Please try again.');
  }
};




  const handleAssignedUserChange = async (e) => {
    const { value } = e.target;
    setAssignedUser(value);

    if (value.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: value },
        });
        setUserSearchResults(response.data); 
      } catch (error) {
        console.error('Error searching for users:', error);
      }
    } else {
      setUserSearchResults([]); 
    }
  };

  const handleUserSelect = (user) => {
    setAssignedUser(user._id); 
  };

  const handleToggleComplete = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error.response?.data || error.message);
    }
  };

  const handleSearch = () => {
    fetchTasks(searchTerm);
  };

  const filteredTasks = tasks.filter(task => {
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm = task.task.toLowerCase().includes(term) || task.priority.toLowerCase() === term;
    const matchesStatus = selectedStatus === 'All' || (selectedStatus === 'Completed' && task.completed) || (selectedStatus === 'Pending' && !task.completed);
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div className="todo">
      <aside className="sidebar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">To-Do Tasks</Link>
      </aside>
      <main>
        <h1>Assigned Task</h1>
        <section className="search-tasks">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </section>

        <section className="task-form">
          <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
          <input
            type="text"
            name="task"
            placeholder="Task"
            value={newTask.task}
            onChange={handleChange}
          />
          <input
            type="text"
            name="assignedUser"
            placeholder="Assign to username"
            value={assignedUser}
            onChange={handleAssignedUserChange}
          />
          {userSearchResults.length > 0 && (
            <ul>
              {userSearchResults.map((user) => (
                <li key={user._id} onClick={() => handleUserSelect(user)}>
                  <p>{user.name}</p>
                </li>
              ))}
            </ul>
          )}

          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button onClick={editingTask ? handleUpdateTask : handleCreateTask}>
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </section>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <section className="tasks-list">
          <h2>All Tasks</h2>
          <ul>
            {filteredTasks.map(task => (
              <li key={task._id}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => handleToggleComplete(task)} 
                />
                <p>{task.task}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>

                             <p>Assigned to: {task.assignedUser ? task.assignedUser.name : 'Unassigned'}</p>


                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
 
        )}
      </main>
    </div>
  );
};

export default Assign;
