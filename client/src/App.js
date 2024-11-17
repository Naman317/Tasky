import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Note from './pages/Notes';
import ToDo  from './pages/ToDo';
import Assign from './pages/Assign';
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
     <Route path='/dashboard' element={<Dashboard/>}/>
     <Route path='/notes' element={<Note/>}/>
     <Route path='/tasks' element={<ToDo/>}/>
    <Route path="/assign" element={<Assign />} />
    

      </Routes>
      <grade/>
    </div>
  );
}

export default App;
