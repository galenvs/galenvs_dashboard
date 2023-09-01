import React, { useState } from "react";
import axios from "axios";
import { Grid, FormControl, MenuItem } from "@mui/material";
import { StyledTypography, StyledButton, StyledTextField, StyledContainer, StyledPaper } from "../../style/styles";

const PathogenPredictors: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [predictionResult, setPredictionResult] = useState<string | null>(null); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, formData);
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error making prediction:", error);
      setPredictionResult("Error making prediction");
    }
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4" align="center" gutterBottom>
        Pathogen Predictor
      </StyledTypography>
      <Grid container spacing={4}  style={{ textAlign: "center", marginTop: '20px' }}>
      {/* Lysis Information */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Lysis Information</StyledTypography>

        <FormControl fullWidth variant="outlined">
          <StyledTextField onChange={(e) => setValue(e.target.value)} select label="Lysis">
            {/* Options will be fetched from the server */}
            <MenuItem value="Option1">Option 1</MenuItem>
            <MenuItem value="Option2">Option 2</MenuItem>
          </StyledTextField>
        </FormControl>

        <StyledTextField fullWidth variant="outlined" label="Lysis Temperature" name="lysis_temp" value={formData.lysis_temp || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>

      {/* Target Group */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Target</StyledTypography>
        <StyledTextField fullWidth variant="outlined" label="Target Type" name="target_type" value={formData.target_type || ""} onChange={handleInputChange} />
        <StyledTextField fullWidth variant="outlined" label="Target Name" name="target_name" value={formData.target_name || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>

      {/* Pretreatment Group */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Pretreatment</StyledTypography>

        <StyledTextField fullWidth variant="outlined" label="Pretreatment Buffer" name="pretreatment_buffer" value={formData.pretreatment_buffer || ""} onChange={handleInputChange} />

        <StyledTextField fullWidth variant="outlined" label="Pretreatment Heating" name="pretreatment_heating" value={formData.pretreatment_heating || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>
      {/* Bead Group */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Bead</StyledTypography>
        <StyledTextField fullWidth variant="outlined" label="Beads" name="beads" value={formData.beads || ""} onChange={handleInputChange} />
        <StyledTextField fullWidth variant="outlined" label="Bead Concentration (mg/ml)" name="bead_conc_mg_ml" value={formData.bead_conc_mg_ml || ""} onChange={handleInputChange} />

        <StyledTextField fullWidth variant="outlined" label="Bead Beating" name="bead_beating" value={formData.bead_beating || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>

      {/* Sample Group */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Sample</StyledTypography>
        <StyledTextField fullWidth variant="outlined" label="Sample Type" name="sample_type" value={formData.sample_type || ""} onChange={handleInputChange} />
        <StyledTextField fullWidth variant="outlined" label="Sample Name" name="sample_name" value={formData.sample_name || ""} onChange={handleInputChange} />
        <StyledTextField fullWidth variant="outlined" label="Sample Volume" name="sample_volume" value={formData.sample_volume || ""} onChange={handleInputChange} />

        <StyledTextField fullWidth variant="outlined" label="Concentration" name="concentration" value={formData.concentration || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>

      {/* Elution Group */}
      <Grid item xs={12} sm={6}>
      <StyledPaper>
        <StyledTypography variant="h6">Elution</StyledTypography>

        <FormControl fullWidth variant="outlined">
          <StyledTextField value={formData.wash1 || ""} onChange={handleInputChange} select label="Wash 1">
            <MenuItem value="Option1">Option 1</MenuItem>
            <MenuItem value="Option2">Option 2</MenuItem>
          </StyledTextField>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <StyledTextField value={formData.wash2 || ""} onChange={handleInputChange} select label="Wash 2">
            <MenuItem value="Option1">Option 1</MenuItem>
            <MenuItem value="Option2">Option 2</MenuItem>
          </StyledTextField>
        </FormControl>

        <StyledTextField fullWidth variant="outlined" label="Elution" name="elution" value={formData.elution || ""} onChange={handleInputChange} />
        <StyledTextField fullWidth variant="outlined" label="Elution Temperature" name="elution_temp" value={formData.elution_temp || ""} onChange={handleInputChange} />
      </StyledPaper>
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12} style={{ textAlign: "center", marginTop: '20px' }}>
          <StyledButton variant="contained" onClick={handleSubmit}>
            Predict
          </StyledButton>
        </Grid>
      </Grid>
      {predictionResult && <div>Prediction Result: {predictionResult}</div>}
    </StyledContainer>
  );
};

export default PathogenPredictors;
