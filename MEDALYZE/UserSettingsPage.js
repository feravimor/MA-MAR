import React, { useState, useEffect } from "react";
import axios from "axios";

const UserSettingsPage = ({ userId }) => {
    const [settings, setSettings] = useState({
        email: "",
        phone: "",
        notifications: {
            appointment_reminders: true,
            marketing_emails: false,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/settings`);
                setSettings(response.data);
            } catch (error) {
                setError("Error fetching user settings");
                console.error("Error fetching user settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSettings();
    }, [userId]);

    const handleSaveSettings = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await axios.put(`http://localhost:8000/users/${userId}/settings`, settings);
            setSuccess(true);
        } catch (error) {
            setError("Error updating settings");
            console.error("Error updating settings:", error);
        } finally {
            setLoading(false);
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
            <h1>User Settings</h1>
            {success && <div>Settings updated successfully!</div>}
            <label>
                Email:
                <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
            </label>
            <label>
                Phone:
                <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
            </label>

            <h2>Notification Preferences</h2>
            <label>
                <input
                    type="checkbox"
                    checked={settings.notifications.appointment_reminders}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            notifications: {
                                ...settings.notifications,
                                appointment_reminders: e.target.checked,
                            },
                        })
                    }
                />
                Appointment Reminders
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={settings.notifications.marketing_emails}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            notifications: {
                                ...settings.notifications,
                                marketing_emails: e.target.checked,
                            },
                        })
                    }
                />
                Marketing Emails
            </label>
            <button onClick={handleSaveSettings}>Save Settings</button>
        </div>
    );
};

export default UserSettingsPage;
