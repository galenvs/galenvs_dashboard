import React, { useState } from "react";
import { IconButton, TextField, CircularProgress, Alert, Container, Select, MenuItem, Tooltip } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { StyledContainer, StyledTypography, StyledButton, StyledBox, StyledSelect } from "../style/styles";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/GetApp";

const TableFilter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileType, setFileType] = useState("variant");
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
      const apiUrl = fileType === "variant" ? "/filter/filter-csv" : "/filter/filter-cnv"; // switch API URL based on selected file type
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

    <StyledSelect 
  value={fileType} 
  onChange={(event) => {
    setFileType(event.target.value);
    window.location.reload();
  }} 
  sx={{ marginBottom: "1rem" }}
>
  <MenuItem value={"variant"}>SNP Table</MenuItem>
  <MenuItem value={"cnv"}>CNV Table</MenuItem>
</StyledSelect>
      <DropzoneArea 
        onChange={onFileChange} 
        acceptedFiles={fileType === "cnv" ? [".tsv"] : [".xls", ".xlsx"]} 
        maxFileSize={500000000} 
        showPreviewsInDropzone={true} 
        useChipsForPreview={true} 
        previewGridProps={{ container: { spacing: 1, direction: "row" } }} 
        filesLimit={1} 
        dropzoneText={<span style={{ fontSize: "18px", color: "#C2C2C2" }}>Upload a TSV/XLS file here</span>} 
        sx={{ marginBottom: "1rem" }} // Add some spacing between DropzoneArea and the button group
      />

      <StyledBox sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <StyledButton
          variant="contained"
          onClick={onFileUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Upload and Process File"}
        </StyledButton>

        {processedFilename && (
          <StyledBox>
            <Tooltip title="Download processed file"> {/* Add a tooltip for the download button */}
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
