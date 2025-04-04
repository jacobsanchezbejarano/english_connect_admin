import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3300/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        if (data.error == "User already exists") {
          setError("User already exists");
          return;
        }
      } else {
        // Handle other errors
        setError(data.error || data.message || 'Registration failed');
      }

      // Handle successful registration
      console.log("Registration successful", data);
      // You might want to redirect to login page or directly log the user in
      // history.push('/login');
      return;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          { error && <ErrorMessage message={error} /> }
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          ></input>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            autoFocus
          ></input>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={changeInputHandler}
            autoFocus
          ></input>
          <button type="submit" className="btn primary" disabled={loading}>
             {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
