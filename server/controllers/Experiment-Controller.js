// Experiment Controller
// Author: Jonathan Haddad
// Date created: 20-07-2023

/* Description: This file contains the methods for handling the various experiment-related HTTP requests. 
These include uploading experiment data and generating a report (uploadExperiment), and getting the generated report for a specific experiment id (getReport).
The uploadExperiment function takes a multipart form data request, saves the experiment data to the database, and generates a report using an R script.
The getReport function takes the id of an experiment as a parameter and sends the corresponding report file to the client.
*/
const Experiment = require("../models/Experiment-Model");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateDatenID } = require("../utilities");

/**
 * @desc Uploads experiment data and generates a report
 * @param {Object} req - Express request object, expected to contain the following form fields: experimentId, barcodeSummary, ampliconSummary, and depthFiles
 * @param {Object} res - Express response object
 * @returns {Object} - Returns the id of the saved experiment
 */
const uploadExperiment = async (req, res) => {
  const { barcodeSummary, ampliconSummary, depthFiles } = req.files;

  // Save experiment
  const experiment = new Experiment({
    experimentId: req.body.experimentId,
    barcodeSummaryFile: barcodeSummary[0].path,
    ampliconSummaryFile: ampliconSummary[0].path,
    depthFiles: depthFiles.map((file) => file.path),
  });
  await experiment.save();

  // Construct paths
  const experimentId = req.body.experimentId;
  const DatenID = generateDatenID(experimentId);
  const recordPath = path.join(process.env.RECORDS_PATH, `experiment_data_${DatenID}`);
  const depthFolderPath = path.join(recordPath, `depth_${DatenID}`, "/");

  const barcodeSummaryPath = path.join(recordPath, barcodeSummary[0].filename);
  const ampliconSummaryPath = path.join(recordPath, ampliconSummary[0].filename);

  const rMarkdownPath = path.join(process.env.CORE_PATH, "pgx_qc.Rmd");
  const reportPath = path.join(recordPath, "report.pdf");

  // Execute R markdown
  console.log(barcodeSummaryPath);
  console.log(ampliconSummaryPath);
  console.log(depthFolderPath);

  try {
    // remove the "/" with "\\" to avoid issues with tex files
    let rMarkdownPathForwardSlash = rMarkdownPath.replace(/\\/g, "/");
    let reportPathForwardSlash = reportPath.replace(/\\/g, "/");
    let barcodeSummaryPathForwardSlash = barcodeSummaryPath.replace(/\\/g, "/");
    let ampliconSummaryPathForwardSlash = ampliconSummaryPath.replace(/\\/g, "/");
    let depthFolderPathForwardSlash = depthFolderPath.replace(/\\/g, "/");

    execSync(`R -e "rmarkdown::render('${rMarkdownPathForwardSlash}', output_file = '${reportPathForwardSlash}', params = list(Barcode_summary_path = '${barcodeSummaryPathForwardSlash}', Amplicon_summary_path = '${ampliconSummaryPathForwardSlash}', depth_files_folder_path = '${depthFolderPathForwardSlash}'))"`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error in R script execution.");
  }

  res.json({
    _id: experiment._id,
  });
};

/**
 * @desc Sends a report file for a specific experiment
 * @param {Object} req - Express request object, expected to contain the id of an experiment as a parameter
 * @param {Object} res - Express response object
 */
const getReport = async (req, res) => {
  const { id } = req.params;

  const experiment = await Experiment.findById(id);
  if (!experiment) {
    return res.status(404).send("Experiment not found.");
  }

  const experimentId = experiment.experimentId;
  const DatenID = generateDatenID(experimentId);
  const reportPath = path.join(process.env.RECORDS_PATH, `experiment_data_${DatenID}`, "report.pdf");
  if (!fs.existsSync(reportPath)) {
    return res.status(404).send("Report not found.");
  }

  const reportName = `report_${DatenID}.pdf`;

  console.log("Sending report file:", reportPath);
  console.log("Suggested filename for client:", reportName);

  res.download(reportPath, reportName);
};

module.exports = {
  uploadExperiment,
  getReport,
};
