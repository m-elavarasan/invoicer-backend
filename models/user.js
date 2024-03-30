// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'StaffL1', 'StaffL2', 'Manager'],
    default: 'StaffL1'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
