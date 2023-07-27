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

const upload = multer({ storage: storage });

router.post("/filter-snp", upload.single("file"), filterController.filterSNP);
router.post("/filter-cnv", upload.single("file"), filterController.filterCNV);
router.post("/filter-cnv-zip", upload.single("file"), filterController.filterCNVZip);
router.get("/download/:filename", filterController.download);

module.exports = router;
