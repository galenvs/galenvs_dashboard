const express = require('express');
const router = express.Router();
const multer = require('multer');
const extract = require('extract-zip');
const Experiment = require("../models/Experiment-Model");
const fs = require('fs');
const path = require('path');
const {execSync} = require("child_process");

// Function to generate DatenID
function generateDatenID(experimentId) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(currentDate.getFullYear()).slice(-2);
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    return `${day}${month}${year}_${hours}${minutes}_${experimentId}`;
}

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

router.post('/zip-upload', upload, async (req, res) => {
    const zipFilePath = req.file.path;
    const experimentId = req.body.experimentId;
    const DatenID = generateDatenID(experimentId);
    const destinationPath = path.resolve("C:/Users/jonat/Desktop/ngs_dashboard/server/records", `experiment_data_${DatenID}`);
    console.log(`experimentId: ${experimentId}`);
    console.log(`Zip file path: ${zipFilePath}`);
    console.log(`Destination path: ${destinationPath}`);
    try {
        await extract(zipFilePath, {
            dir: destinationPath
        });

        fs.unlink(zipFilePath, err => {
            if (err) {
                console.error(`Error while deleting zip file: ${err}`);
            } else {
                console.log(`Deleted zip file: ${zipFilePath}`);
            }
        });
        
        // process files
        const depthDir = path.join(destinationPath, `depth_${DatenID}`);
        fs.mkdirSync(depthDir, {
            recursive: true
        });
        const ionCodeDirs = fs.readdirSync(destinationPath).filter(dir => dir.startsWith("IonCode_"));

        for (const ionCodeDir of ionCodeDirs) {
            const subdirPath = path.join(destinationPath, ionCodeDir);
            const depthFiles = fs.readdirSync(subdirPath).filter(file => file.endsWith(".amplicon.cov.xls"));

            for (const depthFile of depthFiles) {
                const oldPath = path.join(subdirPath, depthFile);
                const newPath = path.join(depthDir, depthFile);
                fs.renameSync(oldPath, newPath);
            }

            fs.rmdirSync(subdirPath, {
                recursive: true
            });
        }
  // Save experiment
  const experiment = new Experiment({
    experimentId: req.body.experimentId,
  });
  await experiment.save();
        // identify barcodeSummary and ampliconSummary files
        const filesInRoot = fs.readdirSync(destinationPath);
        const barcodeSummary = filesInRoot.find(file => file.endsWith("bc_summary.xls"));
        const ampliconSummary = filesInRoot.find(file => file.endsWith("bcmatrix.xls"));

        // construct paths
        const recordPath = path.join("C:/Users/jonat/Desktop/ngs_dashboard/server/records", `experiment_data_${DatenID}`);
        const depthFolderPath = path.join(recordPath, `depth_${DatenID}`, '/');
        const barcodeSummaryPath = path.join(destinationPath, barcodeSummary);
        const ampliconSummaryPath = path.join(destinationPath, ampliconSummary);
        const rMarkdownPath = path.join(__dirname, "..", "core", "pgx_qc.Rmd");
        const reportPath = path.join("C:/Users/jonat/Desktop/ngs_dashboard/server/records", `experiment_data_${DatenID}`, "report.pdf");

        // Execute R markdown
        console.log(barcodeSummaryPath);
        console.log(ampliconSummaryPath);
        console.log(depthFolderPath);
        console.log(rMarkdownPath);
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
        res.json({
          _id: experiment._id
        });
    } catch (err) {
        console.error("Failed to extract and process zip file", err);
        res.status(500).json({
            error: `Failed to extract and process zip file: ${err.message}`
        });
    }
});

router.get("/zip/:id/report", async (req, res) => {
    const {
        id
    } = req.params;

    const experiment = await Experiment.findById(id);
    if (!experiment) {
        return res.status(404).send("Experiment not found.");
    }

    const experimentId = experiment.experimentId;
    const DatenID = generateDatenID(experimentId);
    const reportPath = path.join("C:/Users/jonat/Desktop/ngs_dashboard/server/records", `experiment_data_${DatenID}`, "report.pdf");
    if (!fs.existsSync(reportPath)) {
        return res.status(404).send("Report not found.");
    }

    const reportName = `report_${DatenID}.pdf`;
    res.download(reportPath, reportName);
});
module.exports = router;