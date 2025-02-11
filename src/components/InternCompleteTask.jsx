import React, { useState, useEffect } from "react";

const InternTaskView = ({ onClose, taskId }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [taskData, setTaskData] = useState(null); // State to store task data
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  useEffect(() => {
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 0);

    console.log("Opened Task ID:", taskId); // Log the task ID for clarity

    // Fetch task data from the API
    const fetchTaskData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/internlabtask/details/${taskId}`
        );
        const data = await response.json();
        console.log("Fetched task data:", data); // Log the response for debugging
        if (response.ok) {
          setTaskData(data); // Update state with task data
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
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
    tasktitle: {
      fontSize: "1.5rem", // Larger size for the title
      fontWeight: "bold", // Bold font
      color: "#4A4A4A", // Dark color for the title
      marginBottom: "15px", // Space below the title
      textAlign: "left", // Align title to the left
    },
    description: {
      fontSize: "0.8rem", // Regular size for the description
      fontWeight: "normal", // Regular font weight
      color: "#7A7A7A", // Lighter color for the description
      marginBottom: "20px", // Space below the description
      textAlign: "left", // Align description to the left
    },
    info: {
      fontSize: "1rem", // Regular size for other info
      fontWeight: "normal",
      color: "#333", // Slightly darker color for better readability
      marginBottom: "10px", // Space between info items
    },
    taskcontainer: {
      padding: "0px 20px", // Adds padding to the container for all sides
    },
    patientId: {
      padding: "5px 5px",
      backgroundColor: "rgba(30, 144, 255, 0.2)", // Dark green color
      color: "#1E90FF", // White text color
      borderRadius: "8px", // Optional: Rounded corners
      fontSize: "12px",
      border: "2px solid rgba(30, 144, 255, 0.2)",
    },
    doctorId: {
      padding: "5px 5px",
      backgroundColor: "rgba(186, 85, 211, 0.2)", // Dark green color
      color: "#BA55D3", // White text color
      borderRadius: "8px", // Optional: Rounded corners
      fontSize: "12px",
      border: "2px solid rgba(186, 85, 211, 0.2)",
    },
    statusContainer: {
      padding: "5px 5px", // Padding around the status value
      backgroundColor: "rgba(255, 165, 0, 0.2)", // Dark green color for status
      color: "#FF9500", // White text color
      borderRadius: "8px", // Optional: Rounded corners
      fontSize: "12px",
      border: "2px solid rgba(255, 165, 0, 0.2)",
    },
    buttonContainer: {
      position: "absolute", // position relative to the popup container
      bottom: "20px", // distance from the bottom of the popup
      width: "100%", // full width of the popup container
      display: "flex",
      justifyContent: "center",
      gap: "20px",
    },
    button: {
      padding: "10px",
      marginLeft: "-80px",
      width: "120px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
    },
    buttonCancel: {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
  };

  const statusContainerStyle = {
    padding: "5px 5px",
    backgroundColor:
      taskData?.review_status === "Completed"
        ? "rgba(57, 153, 24, 0.2)"
        : "rgba(255, 165, 0, 0.2)", // Green for 'Completed', Orange for 'Pending'
    color: taskData?.review_status === "Completed" ? "#399918" : "#FF9500", // Green text for 'Completed', Orange for 'Pending'
    borderRadius: "8px",
    fontSize: "12px",
    border:
      taskData?.review_status === "Completed"
        ? "2px solid rgba(57, 153, 24, 0.2)"
        : "2px solid rgba(255, 165, 0, 0.2)",
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Task Overview</h2>

        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        {taskData && (
          <div style={styles.taskcontainer}>
            <p style={styles.tasktitle}>{taskData.task_description}</p>{" "}
            {/* Title with custom style */}
            {/* Description with custom style */}
            <p style={styles.info}>
              <strong>Patient Identification:</strong>{" "}
              <span style={styles.patientId}>
                {"#P" + taskData.patient.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Assigned By:</strong>{" "}
              <span style={styles.doctorId}>
                {"#D" + taskData.doctor.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Evaluation:</strong>{" "}
              <span style={statusContainerStyle}>{taskData.review_status}</span>
            </p>
            <p style={styles.info}>
              <strong>Score:</strong>{" "}
              {taskData.rating ? taskData.rating : "Not yet graded"}
            </p>
            <p style={styles.info}>
              <strong>Feedback:</strong>
              <p style={styles.description}>
                {taskData.feedback
                  ? taskData.feedback
                  : "No feedback given yet"}
              </p>
            </p>
            <div style={styles.buttonContainer}>
              <button
                style={{ ...styles.button, ...styles.buttonCancel }}
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternTaskView;
