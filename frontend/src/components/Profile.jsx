import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hospital, setHospital] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [changes, setChanges] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        const userEmail = user.email;
    
        try {
          // get the user data based on email
          const response = await fetch(`http://localhost:5002/user/${userEmail}`);
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            // in case of null values
            setFirstName(data?.firstName || '');
            setLastName(data?.lastName || '');
            setHospital(data?.hospital || '');
          } else {
            console.error('Error fetching user data:', response.statusText);
            setEditMode(true);
          }
        } catch (error) {
          // set edit mode to true if user data is not found
          setEditMode(true);
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, changes]);

  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleSaveClick = async () => {
    const data = {
      firstName, lastName, hospital
    };
    try {
      const response = await fetch('http://localhost:5002/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userData: data,
        }),
      });
  
      if (response.ok) {
        setChanges(changes + 1);
        console.log("SUCCESS");
      } else {
        console.error('Error updating user profile:', response.statusText);
        
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
    setEditMode(false);
  };

  return (
    <div>
      {
        userData ?
        <div>
          <p>Email: {user.email}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Hospital: {hospital}</p>
          {editMode ? (
            <div>
              <label>
                First Name:
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label>
                Last Name:
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
              <label>
                Hospital:
                <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} />
              </label>
              <button onClick={handleSaveClick}>Save</button>
            </div>
          ) : (
            <button onClick={handleEditClick}>Edit Profile</button>
          )}
        </div>
        : editMode?
        <div>
              <label>
                First Name:
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label>
                Last Name:
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
              <label>
                Hospital:
                <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} />
              </label>
              <button onClick={handleSaveClick}>Save</button>
            </div>

            : <div/>
        
}
    </div>
  );
};

export default Profile;