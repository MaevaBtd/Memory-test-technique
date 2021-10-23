const mongoose = require('mongoose');

const resultsSchema = mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model('Results', resultsSchema);