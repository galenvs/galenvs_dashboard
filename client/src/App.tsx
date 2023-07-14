import React, { useState } from 'react';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [reportUrl, setReportUrl] = useState<string>('');

  return (
    <div className="app">
      <h1>TSV to PDF Report Generator</h1>
      <FileUpload setReportUrl={setReportUrl} />
      {reportUrl && <a href={reportUrl}>Download Report</a>}
    </div>
  );
};

export default App;
