import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";

function PredictiveAnalysis() {
    const [financialData, setFinancialData] = useState(null);
    const [treatmentDemand, setTreatmentDemand] = useState(null);

    useEffect(() => {
        // Simulate fetching data for predictive analysis
        const fetchData = async () => {
            const financialMockData = {
                labels: ["January", "February", "March", "April"],
                datasets: [
                    {
                        label: "Projected Income",
                        data: [12000, 15000, 18000, 20000],
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        fill: true,
                    },
                    {
                        label: "Projected Expenses",
                        data: [8000, 10000, 11000, 13000],
                        borderColor: "rgba(255, 99, 132, 1)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        fill: true,
                    },
                ],
            };
            setFinancialData(financialMockData);

            const demandMockData = {
                labels: ["Root Canal", "Teeth Cleaning", "Whitening", "Implants"],
                datasets: [
                    {
                        label: "Projected Demand",
                        data: [120, 90, 150, 75],
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                        ],
                    },
                ],
            };
            setTreatmentDemand(demandMockData);
        };

        fetchData();
    }, []);

    return (
        <div className="predictive-analysis-container">
            <h1>Predictive Analysis</h1>
            <div className="financial-projection">
                <h2>Financial Projections</h2>
                {financialData ? (
                    <Line
                        data={financialData}
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
                    <p>Loading financial data...</p>
                )}
            </div>
            <div className="demand-projection">
                <h2>Treatment Demand Projections</h2>
                {treatmentDemand ? (
                    <Bar
                        data={treatmentDemand}
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
                    <p>Loading treatment demand data...</p>
                )}
            </div>
        </div>
    );
}

export default PredictiveAnalysis;