const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  selectedChannel: mongoose.Schema.Types.ObjectId,
  content: String,
  createdAt: Date,
  sender: { ref: 'users', type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('msgs', messageSchema);