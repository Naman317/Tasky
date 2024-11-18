import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import './ToDo.css';

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ task: '', priority: 'Low' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (search = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCreateTask = async () => {
    if (!newTask.task.trim()) {
      alert('Task is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/tasks',
        { task: newTask.task, priority: newTask.priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask({ task: '', priority: 'Low' });
      fetchTasks();
      alert('Task created successfully!');
    } catch (error) {
      console.error('Failed to create task:', error.response?.data || error.message);
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
    setNewTask({ task: task.task, priority: task.priority });
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/tasks/${editingTask._id}`,
        { task: newTask.task, priority: newTask.priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingTask(null);
      setNewTask({ task: '', priority: 'Low' });
      fetchTasks();
      alert('Task updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error.response?.data || error.message);
      alert('Failed to edit task. Please try again.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error.response?.data || error.message);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    fetchTasks(searchValue);
  };

  const filteredTasks = tasks.filter(task => {
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm = task.task.toLowerCase().includes(term);
    const matchesPriority =
      selectedPriorityFilter === 'All' || task.priority === selectedPriorityFilter;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Completed' && task.completed) ||
      (selectedStatus === 'Pending' && !task.completed);

    return matchesSearchTerm && matchesPriority && matchesStatus;
  });

  return (
    <div className="todo">
      <aside className="sidebar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">To-Do Tasks</Link>
      </aside>
      <main>
        <h1>To-Do Tasks</h1>
        <section className="search-tasks">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
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

                {task.isAssignedByAdmin && <p>Assigned by Admin</p>}

                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default ToDo;
