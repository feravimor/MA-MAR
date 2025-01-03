import React, { useState } from "react";
import axios from "axios";

const ReportsManagementPage = () => {
    const [metrics, setMetrics] = useState({
        alerts_by_priority: true,
        resolved_alerts: true,
        average_resolution_time: false,
        unresolved_alerts: false, // New metric
    });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [format, setFormat] = useState("PDF");

    const handleGenerateReport = async () => {
        try {
            const selectedMetrics = Object.keys(metrics).filter((key) => metrics[key]);
            const response = await axios.post("http://localhost:8000/reports/generate", {
                metrics: selectedMetrics,
                start_date: startDate,
                end_date: endDate,
                format: format,
            }, { responseType: 'blob' });

            // Create a URL for the blob and trigger download
            const blob = new Blob([response.data], { type: format === "PDF" ? "application/pdf" : "text/csv" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `custom_report.${format.toLowerCase()}`;
            link.click();
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    return (
        <div>
            <h1>Generate Reports</h1>
            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>
            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>
            <h2>Select Metrics</h2>
            <label>
                <input
                    type="checkbox"
                    checked={metrics.alerts_by_priority}
                    onChange={(e) => setMetrics({ ...metrics, alerts_by_priority: e.target.checked })}
                />
                Alerts by Priority
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={metrics.resolved_alerts}
                    onChange={(e) => setMetrics({ ...metrics, resolved_alerts: e.target.checked })}
                />
                Resolved Alerts
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={metrics.average_resolution_time}
                    onChange={(e) => setMetrics({ ...metrics, average_resolution_time: e.target.checked })}
                />
                Average Resolution Time
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={metrics.unresolved_alerts}
                    onChange={(e) => setMetrics({ ...metrics, unresolved_alerts: e.target.checked })}
                />
                Unresolved Alerts
            </label>
            <h2>Select Format</h2>
            <label>
                <input
                    type="radio"
                    value="PDF"
                    checked={format === "PDF"}
                    onChange={(e) => setFormat(e.target.value)}
                />
                PDF
            </label>
            <label>
                <input
                    type="radio"
                    value="CSV"
                    checked={format === "CSV"}
                    onChange={(e) => setFormat(e.target.value)}
                />
                CSV
            </label>
            <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
    );
};

export default ReportsManagementPage;
