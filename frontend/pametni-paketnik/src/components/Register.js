import { useState } from 'react';
import '../styles.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    async function register(e) {
        e.preventDefault();

        // Validation checks
        if (!username) {
            setError("Username is required");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }

        const res = await fetch("http://localhost:3001/users/register", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });

        try {
            const data = await res.json();
            if (res.ok) {
                // Registration successful
                window.location.href = "/";
            } else {
                // Registration failed
                setUsername("");
                setPassword("");
                setEmail("");
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            // Error parsing response
            setError("Error during registration");
        }
    }

    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={register}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                <input type="submit" name="submit" value="Register" />
                {error && <label>{error}</label>}
            </form>
        </div>
    );
}

export default Register;
