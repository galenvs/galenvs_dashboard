const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const filterController = require("../controllers/Filter-Controller");

// Set up multer storage to include original file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOADS_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize multer middleware with the custom storage
const upload = multer({ storage: storage });

/**
 * @desc Route for filtering SNP data
 * @route POST /api/filter/filter-snp
 * @middleware multer.single("file")
 * @access Public
 */
router.post("/filter-snp", upload.single("file"), filterController.filterSNP);

/**
 * @desc Route for filtering CNV data
 * @route POST /api/filter/filter-cnv
 * @middleware multer.single("file")
 * @access Public
 */
router.post("/filter-cnv", upload.single("file"), filterController.filterCNV);

/**
 * @desc Route for filtering CNV data contained in a zip file
 * @route POST /api/filter/filter-cnv-zip
 * @middleware multer.single("file")
 * @access Public
 */
router.post("/filter-cnv-zip", upload.single("file"), filterController.filterCNVZip);

/**
 * @desc Route for downloading filtered data by filename
 * @route GET /api/filter/download/:filename
 * @access Public
 */
router.get("/download/:filename", filterController.download);

module.exports = router;
