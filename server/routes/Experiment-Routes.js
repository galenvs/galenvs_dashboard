const express = require("express");
const router = express.Router();
const { uploadExperiment, getReport } = require("../controllers/Experiment-Controller");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { generateDatenID } = require("../utilities");

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const experimentId = req.body.experimentId;
    const DatenID = generateDatenID(experimentId);
    const experimentPath = path.join("./records", `experiment_data_${DatenID}`);
    const destinationPath = file.fieldname === "depthFiles" ? path.join(experimentPath, `depth_${DatenID}`) : experimentPath;
    fs.mkdirSync(destinationPath, {
      recursive: true,
    });
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
    const experimentId = req.body.experimentId;
    const DatenID = generateDatenID(experimentId);
    const uniqueFileName = `${prefix}_${fileCount.toString().padStart(2, "0")}_${DatenID}.${originalExtension}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
}).fields([
  {
    name: "experimentId",
    maxCount: 1,
  },
  {
    name: "barcodeSummary",
    maxCount: 1,
  },
  {
    name: "ampliconSummary",
    maxCount: 1,
  },
  {
    name: "depthFiles",
    maxCount: 50,
  },
]);

// Endpoints

/**
 * @desc Upload experiment data
 * @route POST /api/upload
 * @access Public
 */
router.post("/upload", upload, uploadExperiment);

/**
 * @desc Get report for specific experiment
 * @route GET /api/:id/report
 * @access Public
 */
router.get("/:id/report", getReport);

module.exports = router;
