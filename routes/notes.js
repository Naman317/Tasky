const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/authmiddleware');

//Route to create a new note
router.post('/', auth, async (req, res) => {
  const { content, priority, tags } = req.body; // Include tags

  try {
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newNote = new Note({
      content,
      priority,
      tags: tags || [], // Ensure tags are included
      user: req.user.id,
    });

    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  const { content, priority, tags } = req.body; // Include tags

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    note.content = content || note.content;
    note.priority = priority || note.priority;
    note.tags = tags || note.tags; // Update tags if provided

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const searchTerm = req.query.search || '';

    const notes = await Note.find({
      content: { $regex: searchTerm, $options: 'i' },
      user: req.user.id
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
});
// Route to delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the note belongs to the user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Use findByIdAndDelete instead of remove
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Error deleting note:', error.message); // Improved logging
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
});



module.exports = router;
