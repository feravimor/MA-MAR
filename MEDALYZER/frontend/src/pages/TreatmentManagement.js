import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchWithCache, debounce } from "../utils/performanceOptimizations";

function TreatmentManagement() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      const data = await fetchWithCache("/api/treatments");
      setTreatments(data);
    };

    fetchTreatments();
  }, []);

  const addTreatment = debounce((newTreatment) => {
    setTreatments([...treatments, newTreatment]);
  }, 300);

  const exportTreatmentsCSV = debounce(() => {
    const csvContent = [
      ["Name", "Base Cost", "Sale Price", "Description", "Keywords"],
      ...treatments.map((treatment) => [
        treatment.name,
        treatment.baseCost,
        treatment.salePrice,
        treatment.description,
        treatment.keywords.join(", "),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "treatments.csv");
  }, 300);

  const exportTreatmentsPDF = () => {
    const doc = new jsPDF();
    doc.text("Treatment Report", 14, 10);
    doc.autoTable({
      head: [["Name", "Base Cost", "Sale Price", "Description", "Keywords"]],
      body: treatments.map((treatment) => [
        treatment.name,
        treatment.baseCost,
        treatment.salePrice,
        treatment.description,
        treatment.keywords.join(", "),
      ]),
    });
    doc.save("treatments.pdf");
  };

  const exportTreatmentsExcel = debounce(() => {
    const worksheet = XLSX.utils.json_to_sheet(
      treatments.map((treatment) => ({
        Name: treatment.name,
        "Base Cost": treatment.baseCost,
        "Sale Price": treatment.salePrice,
        Description: treatment.description,
        Keywords: treatment.keywords.join(", "),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Treatments");
    XLSX.writeFile(workbook, "treatments.xlsx");
  }, 300);

  return (
    <div className="treatment-management-container">
      <h1>Treatment Management</h1>
      <div className="add-treatment-form">
        <button onClick={() => addTreatment({
          name: "New Treatment",
          baseCost: 100,
          salePrice: 150,
          description: "Sample Description",
          keywords: ["sample", "test"],
        })}>
          Add Treatment
        </button>
      </div>
      <div className="treatment-list">
        <h2>Current Treatments</h2>
        <ul>
          {treatments.map((treatment, index) => (
            <li key={index}>
              {treatment.name} - Base Cost: ${treatment.baseCost}, Sale Price: ${treatment.salePrice}
              <p>{treatment.description}</p>
              <small>Keywords: {treatment.keywords.join(", ")}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className="export-buttons">
        <button onClick={exportTreatmentsCSV}>Export CSV</button>
        <button onClick={exportTreatmentsPDF}>Export PDF</button>
        <button onClick={exportTreatmentsExcel}>Export Excel</button>
      </div>
    </div>
  );
}

export default TreatmentManagement;