import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useFirebase } from '../context/Firebase';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter all the required fields");
      return;
    }

    try {
      const { user, error } = await firebase.login(email, password);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Login successful!");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" method="POST" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label htmlFor="email">Email:</label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          type="email" id="email" name="email" required 
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password:</label>
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          type="password" id="password" name="password" required
          placeholder="Enter your password"
        />

        <button type="submit">Login</button>

        <p>Don't have an account? <a href="/">Sign up</a></p>
      </form>
    </div>
  );
}

export default LoginPage;
