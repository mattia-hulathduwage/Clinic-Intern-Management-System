import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
    },
    leftPane: {
      flex: 1,
      backgroundImage: "url('/role_page.png')",  // Correct image path from public folder
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    rightPane: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",  // Darker black background color
    },
    content: {
      textAlign: "center",
    },
    heading: {
      fontSize: "1.8rem",
      marginBottom: "2rem",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "1.5rem", // Space between buttons
    },
    button: {
      width: "150px",
      height: "150px",
      background: "linear-gradient(to right, #004aad, #5271ff)", // Green button color
      color: "#fff", // Light text color to contrast with dark background
      border: "none",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "transform 0.3s, background-color 0.3s",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Poppins, sans-serif",
    },
    buttonHover: {
      background: "linear-gradient(to right, #00347a, #004aad)", // Darker green hover effect
      transform: "scale(1.05)", // Slight zoom effect
    },
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleButtonClick = (role) => {
    if (role === "Admin") {
      navigate("/admin-login");  // Navigate to Admin Login page
    } else if (role === "Trainee") {
      navigate("/trainee-login"); // Navigate to Trainee Login page
    } else if (role === "Doctor") {
      navigate("/doctor-login"); // Navigate to Doctor Login page
    } else {
      alert(`${role} Selected`);  // Handle other roles if necessary
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}></div>
      <div style={styles.rightPane}>
        <div style={styles.content}>
          <h1 style={styles.heading}>Choose Your Role</h1>
          <div style={styles.buttonContainer}>
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
              onClick={() => handleButtonClick("Admin")}
            >
              Admin
            </button>
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
              onClick={() => handleButtonClick("Trainee")}
            >
              Trainee
            </button>
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
              onClick={() => handleButtonClick("Doctor")}
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
