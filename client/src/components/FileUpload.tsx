import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC<{ setReportUrl: React.Dispatch<React.SetStateAction<string>> }> = ({ setReportUrl }) => {
  const [barcodeSummary, setBarcodeSummary] = useState<File | null>(null);
  const [ampliconSummary, setAmpliconSummary] = useState<File | null>(null);
  const [depthFiles, setDepthFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [experimentId, setExperimentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  // handle input changes
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExperimentId(event.target.value);
  };
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'barcodeSummary':
        setBarcodeSummary(event.target.files ? event.target.files[0] : null);
        break;
      case 'ampliconSummary':
        setAmpliconSummary(event.target.files ? event.target.files[0] : null);
        break;
      case 'depthFiles':
        setDepthFiles(event.target.files);
        break;
      default:
        break;
    }
  };

  const onFileUpload = async () => {
    if (!barcodeSummary || !ampliconSummary || !depthFiles || !experimentId) {
      alert('Please select all required files and enter experiment id.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('experimentId', experimentId);
    formData.append('barcodeSummary', barcodeSummary);
    formData.append('ampliconSummary', ampliconSummary);
    for (let i = 0; i < depthFiles.length; i++) {
      formData.append('depthFiles', depthFiles[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setExperimentId(response.data._id);
      setReportUrl(response.data.reportUrl);
      setSuccess('Files uploaded successfully. Click "Generate Report" to continue.');
    } catch (error) {
      setError('An error occurred while uploading the files. Please try again.');
      console.error(error);
    }

    setIsLoading(false);
  };

  const onGenerateReport = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await axios.get(`http://localhost:5000/api/${experimentId}/report`);
      setSuccess('Report generated successfully.');
    } catch (error) {
      setError(`An error occurred while generating the report. Please try again`);
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <label htmlFor="experimentId">Experiment ID:</label>
      <input type="text" name="experimentId" id="experimentId" onChange={onInputChange} />

      <label htmlFor="barcodeSummary">Barcode Summary:</label>
      <input type="file" name="barcodeSummary" id="barcodeSummary" onChange={onFileChange} />
      
      <label htmlFor="ampliconSummary">Amplicon Summary:</label>
      <input type="file" name="ampliconSummary" id="ampliconSummary" onChange={onFileChange} />
      
      <label htmlFor="depthFiles">Depth Files:</label>
      <input type="file" name="depthFiles" id="depthFiles" multiple onChange={onFileChange} />
      
      <button onClick={onFileUpload}>Upload!</button>
      <button onClick={onGenerateReport} disabled={!experimentId}>Generate Report</button>
      
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      
      {experimentId && !isLoading && <a href={`http://localhost:5000/api/${experimentId}/report`} download>Download Report</a>}
    </div>
  );
};

export default FileUpload;
