// ReportGenerator-Zip-Controller
// Author: Jonathan Haddad
// Date created: 20-07-2023

/* Description: This file contains the methods for handling the various zip upload-related HTTP requests. 
These include uploading a zip file and generating a report (uploadZip), and getting the generated report for a specific zip file id (getZipReport).
The uploadZip function takes a multipart form data request with a zip file, extracts the zip file, processes the extracted files, saves the experiment data to the database, and generates a report using an R script.
The getZipReport function takes the id of an experiment as a parameter and sends the corresponding report file to the client.
*/
const extract = require("extract-zip");
const Experiment = require("../models/Experiment-Model");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateDatenID } = require("../utilities");

const uploadZip = async (req, res) => {
  const zipFilePath = req.file.path;
  const experimentId = req.body.experimentId;
  const DatenID = generateDatenID(experimentId);
  const destinationPath = path.resolve(process.env.RECORDS_PATH, `experiment_data_${DatenID}`);
  console.log(`experimentId: ${experimentId}`);
  console.log(`Zip file path: ${zipFilePath}`);
  console.log(`Destination path: ${destinationPath}`);
  try {
    await extract(zipFilePath, {
      dir: destinationPath,
    });

    fs.unlink(zipFilePath, (err) => {
      if (err) {
        console.error(`Error while deleting zip file: ${err}`);
      } else {
        console.log(`Deleted zip file: ${zipFilePath}`);
      }
    });

    // process files
    const depthDir = path.join(destinationPath, `depth_${DatenID}`);
    fs.mkdirSync(depthDir, {
      recursive: true,
    });
    const ionCodeDirs = fs.readdirSync(destinationPath).filter((dir) => dir.startsWith("IonCode_"));

    for (const ionCodeDir of ionCodeDirs) {
      const subdirPath = path.join(destinationPath, ionCodeDir);
      const depthFiles = fs.readdirSync(subdirPath).filter((file) => file.endsWith(".amplicon.cov.xls"));

      for (const depthFile of depthFiles) {
        const oldPath = path.join(subdirPath, depthFile);
        const newPath = path.join(depthDir, depthFile);
        fs.renameSync(oldPath, newPath);
      }

      fs.rmdirSync(subdirPath, {
        recursive: true,
      });
    }
    // Save experiment
    const experiment = new Experiment({
      experimentId: req.body.experimentId,
    });
    await experiment.save();
    // identify barcodeSummary and ampliconSummary files
    const filesInRoot = fs.readdirSync(destinationPath);
    const barcodeSummary = filesInRoot.find((file) => file.endsWith("bc_summary.xls"));
    const ampliconSummary = filesInRoot.find((file) => file.endsWith("bcmatrix.xls"));

    // construct paths
    const recordPath = path.join(process.env.RECORDS_PATH, `experiment_data_${DatenID}`);
    const depthFolderPath = path.join(recordPath, `depth_${DatenID}`, "/");
    const barcodeSummaryPath = path.join(destinationPath, barcodeSummary);
    const ampliconSummaryPath = path.join(destinationPath, ampliconSummary);
    const rMarkdownPath = path.join(process.env.CORE_PATH, "pgx_qc.Rmd");
    const reportPath = path.join(process.env.RECORDS_PATH, `experiment_data_${DatenID}`, "report.pdf");

    // Execute R markdown
    console.log(barcodeSummaryPath);
    console.log(ampliconSummaryPath);
    console.log(depthFolderPath);
    console.log(rMarkdownPath);
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
  } catch (err) {
    console.error("Failed to extract and process zip file", err);
    res.status(500).json({
      error: `Failed to extract and process zip file: ${err.message}`,
    });
  }
};

const getZipReport = async (req, res) => {
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
  res.download(reportPath, reportName);
};

module.exports = {
  uploadZip,
  getZipReport,
};
