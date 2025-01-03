import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentManagementPage = ({ userId }) => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        date: "",
        time: "",
        specialistId: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/appointments/user/${userId}`);
                setAppointments(response.data);
            } catch (error) {
                setError("Error fetching appointments");
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [userId]);

    const handleCreateAppointment = async () => {
        if (!newAppointment.date || !newAppointment.time || !newAppointment.specialistId) {
            setError("All fields are required");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/appointments/", newAppointment);
            setAppointments([...appointments, response.data]);
            setNewAppointment({ date: "", time: "", specialistId: "" });
            setError("");
        } catch (error) {
            setError("Error creating appointment");
            console.error("Error creating appointment:", error);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://localhost:8000/appointments/${appointmentId}`);
            setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
            setError("");
        } catch (error) {
            setError("Error deleting appointment");
            console.error("Error deleting appointment:", error);
        }
    };

    return (
        <div>
            <h1>Manage Appointments</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                            <p>Specialist ID: {appointment.specialistId}</p>
                            <button onClick={() => handleDeleteAppointment(appointment.id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h2>New Appointment</h2>
            <label>
                Date:
                <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                />
            </label>
            <label>
                Time:
                <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
            </label>
            <label>
                Specialist ID:
                <input
                    type="text"
                    value={newAppointment.specialistId}
                    onChange={(e) => setNewAppointment({ ...newAppointment, specialistId: e.target.value })}
                />
            </label>
            <button onClick={handleCreateAppointment}>Create Appointment</button>
        </div>
    );
};

export default AppointmentManagementPage;
