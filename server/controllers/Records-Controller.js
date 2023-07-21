const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const getAll = (req, res) => {
  const directoryParts = req.params[0].split("/");
  const directoryPath = path.join(process.env.RECORDS_PATH , ...directoryParts);

  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "There was an error reading the directory: " + err });
    }

    const items = files.map((file) => {
      return {
        name: file.name,
        type: file.isDirectory() ? "directory" : "file",
      };
    });

    res.status(200).json(items);
  });
};

const deleteItem = async (req, res) => {
  const filePath = path.join(process.env.RECORDS_PATH , req.params.path);
  if (fs.existsSync(filePath)) {
    try {
      console.log("Deleting file or directory:", filePath);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true }); // Delete directory and all contents
      } else {
        fs.unlinkSync(filePath); // Delete file
      }
      res.sendStatus(200);
    } catch (err) {
      console.error(`Error deleting file or directory ${filePath}:`, err);
      res.sendStatus(500);
    }
  } else {
    console.warn(`File or directory ${filePath} not found`);
    res.status(404).send("File or directory not found");
  }
};

const downloadFile = async (req, res) => {
  console.log(req.params.path);
  const filePath = path.join(process.env.RECORDS_PATH , req.params.path);
  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file", err);
        res.status(500).send("Error downloading file");
      }
    });
  } else {
    console.warn(`File ${filePath} not found`);
    res.status(404).send("File not found");
  }
};

const downloadFolder = async (req, res) => {
  const folderPath = path.join(process.env.RECORDS_PATH , req.params.path);

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  archive.directory(folderPath, false);

  // Get the last part of the path (the folder name)
  const folderName = path.basename(folderPath);
  res.attachment(`${folderName}.zip`);

  archive.pipe(res);
  archive.finalize();
};


module.exports = {
  getAll,
  deleteItem,
  downloadFile,
  downloadFolder,
};
