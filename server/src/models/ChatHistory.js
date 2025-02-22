const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatHistorySchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: 'string',
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['system', 'user'],
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;