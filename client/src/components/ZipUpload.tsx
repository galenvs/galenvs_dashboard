// ZipUpload Component
// Author: Jonathan Haddad
// Date created: 20-07-2023

/* Description: This TypeScript React component is used for uploading a zip file that contains experiment-related files and generating a report. 
It provides a form for the user to enter an experiment id and to upload a zip file. 
When the user submits the form, the component sends a multipart form data request to the server, receives the id of the saved experiment, and displays a download button for the generated report.
The component also handles validation (checking that all required fields are filled and that the uploaded file has the correct extension), progress indication, and error handling.
*/

import React, { useState } from "react";
import {
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import {
  StyledContainer,
  StyledFormControl,
  StyledTypography,
  StyledButton,
  StyledBox,
} from "../style/styles";
import axios from "axios";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/GetApp";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ZipUpload: React.FC<{
  setReportUrl: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setReportUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [experimentId, setExperimentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Function to handle changes in the experiment ID input field
  const onExperimentIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentId(event.target.value.replace(/\s/g, ""));
  };

  // Function to handle changes in the file drop zone
  const onFileChange = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  // Function to handle the file upload process
  const onFileUpload = async () => {
    if (!selectedFile || !experimentId) {
      alert("Please add the zip file and enter experiment id.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("experimentId", experimentId);
    formData.append("experimentZip", selectedFile, selectedFile.name);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/zip-upload",
        formData
      );
      setExperimentId(response.data._id);
      setReportUrl(response.data.reportUrl);
      setSuccess(
        "Files uploaded successfully. Please click on the download icon to retrieve the report."
      );
      setReportGenerated(true);
    } catch (error) {
      setError(
        "An error occurred while uploading the files. Please try again."
      );
      console.error(error);
    }

    setIsLoading(false);
  };

  // Function to handle the report download process
  const getReport = async () => {
    setIsLoading(true);
    try {
      const reportUrl = `http://localhost:5000/api/zip/${experimentId}/report`;
      const response = await axios.get(reportUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <StyledBox>
        <Link to="/">
          <StyledButton variant="contained">
            <ArrowBackIosIcon fontSize="inherit" /> Back{" "}
          </StyledButton>
        </Link>
      </StyledBox>
      <StyledContainer>
        <StyledTypography variant="h6" align="center">
          Generate a Report From the Experiment Zip File
        </StyledTypography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="experimentId"
          value={experimentId}
          label="Experiment ID"
          name="experimentId"
          autoComplete="experimentId"
          autoFocus
          onChange={onExperimentIdChange}
        />

        <DropzoneArea
          onChange={onFileChange}
          acceptedFiles={[
            "application/zip",
            "application/x-zip-compressed",
            "multipart/x-zip",
            "application/octet-stream",
          ]}
          maxFileSize={500000000}
          showPreviewsInDropzone={true}
          useChipsForPreview={true}
          previewGridProps={{ container: { spacing: 1, direction: "row" } }}
          filesLimit={1}
          dropzoneText={
            <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
              Upload a Zip File of the experiment here Summary file here
            </span>
          }
        />

        <StyledBox
          sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}
        >
          <StyledButton
            variant="contained"
            onClick={onFileUpload}
            disabled={!selectedFile || !experimentId || isLoading} // disable button when no file or experiment ID or loading
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Upload ZIP File & Generate Report"
            )}
          </StyledButton>

          {reportGenerated && (
            <StyledBox>
              <IconButton color="success" onClick={getReport}>
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

export default ZipUpload;
