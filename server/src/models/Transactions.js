const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  categoryId: {
    type: String,
    required: true
  },
  categoryDescription: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  sender:{
    type: String,
    required: false,
    default: null
  },
  reciever:{
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transactions', TransactionsSchema);
