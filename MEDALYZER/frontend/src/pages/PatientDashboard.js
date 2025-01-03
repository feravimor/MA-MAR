import React from "react";
import { Link } from "react-router-dom";

function PatientDashboard() {
  return (
    <div className="patient-dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="links-container">
        <Link to="/appointments">Manage Appointments</Link>
        <Link to="/history">View Medical History</Link>
        <Link to="/payments">View Payments</Link>
        <Link to="/rewards">Rewards System</Link>
        <Link to="/reports">View Reports</Link> {/* Added link to Reports page */}
      </div>
    </div>
  );
}

export default PatientDashboard;
