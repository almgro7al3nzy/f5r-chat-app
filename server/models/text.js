const mongoose = require('mongoose');

const textSchema = mongoose.Schema({
  name: String,
  messages: [{ ref: 'msgs', type: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model('texts', textSchema);