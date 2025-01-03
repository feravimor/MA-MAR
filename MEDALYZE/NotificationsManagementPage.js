import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationsManagementPage = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({
        event_type: "New Alert",
        delivery_method: "Push",
        is_enabled: true,
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/custom_notifications/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [userId]);

    const handleCreateNotification = async () => {
        try {
            const response = await axios.post("http://localhost:8000/custom_notifications/", {
                user_id: userId,
                ...newNotification,
            });
            setNotifications([...notifications, response.data.notification]);
            setNewNotification({ event_type: "New Alert", delivery_method: "Push", is_enabled: true });
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    };

    const handleToggleEnable = async (notificationId, isEnabled) => {
        try {
            await axios.put(`http://localhost:8000/custom_notifications/${notificationId}`, { is_enabled: isEnabled });
            setNotifications(
                notifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, is_enabled: isEnabled } : notification
                )
            );
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:8000/custom_notifications/${notificationId}`);
            setNotifications(notifications.filter((notification) => notification.id !== notificationId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div>
            <h1>Custom Notifications</h1>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        <p>Event Type: {notification.event_type}</p>
                        <p>Delivery Method: {notification.delivery_method}</p>
                        <p>Status: {notification.is_enabled ? "Enabled" : "Disabled"}</p>
                        <button
                            onClick={() =>
                                handleToggleEnable(notification.id, !notification.is_enabled)
                            }
                        >
                            Toggle Status
                        </button>
                        <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>Create New Notification</h2>
            <label>
                Event Type:
                <select
                    value={newNotification.event_type}
                    onChange={(e) => setNewNotification({ ...newNotification, event_type: e.target.value })}
                >
                    <option value="New Alert">New Alert</option>
                    <option value="Resolved Alert">Resolved Alert</option>
                    <option value="Escalated Alert">Escalated Alert</option>
                </select>
            </label>
            <label>
                Delivery Method:
                <select
                    value={newNotification.delivery_method}
                    onChange={(e) => setNewNotification({ ...newNotification, delivery_method: e.target.value })}
                >
                    <option value="Push">Push</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                </select>
            </label>
            <label>
                Enabled:
                <input
                    type="checkbox"
                    checked={newNotification.is_enabled}
                    onChange={(e) => setNewNotification({ ...newNotification, is_enabled: e.target.checked })}
                />
            </label>
            <button onClick={handleCreateNotification}>Create Notification</button>
        </div>
    );
};

export default NotificationsManagementPage;
