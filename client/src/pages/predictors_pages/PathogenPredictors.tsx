import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';

const PathogenPredictors: React.FC = () => {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // TODO: Send formData to the backend for prediction
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Pathogen Predictors
      </Typography>

      <Grid container spacing={3}>
        {/* This is just a sample; you'll iterate over the headers to generate these fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Sample Header 1"
            name="header1"
            value={formData.header1 || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Sample Header 2"
            name="header2"
            value={formData.header2 || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Add other fields based on the headers of the CSV */}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Predict
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PathogenPredictors;
