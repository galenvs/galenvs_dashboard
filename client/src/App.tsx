import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Records from './pages/Records'; 
import TableFilter from "./pages/TableFilter";
import Navbar from './components/Navbar/Navbar';
import ReportGenrator from './pages/ReportGenrator'
import React, { useState } from 'react';

const App: React.FC = () => {
   

    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/records" element={<Records />} />
                    <Route path="/tableFilter" element={<TableFilter />} />
                    <Route path="/" element={<ReportGenrator />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
