import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = ({ token }) => {
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/auth/me", {
                // ...existing code...
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/appointments/user/${userData?.id}`);
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userData?.id}/favorites`);
                setFavorites(response.data);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        if (token) {
            fetchUserData();
        }

        if (userData) {
            fetchAppointments();
            fetchFavorites();
        }
    }, [token, userData]);

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://localhost:8000/appointments/${appointmentId}`);
            setAppointments(appointments.filter(appt => appt.id !== appointmentId));
        } catch (error) {
            console.error("Error canceling appointment:", error);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        try {
            await axios.delete(`http://localhost:8000/users/${userData?.id}/favorites/${favoriteId}`);
            setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <div>
            <h1>Welcome, {userData?.username}</h1>

            <h2>Your Appointments</h2>
            <ul>
                {appointments.map((appt) => (
                    <li key={appt.id}>
                        {appt.date} - {appt.specialistName}
                        <button onClick={() => handleCancelAppointment(appt.id)}>Cancel</button>
                    </li>
                ))}
            </ul>

            <h2>Your Favorites</h2>
            <ul>
                {favorites.map((fav) => (
                    <li key={fav.id}>
                        {fav.name}
                        <button onClick={() => handleRemoveFavorite(fav.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDashboard;
