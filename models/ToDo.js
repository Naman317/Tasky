const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  tags: [String],
  completed: { type: Boolean, default: false },
  reminder: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
  createdBy: { type: String},
   isAssignedByAdmin:{ type: Boolean, default: false },
  
});

module.exports = mongoose.model('ToDo', ToDoSchema);
