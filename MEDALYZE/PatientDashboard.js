import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AppointmentManagement from './AppointmentManagement'; 
import PaymentManagement from './PaymentManagement'; 
import TreatmentHistory from './TreatmentHistory'; 
import RewardsSystem from './RewardsSystem'; 
import InvoiceManagement from './InvoiceManagement'; 
import PaymentHistory from './PaymentHistory'; // Import PaymentHistory
import { LanguageContext } from '../utils/MultiLanguageProvider'; // Import LanguageContext

const PatientDashboard = () => {
    const { translate } = useContext(LanguageContext); // Use LanguageContext
    const [appointments, setAppointments] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [payments, setPayments] = useState([]); // Add state for payments

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/appointments/my', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/recommendations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/payments/my', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchAppointments();
        fetchRecommendations();
        fetchPayments(); // Fetch payments
    }, []);

    const cancelAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(appointments.filter(appt => appt.id !== appointmentId));
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    return (
        <div>
            <h1>{translate('patient_dashboard_title')}</h1>

            <h2>{translate('upcoming_appointments_title')}</h2>
            <ul>
                {appointments.map((appt) => (
                    <li key={appt.id}>
                        {appt.date} at {appt.time} with {appt.specialistName}
                        <button onClick={() => cancelAppointment(appt.id)}>{translate('cancel_button')}</button>
                    </li>
                ))}
            </ul>

            <h2>{translate('recommendations_title')}</h2>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>

            <h2>{translate('payment_history_title')}</h2>
            <PaymentHistory payments={payments} /> {/* Add PaymentHistory component */}

            <AppointmentManagement role="patient" /> 
            <PaymentManagement /> 
            <TreatmentHistory /> 
            <RewardsSystem /> 
            <InvoiceManagement /> 
        </div>
    );
};

export default PatientDashboard;
