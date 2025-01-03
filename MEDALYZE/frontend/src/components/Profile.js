import React, { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchData('/auth/profile');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Email: {profile.email}</p>
      {/* Add more profile fields as needed */}
    </div>
  );
}

export default Profile;
