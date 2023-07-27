const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const csv = require("fast-csv");
const _ = require("lodash");
const extract = require("extract-zip");

const filterSNP = async (req, res) => {
  // Define the fields (columns) to keep
  const fieldsToKeep = ["Sample Name", "Chrom", "Position", "Ref", "Variant", "VCF Ref", "VCF Variant", "Frequency", "Type", "Allele Call", "Allele Source", "Allele Name"];

  // Determine the file type of the uploaded file
  const ext = path.extname(req.file.originalname);
  console.log(`File extension: ${ext}`);

  if (ext === ".xls" || ext === ".xlsx") {
    // Process Excel file
    const workbook = XLSX.readFile(req.file.path);

    // Check if the workbook has any worksheets
    if (!workbook.SheetNames.length) {
      console.log("The uploaded file does not contain any worksheets.");
      return res.status(400).json({ error: "The uploaded file does not contain any worksheets." });
    }

    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    console.log(`Processed worksheet: ${worksheetName}`);

    // Parse worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // Filter data
    const filteredData = jsonData.map((row) => {
      let filteredRow = {};
      fieldsToKeep.forEach((field) => {
        filteredRow[field] = row[field];
      });
      return filteredRow;
    });

    // Convert filtered data back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook for the output
    const outputWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(outputWorkbook, newWorksheet, "Sheet1");

    // Save the output workbook
    const outputPath = path.join(process.env.UPLOADS_PATH, `processed_for_client_${req.file.originalname}`);
    XLSX.writeFile(outputWorkbook, outputPath);
    console.log(`Output file saved at: ${outputPath}`);

    // Delete the uploaded file
    fs.unlinkSync(req.file.path);
    console.log(`Deleted uploaded file: ${req.file.path}`);

    res.json({ message: "File processed successfully", filename: `processed_for_client_${req.file.originalname}` });
  } else {
    console.log(`Unsupported file type: ${ext}`);
    res.status(400).json({ error: "Unsupported file type. Please upload an XLS or XLSX file." });
  }
};

const filterCNV = async (req, res) => {
  // Define the fields (columns) to keep
  const fieldsToKeep = ["# locus", "type", "length", "iscn", "gene"];

  // Determine the file type of the uploaded file
  const ext = path.extname(req.file.originalname);
  console.log(`File extension: ${ext}`);

  if (ext === ".tsv") {
    // Read TSV file and parse it to JSON
    let rawData = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: false, delimiter: "\t" }))
      .on("data", (row) => rawData.push(row))
      .on("end", () => {
        // Once the file has been read and parsed, we can start cleaning

        // Find the header
        let headerIndex = rawData.findIndex((row) => row.includes("# locus"));

        // If header was not found, return an error
        if (headerIndex === -1) {
          return res.status(400).json({ error: "The uploaded file does not contain the required headers." });
        }

        // Get indices of the fields to keep
        let fieldIndices = fieldsToKeep.map((field) => rawData[headerIndex].indexOf(field));

        // Subset relevant columns
        let jsonData = rawData.slice(headerIndex + 1).map((row) => {
          let obj = {};
          fieldsToKeep.forEach((field, i) => {
            obj[field] = row[fieldIndices[i]];
          });
          return obj;
        });

        console.log("Data after subsetting columns:", jsonData);

        // Handle missing values
        jsonData = jsonData.filter((row) => _.every(_.pick(row, ["# locus", "type", "iscn", "gene"])));

        console.log("Data after handling missing values:", jsonData);

        // Apply constraints
        console.log("Applying constraints to the following data:", jsonData);
        jsonData = jsonData.filter((row) => row["type"] && row["type"] === "CNV");
        console.log("Data after applying constraints:", jsonData);

        // Convert non-numeric 'length' values to null
        jsonData = jsonData.map((row) => {
          if (isNaN(row["length"])) {
            row["length"] = null;
          }
          return row;
        });

        console.log("Data after handling non-numeric length:", jsonData);

        // Convert filtered data back to worksheet
        const newWorksheet = XLSX.utils.json_to_sheet(jsonData);

        console.log("Data written to worksheet:", newWorksheet);

        // Create a new workbook for the output
        const outputWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(outputWorkbook, newWorksheet, "Sheet1");

        // Save the output workbook
        const baseName = path.basename(req.file.originalname, ext);
        const outputPath = path.join(process.env.UPLOADS_PATH, `processed_for_CNV_client_${baseName}.xlsx`);
        XLSX.writeFile(outputWorkbook, outputPath);
        console.log(`Output file saved at: ${outputPath}`);

        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        console.log(`Deleted uploaded file: ${req.file.path}`);

        res.json({ message: "File processed successfully", filename: `processed_for_CNV_client_${baseName}.xlsx` });
      });
  } else {
    console.log(`Unsupported file type: ${ext}`);
    res.status(400).json({ error: "Unsupported file type. Please upload a TSV file." });
  }
};

