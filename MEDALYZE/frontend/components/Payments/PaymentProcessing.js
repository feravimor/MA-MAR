import React, { useState } from "react";
import axios from "axios";

const PaymentProcessing = () => {
    const [paymentData, setPaymentData] = useState({
        amount: "",
        details: "",
    });
    const [paymentResult, setPaymentResult] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handlePayment = async () => {
        try {
            const response = await axios.post("http://localhost:8000/payments/process", paymentData);
            setPaymentResult(response.data);
        } catch (error) {
            setError("Error processing payment");
            console.error("Error processing payment:", error);
        }
    };

    const downloadInvoice = async (paymentId) => {
        try {
            const response = await axios.get(`http://localhost:8000/payments/invoice/${paymentId}`);
            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice_${paymentId}.json`;
            a.click();
        } catch (error) {
            setError("Error downloading invoice");
            console.error("Error downloading invoice:", error);
        }
    };

    return (
        <div>
            <h1>Payment Processing</h1>
            <input
                type="text"
                name="amount"
                placeholder="Amount"
                value={paymentData.amount}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="details"
                placeholder="Payment Details"
                value={paymentData.details}
                onChange={handleInputChange}
            />
            <button onClick={handlePayment}>Process Payment</button>
            {paymentResult && (
                <div>
                    <p>Payment Successful! Payment ID: {paymentResult.payment_id}</p>
                    <button onClick={() => downloadInvoice(paymentResult.payment_id)}>Download Invoice</button>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default PaymentProcessing;
