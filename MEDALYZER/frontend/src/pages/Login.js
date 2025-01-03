import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication
        if (email === "test@medalyzer.com" && password === "password") {
            history.push("/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <h1>Login to Medalyzer</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;