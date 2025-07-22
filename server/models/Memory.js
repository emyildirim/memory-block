const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  context: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  tag: {
    type: String,
    trim: true,
    maxlength: 50
  },
  detail: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
memorySchema.index({ title: 'text', context: 'text', detail: 'text' });
memorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Memory', memorySchema); 