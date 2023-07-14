const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
  experimentId: { type: String, required: true }, // Adding experimentId field
  date: { type: Date, default: Date.now }, // You probably want to set a default value to current date
  barcodeSummary: String,
  ampliconSummary: String,
  depthFiles: [String],
  reportFile: String
});

const Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;
