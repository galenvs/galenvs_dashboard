const express = require("express");
const multer = require("multer");
const Experiment = require("../models/Experiment-Model");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const experimentId = req.body.experimentId; // Assuming the experimentId is available in the request body

    const DatenID = `${day}${month}${year}_${hours}${minutes}_${experimentId}`;
    const experimentPath = path.join("./records", `experiment_data_${DatenID}`);
    const destinationPath =
      file.fieldname === "depthFiles"
        ? path.join(experimentPath, `depth_${DatenID}`)
        : experimentPath;
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const fieldname = file.fieldname;
    const fieldnameMappings = {
      depthFiles: "depth",
      barcodeSummary: "barcodeSummary",
      ampliconSummary: "ampliconSummary",
    };
    const prefix = fieldnameMappings[fieldname] || "";
    const fileCount = req.files[fieldname]?.length || 0;
    const originalExtension = file.originalname.split(".").pop();
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const experimentId = req.body.experimentId; // Assuming the experimentId is available in the request body

    const DatenID = `${day}${month}${year}_${hours}${minutes}_${experimentId}`;
    const uniqueFileName = `${prefix}_${fileCount
      .toString()
      .padStart(2, "0")}_${DatenID}.${originalExtension}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
}).fields([
  { name: "experimentId", maxCount: 1 },
  { name: "barcodeSummary", maxCount: 1 },
  { name: "ampliconSummary", maxCount: 1 },
  { name: "depthFiles", maxCount: 50 },
]);

router.post("/upload", upload, async (req, res) => {
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
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(currentDate.getFullYear()).slice(-2);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const experimentId = req.body.experimentId;
  
  const DatenID = `${day}${month}${year}_${hours}${minutes}_${experimentId}`;
  const recordPath = path.join("C:/Users/jonat/Desktop/ngs_app_galenvs/server/records", `experiment_data_${DatenID}`);
  const depthFolderPath = path.join(recordPath, `depth_${DatenID}`, `/\/`);

  const barcodeSummaryPath = path.join(recordPath, barcodeSummary[0].filename);
  const ampliconSummaryPath = path.join(recordPath, ampliconSummary[0].filename);

  const rMarkdownPath = path.join("C:/Users/jonat/Desktop/ngs_app_galenvs/server/core", "pgx_qc.Rmd");
  const reportPath = path.join(recordPath, "report.pdf");

  // Execute R markdown
  console.log(barcodeSummaryPath);
  console.log(ampliconSummaryPath);
  console.log(depthFolderPath);

  try {
    let rMarkdownPathForwardSlash = rMarkdownPath.replace(/\\/g, '/');
    let reportPathForwardSlash = reportPath.replace(/\\/g, '/');
    let barcodeSummaryPathForwardSlash = barcodeSummaryPath.replace(/\\/g, '/');
    let ampliconSummaryPathForwardSlash = ampliconSummaryPath.replace(/\\/g, '/');
    let depthFolderPathForwardSlash = depthFolderPath.replace(/\\/g, '/');
   
    execSync(
      `R -e "rmarkdown::render('${rMarkdownPathForwardSlash}', output_file = '${reportPathForwardSlash}', params = list(Barcode_summary_path = '${barcodeSummaryPathForwardSlash}', Amplicon_summary_path = '${ampliconSummaryPathForwardSlash}', depth_files_folder_path = '${depthFolderPathForwardSlash}'))"`
    );
    
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error in R script execution.");
  }

  res.json({ _id: experiment._id });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const experiment = await Experiment.findById(id);
  if (!experiment) {
    return res.status(404).send("Experiment not found.");
  }

  res.json(experiment);
});

router.get("/:id/report", async (req, res) => {
  const { id } = req.params;

  const experiment = await Experiment.findById(id);
  if (!experiment) {
    return res.status(404).send("Experiment not found.");
  }

  const reportPath = path.join(
    __dirname,
    "records",
    experiment._id.toString(),
    "report.pdf"
  );
  if (!fs.existsSync(reportPath)) {
    return res.status(404).send("Report not found.");
  }

  res.download(reportPath);
});

module.exports = router;
