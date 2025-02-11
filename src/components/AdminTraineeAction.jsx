import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const AdminTraineeAction = ({ onClose, selectedTrainee }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");

  console.log(selectedTrainee);

  useEffect(() => {
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 0);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    if (selectedTrainee) {
      console.log('Selected trainee:', selectedTrainee);
      setEmail(selectedTrainee.email || "");
      setContact(selectedTrainee.contact || "");
      setFirstName(selectedTrainee.fname || "");
      setLastName(selectedTrainee.lname || "");
      setStatus(selectedTrainee.status || "inactive");
    }
  }, [selectedTrainee]);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTrainee = {
      id: selectedTrainee?.trainee_id,
      fname: firstName,
      lname: lastName,
      email,
      telephone: contact,
      status,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/trainees/${selectedTrainee.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTrainee),
        }
      );

      if (response.ok) {
        setSuccessMessage("Trainee information updated successfully!");
        setErrorMessage("");

        // Trigger closing animation
        setTimeout(() => {
          setIsClosing(true);
        }, 2000); // Wait for success message to show

        // Wait for the animation to complete before reloading
        setTimeout(() => {
          onClose(true); // Notify parent to reload the trainee table
        }, 2500);
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to update trainee information."
        );
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while updating the trainee information."
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedTrainee?.id) {
      setErrorMessage("No trainee selected to delete.");
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to delete Trainee ID: ${selectedTrainee.id}?`
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/trainees/${selectedTrainee.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSuccessMessage("Trainee deleted successfully.");
        setErrorMessage("");

        // Trigger closing animation
        setTimeout(() => {
          setIsClosing(true);
        }, 2000); // Wait for success message to show

        // Wait for the animation to complete before reloading
        setTimeout(() => {
          onClose(true); // Notify parent to reload the trainee table
        }, 2500);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to delete trainee.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while deleting the trainee.");
    }
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
      zIndex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          ? "translateX(100%)"
          : "translateX(0)"
        : "translateX(100%)",
      transition: "transform 0.5s ease-in-out",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "left",
      padding: "10px",
      marginTop: "-5px",
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
      height: "10px",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "0.9rem",
      marginBottom: "10px",
      marginLeft: "15px",
    },
    formRow: {
      display: "flex",
      gap: "50px",
      marginBottom: "0px",
    },
    inputHalf: {
      width: "42%",
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
      marginTop: "100px",
    },
    buttonChange: {
      backgroundColor: "#5e17eb",
      color: "#fff",
    },
    buttonCancel: {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
    buttonDelete: {
      backgroundColor: "red",
      color: "#fff",
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
      fontSize: "12px",
    },
    switchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
      marginTop: "10px",
      flexDirection: "row",
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: "34px",
      height: "20px",
    },
    switchInput: {
      position: "absolute",
      opacity: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
    },
    switchSlider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#FF4C4C",
      transition: "0.4s",
      borderRadius: "34px",
    },
    switchSliderChecked: {
      backgroundColor: "#4CAF50",
    },
    switchKnob: {
      position: "absolute",
      content: "''",
      height: "14px",
      width: "14px",
      left: "3px",
      bottom: "3px",
      backgroundColor: "white",
      transition: "0.4s",
      borderRadius: "50%",
    },
    switchKnobChecked: {
      transform: "translateX(14px)",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Manage Trainee</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "60px", marginRight: "8px", fontSize: "1rem" }}
          />
          You are about to update or delete. Proceed with caution.
        </div>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        {successMessage && (
          <div style={styles.successMessage}>{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#E5E4E2",
              color: "#708090",
              padding: "5px 10px",
              borderRadius: "5px",
              marginLeft: "15px",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            #
            {selectedTrainee?.id?.toString().padStart(3, "0") ||
              "Not Available"}
          </div>
          <br />

          <div style={styles.formRow}>
            <div style={styles.inputHalf}>
              <label htmlFor="firstName" style={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                style={styles.input}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputHalf}>
              <label htmlFor="lastName" style={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                style={styles.input}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="contact" style={styles.label}>
            Contact
          </label>
          <input
            id="contact"
            style={styles.input}
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          <div style={styles.switchContainer}>
            <label style={styles.label}>Status</label>
            <label style={styles.switch}>
              <input
                type="checkbox"
                style={styles.switchInput}
                checked={status === "active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "active" : "inactive")
                }
              />
              <span
                style={{
                  ...styles.switchSlider,
                  ...(status === "active" && styles.switchSliderChecked),
                }}
              >
                <span
                  style={{
                    ...styles.switchKnob,
                    ...(status === "active" && styles.switchKnobChecked),
                  }}
                />
              </span>
            </label>
          </div>

          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.buttonChange }}
              type="submit"
            >
              Update
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonDelete }}
              type="button"
              onClick={handleDelete}
            >
              Delete
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

export default AdminTraineeAction;
