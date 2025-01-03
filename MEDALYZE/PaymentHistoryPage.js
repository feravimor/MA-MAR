import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // Import useHistory

const PaymentHistoryPage = ({ userId }) => {
    const [payments, setPayments] = useState([]);
    const history = useHistory(); // Initialize useHistory

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/payments`);
                setPayments(response.data);
            } catch (error) {
                console.error("Error fetching payment history:", error);
            }
        };

        fetchPaymentHistory();
    }, [userId]);

    const handleDownloadInvoice = async (paymentId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/payments/${paymentId}/invoice`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `invoice_${paymentId}.pdf`;
            link.click();
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    const handleGenerateReport = async (format) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/reports/generate`,
                {
                    specialist_id: userId,
                    start_date: "2023-01-01", // Example start date
                    end_date: "2023-12-31", // Example end date
                    format: format,
                },
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: format === "PDF" ? "application/pdf" : "text/csv" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `report_${userId}.${format.toLowerCase()}`;
            link.click();
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    const navigateToReportVisualization = () => {
        history.push(`/report-visualization/${userId}`);
    };

    return (
        <div>
            <h1>Payment History</h1>
            <button onClick={() => handleGenerateReport("CSV")}>Generate CSV Report</button>
            <button onClick={() => handleGenerateReport("PDF")}>Generate PDF Report</button>
            <button onClick={navigateToReportVisualization}>Visualize Reports</button>
            <ul>
                {payments.map((payment) => (
                    <li key={payment.id}>
                        <p>Date: {payment.date}</p>
                        <p>Amount: ${payment.amount}</p>
                        <p>Method: {payment.method}</p>
                        <button onClick={() => handleDownloadInvoice(payment.id)}>
                            Download Invoice
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentHistoryPage;
