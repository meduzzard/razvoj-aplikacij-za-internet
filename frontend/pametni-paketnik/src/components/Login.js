import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function handleLogin(e) {
        e.preventDefault();
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
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    const handleFaceIDLogin = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/launch-app", {
                method: "POST"
            });
            const data = await res.json();
            if (data.message) {
                console.log(data.message);
            } else if (data.error) {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error launching app:", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
            <input type="submit" name="submit" value="Login" />
            <label> {error}</label>
            <label>or </label>
            <button type="button" onClick={handleFaceIDLogin}>
                Login with Face ID
            </button>
        </form>
    );
}

export default Login;