import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Reports() {
  const [reportType, setReportType] = useState("financial");
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [chartData, setChartData] = useState(null);

  const filterDataByDateRange = (data) => {
    const { start, end } = dateRange;
    if (!start || !end) return data;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return data.filter((row, index) => {
      if (index === 0) return true; // Keep header row
      const date = new Date(row[3]); // Assuming date is in the 4th column
      return date >= startDate && date <= endDate;
    });
  };

  const generateReport = () => {
    // Mock data for different report types
    let data;
    if (reportType === "financial") {
      data = [
        ["Month", "Income", "Expenses", "Profit"],
        ["January", "12000", "8000", "4000"],
        ["February", "15000", "9000", "6000"],
      ];
      setChartData({
        labels: ["January", "February"],
        datasets: [
          {
            label: "Income",
            data: [12000, 15000],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Expenses",
            data: [8000, 9000],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      });
    } else if (reportType === "patient") {
      data = [
        ["Patient Name", "Treatment", "Cost", "Date"],
        ["John Doe", "Root Canal", "2000", "2024-01-15"],
        ["Jane Smith", "Teeth Cleaning", "500", "2024-01-20"],
      ];
      data = filterDataByDateRange(data);
      setChartData({
        labels: ["Root Canal", "Teeth Cleaning"],
        datasets: [
          {
            data: [2000, 500],
            backgroundColor: ["#36A2EB", "#FF6384"],
          },
        ],
      });
    } else if (reportType === "cost") {
      data = [
        ["Item", "Cost", "Date"],
        ["X-ray", "100", "2024-01-10"],
        ["MRI", "500", "2024-01-15"],
      ];
      data = filterDataByDateRange(data);
      setChartData({
        labels: ["X-ray", "MRI"],
        datasets: [
          {
            data: [100, 500],
            backgroundColor: ["#FFCE56", "#FF6384"],
          },
        ],
      });
    }

    setReportData(data);
  };

  const downloadReportCSV = () => {
    if (!reportData) {
      alert("Please generate a report first.");
      return;
    }

    const csvContent = reportData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${reportType}_report.csv`);
  };

  const downloadReportPDF = () => {
    if (!reportData) {
      alert("Please generate a report first.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Report", 14, 10);
    doc.autoTable({
      head: [reportData[0]],
      body: reportData.slice(1),
    });
    doc.save(`${reportType}_report.pdf`);
  };

  const handleDateChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value });
  };

  return (
    <div className="reports-container">
      <h1>Generate Reports</h1>
      <div className="report-options">
        <label>Select Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="financial">Financial Report</option>
          <option value="patient">Patient Report</option>
          <option value="cost">Cost Report</option>
        </select>
      </div>
      <div className="date-range">
        <label>Start Date:</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => handleDateChange("start", e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => handleDateChange("end", e.target.value)}
        />
      </div>
      <button onClick={generateReport}>Generate Report</button>
      <button onClick={downloadReportCSV} disabled={!reportData}>
        Download CSV
      </button>
      <button onClick={downloadReportPDF} disabled={!reportData}>
        Download PDF
      </button>
      {reportData && (
        <div className="report-preview">
          <h2>Report Preview</h2>
          <table>
            <thead>
              <tr>
                {reportData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chartData && (
        <div className="chart-preview">
          <h2>Data Visualization</h2>
          {reportType === "financial" ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
