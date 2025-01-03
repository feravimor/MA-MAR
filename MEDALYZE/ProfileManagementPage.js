import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileManagementPage = ({ specialistId }) => {
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/specialists/${specialistId}`);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [specialistId]);

    const handleSaveProfile = async () => {
        try {
            await axios.put(`http://localhost:8000/specialists/${specialistId}`, profile);
            setEditMode(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <div>
            <h1>Manage Profile</h1>
            {editMode ? (
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Specialty:
                        <input
                            type="text"
                            value={profile.specialty}
                            onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                        />
                    </label>
                    <label>
                        Location:
                        <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                    </label>
                    <label>
                        Keywords:
                        <input
                            type="text"
                            value={profile.keywords?.join(", ") || ""}
                            onChange={(e) => setProfile({ ...profile, keywords: e.target.value.split(", ") })}
                        />
                    </label>
                    <label>
                        Bio:
                        <textarea
                            value={profile.bio || ""}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                    </label>
                    <button onClick={handleSaveProfile}>Save</button>
                </div>
            ) : (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Specialty: {profile.specialty}</p>
                    <p>Location: {profile.location}</p>
                    <p>Keywords: {profile.keywords?.join(", ")}</p>
                    <p>Bio: {profile.bio}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default ProfileManagementPage;
