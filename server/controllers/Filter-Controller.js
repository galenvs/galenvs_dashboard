const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const csv = require("fast-csv");
const _ = require("lodash");

const filterVariant = async (req, res) => {
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
    const outputPath = `ResultsPGX/processed_for_client_${req.file.originalname}`;
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
        const outputPath = `ResultsPGX/processed_for_CNV_client_${baseName}.xlsx`;
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

const download = (req, res) => {
  const filename = req.params.filename;
  const filePath = `ResultsPGX/${filename}`;
  console.log(`Downloading file at: ${filePath}`);
  res.download(filePath);
};

module.exports = {
  filterVariant,
  download,
  filterCNV,
};
