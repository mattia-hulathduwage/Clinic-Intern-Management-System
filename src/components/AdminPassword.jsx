import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const AdminPassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger the popup to slide in after mounting
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 0);
  }, []);

  const handleClose = () => {
    setIsClosing(true); // Start the slide-out animation
    setTimeout(() => {
      onClose(); // Call the parent-provided onClose function after animation
    }, 500); // Delay matches the animation duration
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: "0",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay with 50% opacity
    },
    popup: {
      width: "500px",
      height: "680px",
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 10px 8px rgba(0, 0, 0, 0.2)",
      fontFamily: "Poppins, sans-serif",
      marginLeft: "970px",
      transform: isPopupVisible
        ? isClosing
          ? "translateX(100%)" // Slide out
          : "translateX(0)" // Fully visible
        : "translateX(100%)", // Slide in
      transition: "transform 0.5s ease-in-out", // Smooth animation
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "left",
      padding: "10px",
    },
    reusedPasswordNotice: {
      width: "92%",
      height: "35px",
      backgroundColor: "rgba(0, 0, 0)",
      textAlign: "center",
      lineHeight: "35px",
      fontSize: "0.7rem",
      fontWeight: "500",
      color: "White",
      marginBottom: "25px",
      borderRadius: "4px",
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "90%",
      height: "25px",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "0.9rem",
      marginBottom: "20px",
      marginLeft: "15px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
    },
    button: {
      padding: "10px",
      width: "120px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
      marginTop: "40px",
    },
    buttonChange: {
      backgroundColor: "#5e17eb",
      color: "#fff",
    },
    buttonCancel: {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
    errorMessage: {
      color: "#B80000",
      fontSize: "0.9rem",
      textAlign: "center",
    },
    successMessage: {
      color: "#399918",
      fontSize: "0.9rem",
      textAlign: "center",
    },
    label: {
      fontWeight: "505",
      color: "#333",
      marginLeft: "15px",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const admin_id = localStorage.getItem("admin_id");
  
    if (!admin_id) {
      setErrorMessage("User not logged in.");
      setSuccessMessage("");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      setSuccessMessage("");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/admin/validate-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id,
          currentPassword,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        setErrorMessage(result.message || "Failed to validate current password.");
        setSuccessMessage("");
        return;
      }
  
      // Update the password
      const updateResponse = await fetch("http://localhost:5000/api/admin/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id,
          newPassword,
        }),
      });
  
      const updateResult = await updateResponse.json();
  
      if (!updateResponse.ok || !updateResult.success) {
        setErrorMessage(updateResult.message || "Failed to update password.");
        setSuccessMessage("");
        return;
      }
  
      setSuccessMessage("Password successfully updated!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
    }
  };
  

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Change Password</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "11px", marginRight: "8px", fontSize: "1rem" }}
          />
          This account uses a reused password. Update it now for better protection.
        </div>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="currentPassword" style={styles.label}>
            Old Password
          </label>
          <input
            id="currentPassword"
            style={styles.input}
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <label htmlFor="newPassword" style={styles.label}>
            New Password
          </label>
          <input
            id="newPassword"
            style={styles.input}
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <ul
            style={{
              marginLeft: "0px",
              marginTop: "-0px",
              color: "#999999",
              fontWeight: "500",
              fontSize: "0.8rem",
            }}
          >
            <li> Minimum 8 characters</li>
            <li> One uppercase character</li>
            <li> One lowercase character</li>
            <li> One special character</li>
            <li> One number</li>
          </ul>
          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            style={styles.input}
            type="password"
            placeholder="Confirm your confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.buttonChange }}
              type="submit"
            >
              Reset
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonCancel }}
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPassword;
