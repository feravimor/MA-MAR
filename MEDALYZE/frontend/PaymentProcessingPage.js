import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your_stripe_publishable_key");

const PaymentProcessingPage = ({ appointmentId, amount }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async () => {
        try {
            const { data } = await axios.post("http://localhost:8000/process", {
                appointment_id: appointmentId,
                token: elements.getElement(CardElement).token.id,
            });

            if (data.status === "success") {
                setSuccess(true);
            } else {
                setError("Payment failed. Please try again later.");
            }
        } catch (err) {
            setError("Payment failed. Please try again later.");
        }
    };

    return (
        <div>
            <h1>Payment Processing</h1>
            <p>Amount: ${amount}</p>
            <Elements stripe={stripePromise}>
                <CardElement />
            </Elements>
            <button onClick={handlePayment}>Pay Now</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Payment successful!</p>}
        </div>
    );
};

export default PaymentProcessingPage;
