import React, { useState } from "react";
import FileUpload from "../components/ReportGenrators/FileUpload";
import ZipUpload from "../components/ReportGenrators/ZipUpload";
import { MenuItem } from "@mui/material";
import { StyledContainer, StyledBox, StyledSelect } from "../style/styles";

const ReportGenrator: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("zipUpload"); 
  const [reportUrl, setReportUrl] = useState<string>('');

  const handleOptionChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <StyledContainer>
      <StyledSelect value={selectedOption} onChange={handleOptionChange}>
        <MenuItem value="zipUpload">Zip Upload</MenuItem>
        <MenuItem value="fileUpload">File Upload</MenuItem>
      </StyledSelect>

      {selectedOption === "zipUpload" ? <ZipUpload setReportUrl={setReportUrl}  /> : <FileUpload setReportUrl={setReportUrl} />}

      {/* Your other components and elements go here */}
    </StyledContainer>
  );
};

export default ReportGenrator;
