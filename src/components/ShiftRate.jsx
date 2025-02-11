import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FaArrowRight } from "react-icons/fa";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const ShiftRate = ({ onClose, taskId }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [taskData, setTaskData] = useState(null); // State to store task data
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const [selectedApproval, setSelectedApproval] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 0);

    console.log("Opened Task ID:", taskId);

    // Fetch task data from the new API endpoint
    const fetchTaskData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/shiftrate/${taskId}`
        );
        const data = await response.json();
        console.log("Fetched task data:", data);
        if (response.ok) {
          setTaskData(data.task); // Update task data state
        } else {
          setErrorMessage("Task not found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching task data.");
      }
    };

    if (taskId) {
      fetchTaskData();
    }
  }, [taskId]);

  const handleCancel = (event) => {
    event.preventDefault(); // Prevent form submission
    setErrorMessage(""); // Reset error message
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close the popup
    }, 500);
  };
  

  const handleSubmit = async () => {
    if (selectedApproval === null) {
      setErrorMessage("Please select an approval option.");
      return;
    }

    const ratingValue = selectedApproval === "approve" ? 100 : 0;

    // Call the API to update the rating and status
    try {
      const response = await fetch(
        "http://localhost:5000/api/shiftrate/updateRating",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_id: taskId,
            rating: ratingValue,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Handle success, maybe close the popup or show a success message
        console.log(data.message);
        onClose(); // Close the popup on success
      } else {
        setErrorMessage(data.error || "Error updating the task.");
      }
    } catch (error) {
      setErrorMessage("Error submitting the approval.");
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
    tasktitle: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#4A4A4A",
      marginBottom: "15px",
      textAlign: "left",
    },
    description: {
      fontSize: "1rem",
      fontWeight: "normal",
      color: "#7A7A7A",
      marginBottom: "20px",
      textAlign: "left",
    },
    info: {
      fontSize: "1rem",
      fontWeight: "normal",
      color: "#333",
      marginBottom: "10px",
    },
    taskcontainer: {
      padding: "0px 20px",
    },
    traineeId: {
      padding: "5px 5px",
      backgroundColor: "rgba(30, 144, 255, 0.2)",
      color: "#1E90FF",
      borderRadius: "8px",
      fontSize: "12px",
      border: "2px solid rgba(30, 144, 255, 0.2)",
    },
    statusContainer: {
      padding: "5px 5px",
      backgroundColor: "rgba(255, 165, 0, 0.2)",
      color: "#FF9500",
      borderRadius: "8px",
      fontSize: "12px",
      border: "2px solid rgba(255, 165, 0, 0.2)",
    },
    formlabel: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#333",
      marginLeft: "20px",
      marginTop: "50px",
    },
    formbutton: {
      display: "flex",
      justifyContent: "center", // Center the buttons horizontally
      gap: "20px", // Fine gap between the buttons
    },
    approvebutton: {
      padding: "20px",
      width: "fit-content",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
      marginTop: "5px",
      color: "#399918",
      border: "none",
    },
    disapprovebutton: {
      padding: "20px",
      width: "fit-content",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
      marginTop: "5px",
      color: "#B80000",
      border: "none",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Shift Evaluation</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "50px", marginRight: "8px", fontSize: "1rem" }}
          />
          One attempt allowed for submissions. Proceed with caution.
        </div>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        {taskData && (
          <div style={styles.taskcontainer}>
            <p style={styles.tasktitle}>{taskData.task_title}</p>
            <p style={styles.info}>
              <strong>Ward:</strong>{" "}
              <span style={styles.statusContainer}>{taskData.ward}</span>
            </p>
            <p style={styles.info}>
              <strong>Trainee:</strong>{" "}
              <span style={styles.traineeId}>
                {"#T" + taskData.trainee.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Task Date:</strong>{" "}
              {new Date(taskData.task_date).toLocaleDateString()}
            </p>
            <p style={styles.info}>
              <strong>Shift:</strong> {taskData.shift_start}{" "}
              <FaArrowRight
                style={{
                  margin: "0 5px",
                  verticalAlign: "middle",
                  fontSize: "0.8rem",
                  marginTop: "-2px",
                }}
              />{" "}
              {taskData.shift_end}
            </p>
          </div>
        )}
        <form>
          <p style={styles.formlabel}>
            <strin>Shift Approval ?</strin>
          </p>
          <div style={styles.formbutton}>
            <button
              type="button" // Prevent page refresh on click
              style={{
                ...styles.approvebutton,
                backgroundColor:
                  selectedApproval === "approve"
                    ? "rgba(57, 153, 24, 0.2)"
                    : "#e0e0e0",
                border:
                  selectedApproval === "approve" ? "2px solid #399918" : "none",
                width: "170px",
                height: "70px",
              }}
              onClick={() => setSelectedApproval("approve")}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ marginRight: "8px", fontSize: "1.2rem" }}
              />
              Approve
            </button>
            <button
              type="button" // Prevent page refresh on click
              style={{
                ...styles.disapprovebutton,
                backgroundColor:
                  selectedApproval === "disapprove"
                    ? "rgba(255, 0, 0, 0.2)"
                    : "#e0e0e0",
                border:
                  selectedApproval === "disapprove"
                    ? "2px solid #B80000"
                    : "none",
                width: "170px",
                height: "70px",
              }}
              onClick={() => setSelectedApproval("disapprove")}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ marginRight: "8px", fontSize: "1.2rem" }}
              />
              Disapprove
            </button>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              style={{ ...styles.button, ...styles.buttonChange }}
              onClick={handleSubmit} // Trigger the submit function when clicked
            >
              Submit
            </button>

            <button
              style={{ ...styles.button, ...styles.buttonCancel }}
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftRate;
