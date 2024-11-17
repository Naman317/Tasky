import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ content: '', priority: 'Low' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Low');

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, selectedPriority]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    fetchNotes(); // Fetch notes when search button is clicked
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm, priority: selectedPriority }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNote({ ...newNote, [name]: value });
    if (name === 'priority') {
      setSelectedPriority(value);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.content.trim()) {
      alert('Content is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/notes',
        { content: newNote.content, priority: newNote.priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote({ content: '', priority: selectedPriority });
      fetchNotes();
      alert('Note created successfully!');
    } catch (error) {
      console.error('Failed to create note:', error.response?.data || error.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note._id !== id));
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Failed to delete note:', error.response?.data || error.message);
      alert('Failed to delete note. Please try again.');
    }
  };

  const parseVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.startsWith('create note')) {
      const content = lowerCommand.replace('create note', '').trim();
      if (content) {
        setNewNote({ content, priority: selectedPriority });
        handleCreateNote();
      } else {
        alert('No content detected for the note.');
      }
    } else if (lowerCommand.startsWith('delete note')) {
      const noteSnippet = lowerCommand.replace('delete note', '').trim();
      const noteToDelete = notes.find(note => note.content.toLowerCase().includes(noteSnippet));

      if (noteToDelete) {
        handleDeleteNote(noteToDelete._id);
      } else {
        alert('Note not found for deletion.');
      }
    } else if (lowerCommand.startsWith('search note')) {
      const searchQuery = lowerCommand.replace('search note', '').trim();
      setSearchTerm(searchQuery);
    } else {
      alert('Command not recognized. Please say "create note", "delete note", or "search note".');
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      parseVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else {
        console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
    };

    recognition.start();
  };

  return (
    <div className="notes">
      <aside className="sidebar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/tasks">To-Do Tasks</Link>
      </aside>
      <main>
        <h1>Notes</h1>
        <section className="search-notes">
          <input
            type="text"
            placeholder="Search notes"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchClick}>Search Note</button> {/* Trigger search on click */}
        </section>

        <section className="note-form">
          <h2>Create Note</h2>
          <textarea
            name="content"
            placeholder="Content"
            value={newNote.content}
            onChange={handleChange}
          />
          <select
            name="priority"
            value={newNote.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button onClick={handleCreateNote}>Create Note</button>
        </section>
        <button onClick={startVoiceRecognition}>Voice Command</button>
        <section className="notes-list">
          <h2>All Notes</h2>
          <ul>
            {notes.map(note => (
              <li key={note._id}>
                <p>{note.content}</p>
                <p>Priority: {note.priority}</p>
                <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Notes;
