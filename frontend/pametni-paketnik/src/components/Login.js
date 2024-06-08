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
        try {
            const res = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data.message);
                // Here we would launch the Android login activity for Face ID verification
                const launchRes = await fetch("http://localhost:3001/users/launch-login", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                });
                const launchData = await launchRes.json();
                if (launchRes.ok) {
                    console.log(launchData.message);
                } else {
                    console.error(launchData.error);
                    setError("Failed to launch login activity");
                }
            } else {
                setError(data.message || "Invalid username or password");
                setUsername("");
                setPassword("");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Error during login");
        }
    }

    return (
        <div className="container">
            <form onSubmit={handleLogin} className="login-form">
                {userContext.user ? <Navigate replace to="/" /> : ""}
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
