// Import required modules
import React, { useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";

const LoginPage = () => {
  const [userEmail, setuserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [register, setRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/auth/login",
        {
          userEmail,
          password,
        }
      );

      setMessage(response.data.message);
      console.log("response.data", response.data);

      localStorage.setItem("token", response.data.data.token);
      navigate("/"); // Navigate to dashboard after login
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/auth/register",
        {
          userEmail,
          password,
        }
      );
      console.log(response);

      // setMessage(response.data.message);
      // localStorage.setItem("token", response.data.token);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      {register ? (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "10px" }}>
              <label>Email:</label>
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </form>
          {message && (
            <p style={{ marginTop: "10px", color: "red" }}>{message}</p>
          )}
          <div className="register">
            <button
              onClick={() => {
                setRegister(!register);
              }}
            >
              {" "}
              Already Registered{" "}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "10px" }}>
              <label>Email:</label>
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
          {message && (
            <p style={{ marginTop: "10px", color: "red" }}>{message}</p>
          )}
          <div className="register">
            <button
              onClick={() => {
                setRegister(!register);
              }}
            >
              {" "}
              Create a account{" "}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
