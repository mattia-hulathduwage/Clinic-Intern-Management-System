import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
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
      backgroundColor: "#121212",
    },
    content: {
      textAlign: "center",
    },
    heading: {
      fontSize: "1.8rem",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    paragraph: {
        color: "#fff",
        fontSize: "16px",
        marginBottom: "1rem",
      },
    formContainer: {
      padding: "2rem",
      borderRadius: "12px",
    },
    inputField: {
      width: "80%",
      padding: "1rem",
      marginBottom: "35px",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      marginTop: "20px",
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
      color: "#4CAF50",
      textDecoration: "none",
      fontSize: "13px",
      cursor: "pointer",
      width: "80%",
      marginLeft: "60px",
    },
    linkText: {
      marginTop: "1rem",
      color: "#fff",
      fontSize: "14px",
    },
    link: {
      color: "green",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/send-otp", {
        phoneNumber,
      });

      alert("OTP sent successfully!");  // Optionally, display success message
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
            <h1 style={styles.heading}>Forgot Password</h1>
            <p style={styles.paragraph}>
  No worries! Enter your phone number below,<br /> and we'll send you a code.
</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Phone Number"
                style={styles.inputField}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
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
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
