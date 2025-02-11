import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Trainee_Login = () => {
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
    },
    leftPane: {
      flex: 1,
      backgroundImage: "url('/role_page.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    rightPane: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    content: {
      textAlign: "center",
    },
    heading: {
      fontSize: "1.8rem",
      color: "black",
      marginBottom: "2rem",
    },
    formContainer: {
      padding: "2rem",
      borderRadius: "12px",
    },
    inputField: {
      width: "80%",
      padding: "1rem",
      marginBottom: "1rem",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
    },
    button: {
      width: "86%",
      padding: "1rem",
      backgroundColor: "#5271ff",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.3s",
      marginBottom: "15px",
    },
    buttonHover: {
      backgroundColor: "#004aad",
      transform: "scale(1.05)",
    },
    forgotPassword: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "0.1rem",
      marginBottom: "1.4rem",
      color: "#5271ff",
      textDecoration: "none",
      fontSize: "13px",
      cursor: "pointer",
      width: "80%",
      marginLeft: "60px",
    },
    linkText: {
      marginTop: "1rem",
      color: "black",
      fontSize: "14px",
    },
    link: {
      color: "#5271ff",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/trainee/login", {
        username,
        password,
      });


      localStorage.setItem("trainee_id", response.data.trainee_id);
      localStorage.setItem("trainee_fname", response.data.trainee_fname);
      localStorage.setItem("trainee_lname", response.data.trainee_lname);
      localStorage.setItem("trainee_username", username);
      localStorage.setItem("trainee_password", password);

      navigate("/intern-dashboard"); // Adjust the path as needed
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}></div>
      <div style={styles.rightPane}>
        <div style={styles.content}>
          <div style={styles.formContainer}>
            <h1 style={styles.heading}>Log in to your Trainee Account</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                style={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <a href="/reset-password" style={styles.forgotPassword}>
                Forgot Password?
              </a>
              <button
                style={styles.button}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                  e.target.style.transform = styles.buttonHover.transform;
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = styles.button.backgroundColor;
                  e.target.style.transform = "scale(1)";
                }}
                type="submit"
              >
                Login
              </button>
            </form>
            <div style={styles.linkText}>
              <span>Don't have an Account? </span>
              <a href="/register" style={styles.link}>
                Create New Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainee_Login;
