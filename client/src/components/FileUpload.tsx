// FileUpload Component
// Author: Jonathan Haddad
// Date created: 20-07-2023

/* Description: This TypeScript React component is used for uploading experiment-related files and generating a report. 
It provides a form for the user to enter an experiment id and to upload a barcode summary file, an amplicon summary file, and multiple depth files. 
When the user submits the form, the component sends a multipart form data request to the server, receives the id of the saved experiment, and displays a download button for the generated report.
The component also handles validation (checking that all required fields are filled and that the uploaded files have the correct extensions), progress indication, and error handling.
*/



import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Alert,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import {
  StyledContainer,
  StyledFormControl,
  StyledTypography,
  StyledButton,
  StyledBox,
} from "../style/styles";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FileUpload: React.FC<{
  setReportUrl: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setReportUrl }) => {
  const [barcodeSummary, setBarcodeSummary] = useState<File | null>(null);
  const [ampliconSummary, setAmpliconSummary] = useState<File | null>(null);
  const [depthFiles, setDepthFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [experimentId, setExperimentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Function to handle changes in the experiment ID input field
  const onExperimentIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentId(event.target.value.replace(/\s/g, ""));
  };

 // Function to handle changes in the file drop zones
  const onFileChange = (
    files: File[],
    type: "barcodeSummary" | "ampliconSummary" | "depthFiles"
  ) => {
    switch (type) {
      case "barcodeSummary":
        setBarcodeSummary(files[0]);
        break;
      case "ampliconSummary":
        setAmpliconSummary(files[0]);
        break;
      case "depthFiles":
        setDepthFiles(files);
        break;
      default:
        break;
    }
  };

 // Function to handle the file upload process
  const onFileUpload = async () => {
    // Validation
    if (
      !barcodeSummary ||
      !ampliconSummary ||
      depthFiles.length === 0 ||
      !experimentId
    ) {
      alert("Please select all required files and enter experiment id.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("experimentId", experimentId);
    formData.append("barcodeSummary", barcodeSummary);
    formData.append("ampliconSummary", ampliconSummary);
    depthFiles.forEach((file) => {
      formData.append("depthFiles", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      setExperimentId(response.data._id);
      setReportUrl(response.data.reportUrl);
      setSuccess(
        "Files uploaded successfully. Simply click on the download icon to retrieve the report."
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
      const reportUrl = `http://localhost:5000/api/${experimentId}/report`;
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
      <Grid container justifyContent="center" alignItems="center" spacing={3}>
        <Link to="/zip-upload">
          <StyledButton variant="contained" color="primary" >
            Upload ZIP File <ArrowForwardIosIcon fontSize="inherit" />
          </StyledButton>
        </Link>
        <StyledContainer maxWidth="md">
          <StyledFormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          >
            <InputLabel htmlFor="experimentId">Experiment ID</InputLabel>
            <OutlinedInput
              id="experimentId"
              value={experimentId}
              onChange={onExperimentIdChange}
              label="Experiment ID"
            />
          </StyledFormControl>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledTypography variant="h6" align="center">
                Barcode Summary
              </StyledTypography>
              <DropzoneArea
                acceptedFiles={[".xls"]}
                filesLimit={1}
                dropzoneText={
                  <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                    Upload your Barcode Summary file (.xls) here
                  </span>
                }
                showPreviewsInDropzone={true}
                useChipsForPreview={true}
                previewGridProps={{
                  container: { spacing: 1, direction: "row" },
                }}
                onChange={(files) => onFileChange(files, "barcodeSummary")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTypography variant="h6" align="center">
                Amplicon Summary
              </StyledTypography>
              <DropzoneArea
                acceptedFiles={[".xls"]}
                filesLimit={1}
                dropzoneText={
                  <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                    Upload your Amplicon Summary file (.xls) here
                  </span>
                }
                showPreviewsInDropzone={true}
                useChipsForPreview={true}
                previewGridProps={{
                  container: { spacing: 1, direction: "row" },
                }}
                onChange={(files) => onFileChange(files, "ampliconSummary")}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTypography variant="h6" align="center">
                Depth Files
              </StyledTypography>
              <DropzoneArea
                acceptedFiles={[".xls"]}
                dropzoneText={
                  <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                    Upload Depth Files here
                  </span>
                }
                showPreviewsInDropzone={true}
                useChipsForPreview={true}
                previewGridProps={{
                  container: { spacing: 1, direction: "row" },
                }}
                filesLimit={50}
                onChange={(files) => onFileChange(files, "depthFiles")}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledBox
                sx={{ display: "flex", justifyContent: "center", gap: "1rem" }}
              >
                <StyledButton
                  variant="contained"
                  onClick={onFileUpload}
                  disabled={
                    isLoading ||
                    !barcodeSummary ||
                    !ampliconSummary ||
                    depthFiles.length === 0 ||
                    experimentId.trim().length === 0
                  }
                >
                            {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Generate Report"
          )}
                  

                </StyledButton>

                {reportGenerated && (
                  <IconButton
                    aria-label="download report"
                    color="success"
                    onClick={getReport}
                    disabled={!experimentId || isLoading}
                  >
                    <DownloadIcon />
                  </IconButton>
                )}
              </StyledBox>


              {error && <Alert severity="error">{error}</Alert>}

              {success && <Alert severity="success">{success}</Alert>}
            </Grid>
          </Grid>
        </StyledContainer>
      </Grid>
    </Container>
  );
};

export default FileUpload;
