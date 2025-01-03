import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

function FinancialReports() {
  const [reportData, setReportData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    // Simulate fetching financial report data
    const data = [
      ["Month", "Income", "Expenses", "Profit"],
      ["January", "12000", "8000", "4000"],
      ["February", "15000", "9000", "6000"],
    ];
    setReportData(data);

    const chart = {
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
        {
          label: "Profit",
          data: [4000, 6000],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    };
    setChartData(chart);
  }, []);

  const filterDataByDateRange = (data) => {
    const { start, end } = dateRange;
    if (!start || !end) return data;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return data.filter((row, index) => {
      if (index === 0) return true; // Keep header row
      const date = new Date(row[0]); // Assuming date is in the 1st column
      return date >= startDate && date <= endDate;
    });
  };

  const downloadReportCSV = () => {
    if (!reportData) {
      alert("No report data available.");
      return;
    }

    const filteredData = filterDataByDateRange(reportData);
    const csvContent = filteredData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "financial_report.csv");
  };

  const downloadReportPDF = () => {
    if (!reportData) {
      alert("No report data available.");
      return;
    }

    const filteredData = filterDataByDateRange(reportData);
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 10);
    doc.autoTable({
      head: [filteredData[0]],
      body: filteredData.slice(1),
    });
    doc.save("financial_report.pdf");
  };

  const handleDateChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value });
  };

  return (
    <div className="financial-reports-container">
      <h1>Financial Reports</h1>
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
      <div className="chart-container">
        {chartData && (
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
        )}
      </div>
      <button onClick={downloadReportCSV}>Download CSV</button>
      <button onClick={downloadReportPDF}>Download PDF</button>
      {reportData && (
        <div className="report-preview">
          <h2>Report Data</h2>
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
    </div>
  );
}

export default FinancialReports;
