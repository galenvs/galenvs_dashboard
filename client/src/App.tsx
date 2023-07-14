import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  const [reportUrl, setReportUrl] = useState<string>('');

  return (
    <div className="app">
      <Navbar />
      <FileUpload setReportUrl={setReportUrl} />
   </div>
  );
};

export default App;
