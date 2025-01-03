import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProfessionalDashboard from './components/Professional/Dashboard';
import PatientDashboard from './components/Patient/Dashboard';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
