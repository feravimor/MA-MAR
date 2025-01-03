import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProfessionalDashboard() {
  const [stats, setStats] = useState({
    topTreatment: "Root Canal",
    monthlyIncome: 12000,
    criticalInventory: ["Anesthetic", "Gloves"],
  });

  const [alerts, setAlerts] = useState([
    "Low stock on Anesthetic",
    "Review financial report for discrepancies",
  ]);

  const [recentActivities, setRecentActivities] = useState([
    "Patient John Doe checked in",
    "Inventory updated",
    "Financial report generated",
  ]);

  useEffect(() => {
    // Simulate fetching data for dashboard
    console.log("Fetching dashboard data...");
  }, []);

  const refreshDashboard = () => {
    console.log("Refreshing dashboard data...");
    // Simulate refreshing data
  };

  return (
    <div className="professional-dashboard-container">
      <h1>Welcome to Your Professional Dashboard</h1>

      {/* Statistics Section */}
      <div className="stats-container">
        <h2>Key Statistics</h2>
        <p><strong>Top Treatment:</strong> {stats.topTreatment}</p>
        <p><strong>Monthly Income:</strong> ${stats.monthlyIncome}</p>
        <p><strong>Critical Inventory:</strong> {stats.criticalInventory.join(", ")}</p>
      </div>

      {/* Alerts Section */}
      <div className="alerts-container">
        <h2>Alerts</h2>
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      </div>

      {/* Recent Activities Section */}
      <div className="recent-activities-container">
        <h2>Recent Activities</h2>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Links Section */}
      <div className="links-container">
        <h2>Quick Access</h2>
        <Link to="/treatments">Manage Treatments</Link>
        <Link to="/financial-reports">Financial Reports</Link>
        <Link to="/inventory">Manage Inventory</Link>
        <Link to="/settings">Settings</Link>
      </div>

      {/* Refresh Button */}
      <button onClick={refreshDashboard}>Refresh Dashboard</button>
    </div>
  );
}

export default ProfessionalDashboard;
