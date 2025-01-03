import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationPreferencesPage = ({ userId }) => {
    const [preferences, setPreferences] = useState({ email: false, sms: false, push: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/preferences/${userId}`);
                setPreferences(response.data);
            } catch (error) {
                setError("Error fetching preferences");
                console.error("Error fetching preferences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [userId]);

    const updatePreferences = async () => {
        try {
            await axios.put(`http://localhost:8000/preferences/${userId}`, preferences);
            alert("Preferences updated successfully!");
        } catch (error) {
            setError("Error updating preferences");
            console.error("Error updating preferences:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Notification Preferences</h1>

            <label>
                <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                />
                Email Notifications
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                />
                SMS Notifications
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                />
                Push Notifications
            </label>

            <button onClick={updatePreferences}>Save Preferences</button>
        </div>
    );
};

export default NotificationPreferencesPage;
