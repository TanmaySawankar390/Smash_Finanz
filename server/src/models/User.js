const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // firebaseId: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  balance:{
    type: Number,
    default: 0
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