const filterCNVZip = async (req, res) => {
  const zipFilePath = req.file.path;
  const destinationPath = path.join(process.env.UPLOADS_PATH, path.basename(zipFilePath, ".zip"));

  console.log(`Zip file path: ${zipFilePath}`);
  console.log(`Destination path: ${destinationPath}`);

  try {
    // Extract the ZIP file
    await extract(zipFilePath, { dir: destinationPath });

    // Delete the zip file
    fs.unlinkSync(zipFilePath);
    console.log(`Deleted zip file: ${zipFilePath}`);

    // Create a directory to store all .tsv files
    const allTsvDir = path.join(destinationPath, "all_tsvs");
    if (!fs.existsSync(allTsvDir)) {
      fs.mkdirSync(allTsvDir);
    }

    let folderCount = 0;
    let combinedData = [];

    async function processDirectory(dirPath) {
      const entries = fs.readdirSync(dirPath);

      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);

        try {
          if (fs.statSync(entryPath).isDirectory()) {
            // If the directory is named 'Variants', look for .tsv files within its subdirectories
            if (entry === "Variants") {
              const subdirs = fs.readdirSync(entryPath);

              for (const subdir of subdirs) {
                const subdirPath = path.join(entryPath, subdir);
                if (fs.statSync(subdirPath).isDirectory()) {
                  const files = fs.readdirSync(subdirPath);

                  for (const file of files) {
                    if (path.extname(file) === ".tsv") {
                      // If a .tsv file is found, move it to the 'all_tsvs' directory
                      const oldPath = path.join(subdirPath, file);
                      const newPath = path.join(allTsvDir, file);
                      console.log(`Moving .tsv file: ${oldPath} to ${newPath}`);
                      fs.renameSync(oldPath, newPath);

                      // Read the .tsv file and add its data to the combinedData array
                      const tsvData = fs.readFileSync(newPath, "utf-8");
                      const rows = tsvData.split("\n");
                      const headers = rows[2].split("\t");
                      for (let i = 3; i < rows.length; i++) {
                        const rowData = {};
                        const cells = rows[i].split("\t");
                        let typeIndex = headers.indexOf("type");
                        if (cells[typeIndex] === "CNV") {
                          // Only include rows with "CNV" in the "type" column
                          let indicesToInclude = ["# locus", "type", "iscn", "gene"].map((header) => headers.indexOf(header));
                          for (let j = 0; j < headers.length; j++) {
                            if (indicesToInclude.includes(j)) {
                              // Only include specific columns in rowData
                              let cellData = cells[j];
                              if (typeof cellData === "string" && cellData.length > 32767) {
                                cellData = cellData.substring(0, 32767);
                              }
                              rowData[headers[j]] = cellData;
                            }
                          }
                          rowData["SourceFile"] = file;
                          combinedData.push(rowData);
                        }
                      }
                    }
                  }
                }
              }
            } else {
              // If the directory is not named 'Variants', check its subdirectories
              await processDirectory(entryPath);
            }
          } else if (path.extname(entry) === ".zip") {
            // If a .zip file is found, rename it, extract it and process the contents, then delete the .zip file
            const newZipPath = path.join(dirPath, `folder${folderCount++}.zip`);
            fs.renameSync(entryPath, newZipPath);
            const extractPath = path.join(dirPath, path.basename(newZipPath, ".zip"));
            console.log(`Extracting zip file: ${newZipPath} to ${extractPath}`);
            await extract(newZipPath, { dir: extractPath });
            fs.unlinkSync(newZipPath);
            await processDirectory(extractPath);
          }
        } catch (err) {
          console.error(`Error processing entry: ${entryPath}`, err);
        }
      }

      // After processing all entries in the directory, delete it if it's not the 'all_tsvs' directory
      if (dirPath !== destinationPath && dirPath !== allTsvDir) {
        fs.rmdirSync(dirPath, { recursive: true });
        console.log(`Deleted directory: ${dirPath}`);
      }
    }

    // Start processing from the root of the extracted content
    await processDirectory(destinationPath);

    // Combine all .tsv data into one .xlsx file
    const combinedFileName = path.basename(destinationPath) + ".xlsx";
    const combinedFilePath = path.join(path.dirname(destinationPath), combinedFileName);
    const newWB = XLSX.utils.book_new();
    const newWS = XLSX.utils.json_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(newWB, newWS, "CombinedData");
    XLSX.writeFile(newWB, combinedFilePath);
    // Delete the destination directory
    fs.rmdirSync(destinationPath, { recursive: true });
    console.log(`Deleted directory: ${destinationPath}`);

    console.log(`path:  ${combinedFilePath}`);
    res.json({ message: "Zip file processed successfully", filename: combinedFileName });
    console.log(`filenameForClient:  ${combinedFileName}`);
  } catch (err) {
    console.error("Failed to extract and process zip file", err);
    res.status(500).json({
      error: `Failed to extract and process zip file: ${err.message}`,
    });
  }
};

const download = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.env.UPLOADS_PATH, filename);
  console.log(`Downloading file at: ${filePath}`);
  res.download(filePath);
};

module.exports = {
  filterSNP,
  download,
  filterCNV,
  filterCNVZip,
};
