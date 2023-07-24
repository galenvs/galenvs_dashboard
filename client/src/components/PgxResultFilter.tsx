import React, { useState } from "react";
import { IconButton, TextField, CircularProgress, Alert, Container } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { StyledContainer, StyledTypography, StyledButton, StyledBox } from "../style/styles";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/GetApp";

const PgxResultFilter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/filter/filter-csv`, formData);
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
        <StyledTypography variant="h6" align="center">
          Upload and Process a CSV/XLS File
        </StyledTypography>

        <DropzoneArea onChange={onFileChange} acceptedFiles={[".csv", ".xls", ".xlsx"]} maxFileSize={500000000} showPreviewsInDropzone={true} useChipsForPreview={true} previewGridProps={{ container: { spacing: 1, direction: "row" } }} filesLimit={1} dropzoneText={<span style={{ fontSize: "18px", color: "#C2C2C2" }}>Upload a CSV/XLS file here</span>} />

        <StyledBox sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <StyledButton
            variant="contained"
            onClick={onFileUpload}
            disabled={!selectedFile || isLoading} // disable button when no file or loading
          >
            {isLoading ? <CircularProgress size={24} /> : "Upload and Process File"}
          </StyledButton>

          {processedFilename && (
            <StyledBox>
              <IconButton color="success" onClick={getProcessedFile}>
                <DownloadIcon />
              </IconButton>
            </StyledBox>
          )}
        </StyledBox>

        {error && <Alert severity="error">{error}</Alert>}

        {success && <Alert severity="success">{success}</Alert>}
      </StyledContainer>
    </Container>
  );
};

export default PgxResultFilter;
