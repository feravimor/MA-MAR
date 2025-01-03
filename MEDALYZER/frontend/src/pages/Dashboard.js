import React from "react";
import { Link } from "react-router-dom";

// medalyzer_frontend/src/pages/Dashboard.js

function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Medalyzer</h1>
            <div className="links-container">
                <Link to="/treatments">Manage Treatments</Link>
                <Link to="/reports">View Reports</Link>
                <Link to="/inventory">Manage Inventory</Link>
            </div>
        </div>
    );
}

export default Dashboard;