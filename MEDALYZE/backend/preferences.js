const express = require('express');
const router = express.Router();

// Mock database
let preferencesDB = {
    "user1": { email: true, sms: false, push: true },
    // Add more users as needed
};

// Get preferences
router.get('/preferences/:userId', (req, res) => {
    const userId = req.params.userId;
    const preferences = preferencesDB[userId];
    if (preferences) {
        res.json(preferences);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// Update preferences
router.put('/preferences/:userId', (req, res) => {
    const userId = req.params.userId;
    const newPreferences = req.body;
    if (preferencesDB[userId]) {
        preferencesDB[userId] = newPreferences;
        res.json({ message: "Preferences updated successfully" });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

module.exports = router;
