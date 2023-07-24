const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const filterVariant = async (req, res) => {
  // Define the fields (columns) to keep
  const fieldsToKeep = ["Sample Name", "Chrom", "Position", "Ref", "Variant","VCF Ref","VCF Variant" , "Frequency", "Type","Allele Call",  "Allele Source", "Allele Name"];

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
    const filteredData = jsonData.map(row => {
      let filteredRow = {};
      fieldsToKeep.forEach(field => {
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

const download = (req, res) => {
  const filename = req.params.filename;
  const filePath = `ResultsPGX/${filename}`;
  console.log(`Downloading file at: ${filePath}`);
  res.download(filePath);
};

module.exports = {
  filterVariant,
  download,
};
