import React, { useState } from "react";
import axios from "axios";

const AppointmentBookingPage = ({ patientId }) => {
    const [specialistId, setSpecialistId] = useState("");
    const [date, setDate] = useState("");

    const handleBookAppointment = async () => {
        try {
            const response = await axios.post("http://localhost:8000/appointments", {
                patient_id: patientId,
                specialist_id: specialistId,
                date,
                status: "booked",
            });
            console.log("Appointment booked:", response.data);
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <div className="appointment-booking-page">
            <h1>Book an Appointment</h1>
            <div className="booking-form">
                <input
                    type="text"
                    placeholder="Specialist ID"
                    value={specialistId}
                    onChange={(e) => setSpecialistId(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={handleBookAppointment}>Book Appointment</button>
            </div>
        </div>
    );
};

export default AppointmentBookingPage;
