const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
  experimentId: { type: String, required: true }, 
  date: { type: Date, default: Date.now }, 
  barcodeSummary: String,
  ampliconSummary: String,
  depthFiles: [String],
  reportFile: String
});

const Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;
