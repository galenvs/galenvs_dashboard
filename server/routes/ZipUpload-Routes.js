const express = require('express');
const router = express.Router();
const {
    uploadZip,
    getZipReport
} = require('../controllers/ZipUpload-Controller');
const multer = require('multer');
const {
    generateDatenID
} = require('../utilities');

// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './records/')
    },
    filename: function(req, file, cb) {
        const experimentId = req.body.experimentId;
        const DatenID = generateDatenID(experimentId);
        cb(null, `experiment_data_${DatenID}.zip`);
    }
});
const upload = multer({
    storage: storage
}).single('experimentZip');

// Endpoints 

/**
 * @desc Upload a zip file for an experiment
 * @route POST /api/zip-upload
 * @access Public
 */
router.post('/zip-upload', upload, uploadZip);

/**
 * @desc Get report for a specific zip file
 * @route GET /api/zip/:id/report
 * @access Public
 */
router.get("/zip/:id/report", getZipReport);


module.exports = router;