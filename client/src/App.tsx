import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import ZipUpload from './components/ZipUpload'; 
import Records from './components/Records'; 
import Navbar from './components/Navbar/Navbar';
import React, { useState } from 'react';

const App: React.FC = () => {
    const [reportUrl, setReportUrl] = useState<string>('');

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<ZipUpload setReportUrl={setReportUrl} />} /> 
                    <Route path="/fileUpload" element={<FileUpload setReportUrl={setReportUrl} />} />
                    <Route path="/records" element={<Records />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
