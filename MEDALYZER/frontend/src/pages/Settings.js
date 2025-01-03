import React, { useState } from "react";

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    currency: "USD",
  });

  const handleInputChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const resetSettings = () => {
    setSettings({
      theme: "light",
      language: "en",
      currency: "USD",
    });
    alert("Settings reset to default values.");
  };

  return (
    <form>
      <div className="form-group">
        <label>Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => handleInputChange("theme", e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="form-group">
        <label>Language</label>
        <select
          value={settings.language}
          onChange={(e) => handleInputChange("language", e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      <div className="form-group">
        <label>Currency</label>
        <select
          value={settings.currency}
          onChange={(e) => handleInputChange("currency", e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      <button type="button" onClick={resetSettings}>
        Reset to Default
      </button>
    </form>
  );
};

export default SettingsForm;
