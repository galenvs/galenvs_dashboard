import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import LandingPage from './pages/LandingPage'; 
import Records from './pages/ngs_pages/Records'; 
import TableFilter from "./pages/ngs_pages/TableFilter";
import ReportGenerator from './pages/ngs_pages/ReportGenerator';
import PathogenPredictors from './pages/predictors_pages/PathogenPredictors';
// import BloodPredictors from './pages/predictors_pages/BloodPredictors';


import React, { useState } from 'react';

const App: React.FC = () => {
   

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/ngs/records" element={<Records />} />
                    <Route path="/ngs/tableFilter" element={<TableFilter />} />
                    <Route path="/ngs/reportGenerator" element={<ReportGenerator />} />
                    <Route path="/predictor/pathogen" element={<PathogenPredictors />} />
                    {/* <Route path="/predictor/blood" element={<BloodPredictors />} /> */}
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
