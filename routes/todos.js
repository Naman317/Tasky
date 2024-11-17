const express = require('express');
const router = express.Router();
const ToDo = require('../models/ToDo');
const auth = require('../middleware/authmiddleware');
// GET all tasks with optional search
// router.get('/', auth, async (req, res) => {
//   try {
//     const search = req.query.search || '';
//     const tasks = await ToDo.find({
//       user: req.user._id,
//       task: { $regex: search, $options: 'i' },
//     }).populate('assignedUser', 'name'); // Populate only the 'name' field from User

//     res.json(tasks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });



// tasks route
router.get('/', auth, async (req, res) => {
   try {
    const searchQuery = req.query.search || '';
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    let tasks;
    if (isAdmin) {
      tasks = await ToDo.find({
        user: userId,
        isAssignedByAdmin: false,
        task: { $regex: searchQuery, $options: 'i' }
      });
    } else {
      tasks = await ToDo.find({
        $or: [
          { user: userId },
          { assignedUser: userId, isAssignedByAdmin: true }
        ],
        task: { $regex: searchQuery, $options: 'i' }
      });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/assigned', auth, async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const userId = req.user._id;
    const tasks = await ToDo.find({
      $or: [
        { assignedUser: userId }, 
        { user: userId, isAssignedByAdmin: true } 
      ],
      task: { $regex: searchQuery, $options: 'i' } 
    })
    .populate('assignedUser', 'name'); 
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});





router.post('/task', async (req, res) => {
  const { task, priority, assignedUser } = req.body;

  try {
    const user = await User.findById(assignedUser);
    if (!user) {
      return res.status(400).json({ message: 'Assigned user does not exist.' });
    }

    const newTask = new Task({
      task,
      priority,
      assignedUser,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', auth, async (req, res) => {
  const { task, tags, completed, reminder, priority, collaborators, assignedUser, isAssignedByAdmin } = req.body;

  if (!task || !priority) {
    return res.status(400).json({ message: 'Task and priority are required fields.' });
  }

  try {
    const newTask = new ToDo({
      task,
      tags: tags || [], 
      completed: completed || false, 
      isAssignedByAdmin: isAssignedByAdmin || false, 
      reminder,
      priority,
      collaborators,
      assignedUser,
      user: req.user._id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error occurred.', details: error.errors });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await ToDo.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await ToDo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await ToDo.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedUser) {
      if (req.body.completed !== undefined) {
        task.completed = req.body.completed; 
      } else {
        return res.status(403).json({ message: 'Assigned tasks cannot be updated except for completion status.' });
      }
    } else {
      task.assignedUser = req.body.assignedUser || task.assignedUser;
      task.task = req.body.task || task.task;
      task.priority = req.body.priority || task.priority;
      task.reminder = req.body.reminder || task.reminder;
      task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
