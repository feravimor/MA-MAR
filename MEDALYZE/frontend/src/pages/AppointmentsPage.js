import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const response = await axios.get("http://localhost:8000/appointments/1");
            setAppointments(response.data);
        };
        fetchAppointments();
    }, []);

    return (
        <div>
            <h1>Your Appointments</h1>
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment.id}>{appointment.date}</li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentsPage;
