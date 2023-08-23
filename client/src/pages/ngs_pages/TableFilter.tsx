import React, { useState } from "react";
import { IconButton, TextField, CircularProgress, Alert, Container, Select, MenuItem, Tooltip } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { StyledContainer, StyledTypography, StyledButton, StyledBox, StyledSelect } from "../../style/styles";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/GetApp";

const TableFilter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileType, setFileType] = useState("variant");
  const [uploadType, setUploadType] = useState("individual");
  let acceptedFiles: string[];
  let dropzoneText: string;
  if (fileType === "cnv") {
    if (uploadType === "individual") {
      acceptedFiles = [".tsv"];
      dropzoneText = "Upload a TSV file here";
    } else {
      acceptedFiles = [".zip"];
      dropzoneText = "Upload a ZIP file containing TSV files here";
    }
  } else {
    acceptedFiles = [".xls", ".xlsx"];
    dropzoneText = "Upload an XLS/XLSX file here";
  }

  // Function to handle changes in the file drop zone
  const onFileChange = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  // Function to handle the file upload and processing
  const onFileUpload = async () => {
    if (!selectedFile) {
      alert("Please add the xls/csv file.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    try {
      const apiUrl = fileType === "variant" ? "/filter/filter-snp" : uploadType === "zip" ? "/filter/filter-cnv-zip" : "/filter/filter-cnv";
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${apiUrl}`, formData);
      setProcessedFilename(response.data.filename);      
      setSuccess("File processed successfully. Please click on the download icon to retrieve the processed file.");
    } catch (error) {
      setError("An error occurred while processing the file. Please try again.");
      console.error(error);
    }

    setIsLoading(false);
  };

  // Function to handle the processed file download process
  const getProcessedFile = async () => {
    if (!processedFilename) {
      alert("No processed file available for download.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/filter/download/${processedFilename}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", processedFilename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download processed file:", error);
    }

    setIsLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <StyledContainer>

        {/* Wrap the select lists in a flex container */}
        <StyledBox sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <StyledSelect 
            value={fileType} 
            onChange={(event) => {
              setFileType(event.target.value);
            }} 
          >
            <MenuItem value={"variant"}>SNP Table</MenuItem>
            <MenuItem value={"cnv"}>CNV Table</MenuItem>
          </StyledSelect>

          {/* Add a new Select for the upload type if the file type is "cnv" */}
          {fileType === "cnv" && (
            <StyledSelect 
              value={uploadType} 
              onChange={(event) => {
                setUploadType(event.target.value);
              }} 
            >
              <MenuItem value={"individual"}>Individual File</MenuItem>
              <MenuItem value={"zip"}>ZIP File</MenuItem>
            </StyledSelect>
          )}
        </StyledBox>

        <DropzoneArea
          onChange={onFileChange}
          acceptedFiles={acceptedFiles}
          maxFileSize={500000000}
          showPreviewsInDropzone={true}
          useChipsForPreview={true}
          previewGridProps={{ container: { spacing: 1, direction: "row" } }}
          filesLimit={1}
          dropzoneText={<span style={{ fontSize: "18px", color: "#C2C2C2" }}>{dropzoneText}</span>}
          sx={{ marginBottom: "1rem" }} // Add some spacing between DropzoneArea and the button group
        />

        <StyledBox sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <StyledButton variant="contained" onClick={onFileUpload} disabled={!selectedFile || isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Upload and Process File"}
          </StyledButton>

          {processedFilename && (
            <StyledBox>
              <Tooltip title="Download processed file">
                <IconButton color="success" onClick={getProcessedFile}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </StyledBox>
          )}
        </StyledBox>

        {error && <Alert severity="error">{error}</Alert>}

        {success && <Alert severity="success">{success}</Alert>}
      </StyledContainer>
    </Container>
  );
};

export default TableFilter;
