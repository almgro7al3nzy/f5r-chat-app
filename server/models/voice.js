const mongoose = require('mongoose');

const voiceSchema = mongoose.Schema({
  name: { type: String, unique: true },
  talkers: { type: Map, of: String }
});

module.exports = mongoose.model('voices', voiceSchema);