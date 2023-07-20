import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import ZipUpload from './components/ZipUpload'; // make sure to create this component
import Navbar from './components/Navbar/Navbar';
import React, { useState } from 'react';

const App: React.FC = () => {
    const [reportUrl, setReportUrl] = useState<string>('');

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/zip-upload" element={<ZipUpload setReportUrl={setReportUrl} />} /> 
                    <Route path="/" element={<FileUpload setReportUrl={setReportUrl} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
