import React, { useState, useEffect } from "react";
import axios from "axios";

const TreatmentHistoryPage = ({ userId }) => {
    const [treatments, setTreatments] = useState([]);

    useEffect(() => {
        const fetchTreatmentHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/treatment-history`);
                setTreatments(response.data);
            } catch (error) {
                console.error("Error fetching treatment history:", error);
            }
        };

        fetchTreatmentHistory();
    }, [userId]);

    const handleDownloadSummary = async (treatmentId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/treatments/${treatmentId}/summary`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `treatment_${treatmentId}_summary.pdf`;
            link.click();
        } catch (error) {
            console.error("Error downloading treatment summary:", error);
        }
    };

    return (
        <div>
            <h1>Treatment History</h1>
            <ul>
                {treatments.map((treatment) => (
                    <li key={treatment.id}>
                        <p>Date: {treatment.date}</p>
                        <p>Specialist: {treatment.specialistName}</p>
                        <p>Description: {treatment.description}</p>
                        <button onClick={() => handleDownloadSummary(treatment.id)}>
                            Download Summary
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TreatmentHistoryPage;
