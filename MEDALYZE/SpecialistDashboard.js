import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const SpecialistDashboard = ({ specialistId }) => {
    const [metrics, setMetrics] = useState({
        totalPatients: 0,
        totalEarnings: 0,
        keywordsSearched: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/specialists/${specialistId}/metrics`);
                setMetrics(response.data);
            } catch (error) {
                setError("Error fetching metrics");
                console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [specialistId]);

    useEffect(() => {
        if (metrics.keywordsSearched.length > 0) {
            const ctx = document.getElementById("keywordsChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: metrics.keywordsSearched.map((kw) => kw.keyword),
                    datasets: [
                        {
                            label: "Search Frequency",
                            data: metrics.keywordsSearched.map((kw) => kw.frequency),
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }, [metrics.keywordsSearched]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Specialist Dashboard</h1>

            <h2>Metrics</h2>
            <p>Total Patients: {metrics.totalPatients}</p>
            <p>Total Earnings: ${metrics.totalEarnings}</p>

            <h2>Search Keywords</h2>
            <canvas id="keywordsChart"></canvas>
        </div>
    );
};

export default SpecialistDashboard;
