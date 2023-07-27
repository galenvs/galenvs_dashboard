import React, { useState } from "react";
import FileUpload from "../components/ReportGenrators/FileUpload";
import ZipUpload from "../components/ReportGenrators/ZipUpload";
import { MenuItem } from "@mui/material";
import { StyledContainer, StyledBox, StyledSelect } from "../style/styles";

const ReportGenrator: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("zipUpload"); // Set the default selection to "zipUpload"

  const handleOptionChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <StyledContainer>
      <StyledSelect value={selectedOption} onChange={handleOptionChange}>
        <MenuItem value="zipUpload">Zip Upload</MenuItem>
        <MenuItem value="fileUpload">File Upload</MenuItem>
      </StyledSelect>

      {selectedOption === "zipUpload" ? <ZipUpload /> : <FileUpload />}

      {/* Your other components and elements go here */}
    </StyledContainer>
  );
};

export default ReportGenrator;
