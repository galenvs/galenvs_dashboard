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
  const [reportGenerated, setReportGenerated] = useState(false); // New state to track report generation

  // handle input changes
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentId(event.target.value.replace(/\s/g, ''));
  };

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

  const onFileUpload = async () => {
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
        'Files uploaded successfully. Simply click on the download icon to retrieve the report.'
      );
      setReportGenerated(true); // Set reportGenerated to true on successful upload
    } catch (error) {
      setError(
        "An error occurred while uploading the files. Please try again."
      );
      console.error(error);
    }

    setIsLoading(false);
  };

  const getReport = async () => {
    setIsLoading(true);
    try {
      const reportUrl = `http://localhost:5000/api/${experimentId}/report`;
      const response = await axios.get(reportUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf'); // adjust the file extension according to your case
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (  
    <Container maxWidth="md" sx={{ marginTop: "2rem", marginBottom : "2rem" }}>
    
    <Grid container justifyContent="center" alignItems="center" spacing={3}>
      <StyledContainer maxWidth="md">
        <StyledFormControl fullWidth variant="outlined" sx={{ marginBottom: '1rem' }}>
          <InputLabel htmlFor="experimentId">Experiment ID</InputLabel>
          <OutlinedInput
            id="experimentId"
            value={experimentId}
            onChange={onInputChange}
            label="Experiment ID"
          />
        </StyledFormControl>
  
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTypography variant="h6" align="center">
              Barcode Summary
            </StyledTypography>
            <StyledTypography variant="body1" align="center">
              Upload your Barcode Summary file (.xls) here:
            </StyledTypography>
            <DropzoneArea
              acceptedFiles={[".xls"]}
              filesLimit={1}
              dropzoneText={
                <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                  Upload a Barcode Summary file here
                </span>
              }
              showPreviewsInDropzone={true}
              useChipsForPreview={true}
              previewGridProps={{ container: { spacing: 1, direction: "row" } }}
              onChange={(files) => onFileChange(files, "barcodeSummary")}
            />
          </Grid>
  
          <Grid item xs={12} md={6}>
            <StyledTypography variant="h6" align="center">
              Amplicon Summary
            </StyledTypography>
            <StyledTypography variant="body1" align="center">
              Upload your Amplicon Summary file (.xls) here:
            </StyledTypography>
            <DropzoneArea
              acceptedFiles={[".xls"]}
              filesLimit={1}
              dropzoneText={
                <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                  Upload Amplicon Summary file here
                </span>
              }
              showPreviewsInDropzone={true}
              useChipsForPreview={true}
              previewGridProps={{ container: { spacing: 1, direction: "row" } }}
              onChange={(files) => onFileChange(files, "ampliconSummary")}
            />
          </Grid>
  
          <Grid item xs={12}>
            <StyledTypography variant="h6" align="center">
              Depth Files
            </StyledTypography>
            <StyledTypography variant="body1" align="center">
              Upload your Depth Files (.tsv) here:
            </StyledTypography>
            <DropzoneArea
              acceptedFiles={[".tsv"]}
              dropzoneText={
                <span style={{ fontSize: "18px", color: "#C2C2C2" }}>
                  Upload Depth Files here
                </span>
              }
              showPreviewsInDropzone={true}
              useChipsForPreview={true}
              previewGridProps={{ container: { spacing: 1, direction: "row" } }}
              filesLimit={50}
              onChange={(files) => onFileChange(files, "depthFiles")}
            />
          </Grid>
  
          <Grid item xs={12}>
            <StyledBox sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
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
                Generate Report
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
  
            {isLoading && <CircularProgress sx={{ display: 'block', margin: '1rem auto' }} />}
  
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
