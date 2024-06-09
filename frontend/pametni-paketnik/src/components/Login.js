import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import '../styles.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function handleLogin(e) {
        e.preventDefault();
        setError(""); // Clear any previous errors

        try {
            const res = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Login step 1 successful, proceed with Face ID verification");

                // Trigger the Face ID login process
                await launchFaceIDVerification();
            } else {
                setError(data.message || "Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Login error");
        }
    }

    const launchFaceIDVerification = async () => {
        try {
            const res = await fetch("http://localhost:3001/users/launch-login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const data = await res.json();
            if (data.message === "Login activity launched") {
                console.log("Face ID verification process started");
                // Poll for the verification result
                pollForVerificationResult();
            } else {
                setError("Failed to launch Face ID verification process");
            }
        } catch (error) {
            console.error("Error launching Face ID verification process:", error);
            setError("Error launching Face ID verification process");
        }
    };

    const pollForVerificationResult = async () => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:3001/users/check-verification-result", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                });

                const data = await res.json();
                if (data.verified) {
                    clearInterval(interval);
                    userContext.setUserContext(data.user);
                    // Save user ID to session storage or local storage if needed
                    sessionStorage.setItem('userId', data.user._id);
                } else if (data.error) {
                    clearInterval(interval);
                    setError(data.error);
                }
            } catch (error) {
                clearInterval(interval);
                console.error("Error polling for verification result:", error);
                setError("Error polling for verification result");
            }
        }, 2000); // Poll every 2 seconds
    };

    return (
        <div className="container">
            {userContext.user ? <Navigate replace to="/" /> : ""}
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="login-buttons">
                    <input type="submit" name="submit" value="Login" className="primary-button" />
                </div>
                <label>{error}</label>
            </form>
        </div>
    );
}

export default Login;
