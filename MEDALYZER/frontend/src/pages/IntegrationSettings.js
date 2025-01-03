import React, { useState, useEffect } from "react";

// ...existing code...

function IntegrationSettings() {
    const [isIntegrated, setIsIntegrated] = useState(false);
    const [syncStatus, setSyncStatus] = useState("Not Synced");

    useEffect(() => {
        // Mock fetching integration status from backend
        const fetchIntegrationStatus = async () => {
            // Simulate API call
            const response = { integrated: false, status: "Not Synced" };
            setIsIntegrated(response.integrated);
            setSyncStatus(response.status);
        };
        fetchIntegrationStatus();
    }, []);

    const toggleIntegration = () => {
        if (isIntegrated) {
            setIsIntegrated(false);
            setSyncStatus("Not Synced");
        } else {
            setIsIntegrated(true);
            setSyncStatus("Syncing...");

            // Simulate API call to enable integration
            setTimeout(() => {
                setSyncStatus("Synced");
            }, 2000);
        }
    };

    return (
        <div className="integration-settings-container">
            <h1>Integration Settings</h1>
            <div className="integration-status">
                <h2>Integration with Medalyze</h2>
                <p><strong>Status:</strong> {syncStatus}</p>
                <button onClick={toggleIntegration}>
                    {isIntegrated ? "Disable Integration" : "Enable Integration"}
                </button>
            </div>
            {isIntegrated && (
                <div className="sync-options">
                    <h2>Sync Options</h2>
                    <button onClick={() => alert("Syncing Treatments...")}>Sync Treatments</button>
                    <button onClick={() => alert("Syncing Inventory...")}>Sync Inventory</button>
                </div>
            )}
        </div>
    );
}

export default IntegrationSettings;