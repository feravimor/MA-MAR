import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../utils/MultiLanguageProvider';
import TranslatableText from './TranslatableText';

const AppointmentManagement = () => {
    const { translate } = useContext(LanguageContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error(translate('auth_error'));

                const response = await fetch('http://localhost:8000/appointments', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error(translate('fetch_error'), error);
            }
        };

        fetchAppointments();
    }, [translate]);

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error(translate('auth_error'));

            await fetch(`http://localhost:8000/appointments/${appointmentId}/cancel`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        } catch (error) {
            console.error(translate('cancel_error'), error);
        }
    };

    return (
        <div>
            <h1><TranslatableText translationKey="appointment_management_title" /></h1>

            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <p><TranslatableText translationKey="date_label" />: {appointment.date}</p>
                            <p><TranslatableText translationKey="time_label" />: {appointment.time}</p>
                            <button onClick={() => handleCancelAppointment(appointment.id)}>
                                <TranslatableText translationKey="cancel_button" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p><TranslatableText translationKey="no_appointments_message" /></p>
            )}
        </div>
    );
};

export default AppointmentManagement;
