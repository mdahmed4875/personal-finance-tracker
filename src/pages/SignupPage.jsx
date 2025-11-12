import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SignupPage.css";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const { user, error } = await firebase.signup(email, pass);
      if (error) {
        toast.error("Signup failed: " + error);
        return;
      }
      toast.success("Account created successfully!");
      setEmail("");
      setPass("");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Signup failed: " + err.message);
    }
  };

  

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div>
          <label>Email:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
