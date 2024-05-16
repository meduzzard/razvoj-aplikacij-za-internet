import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    const handlePasswordChange = async () => {
        try {
            const res = await fetch("http://localhost:3001/users/change-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(passwordForm)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Geslo spremenjeno")
                console.log(data); // Handle successful response
            } else {
                // Handle error response
                console.error("Error changing password:", data.message);
                if (data.message === "Current password is incorrect") {
                    // Display message to user indicating that the current password is incorrect
                    alert("Current password is incorrect");
                } else {
                    // Handle other error cases
                    // For example, display a generic error message
                    alert("An error occurred while changing the password");
                }
            }
        } catch (error) {
            console.error("Error changing password:", error);
            // Handle network errors or other exceptions
            alert("An error occurred while changing the password");
        }
    }


    const handleChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    }

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1>User profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <div>
                <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                />
                <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                />
                <button onClick={handlePasswordChange}>Change Password</button>
            </div>
        </>
    );
}

export default Profile;
