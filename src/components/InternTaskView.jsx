import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const InternTaskView = ({ onClose, taskId }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [taskData, setTaskData] = useState(null); // State to store task data
  const [errorMessage, setErrorMessage] = useState(""); // Error state
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 0);

    console.log("Opened Task ID:", taskId); // Log the task ID for clarity

    // Fetch task data from the API
    const fetchTaskData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/getTaskById?task_id=${taskId}`
        );
        const data = await response.json();
        console.log("Fetched task data:", data); // Log the response for debugging
        if (response.ok) {
          setTaskData(data.task); // Update state with task data
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

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("task_pdf", file);
    formData.append("task_id", taskId);

    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks/uploadTaskPdf",
        {
          method: "PUT",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage(responseData.message);
      } else {
        setErrorMessage(
          `Failed to upload PDF: ${responseData.error || responseData.message}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error uploading PDF.");
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCancel = () => {
    setFile(null); // Clear file input
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message
    handleClose(); // Close the popup
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
      width: "90%", // Ensures each input takes up full width within its container
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
      display: "flex", // Uses flexbox to align the fields horizontally
      gap: "50px", // Optional: adds gap between inputs
      marginBottom: "0px", // Adds margin between rows
    },
    inputHalf: {
      width: "42%", // Each input takes up roughly half of the row width
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
      gap: "10px", // Adds space between the label and the toggle switch
      marginBottom: "10px",
      marginTop: "10px",
      flexDirection: "row", // Ensures the label and switch are in a horizontal line
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
    tasktitle: {
      fontSize: "1.8rem", // Larger size for the title
      fontWeight: "bold", // Bold font
      color: "#4A4A4A", // Dark color for the title
      marginBottom: "15px", // Space below the title
      textAlign: "left", // Align title to the left
    },
    description: {
      fontSize: "1rem", // Regular size for the description
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
    statusContainer: {
      padding: "5px 5px", // Padding around the status value
      backgroundColor: "rgba(255, 165, 0, 0.2)", // Dark green color for status
      color: "#FF9500", // White text color
      borderRadius: "8px", // Optional: Rounded corners
      fontSize: "12px",
      border: "2px solid rgba(255, 165, 0, 0.2)",
    },
    fileinput: {
      marginLeft: "20px",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      backgroundColor: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Task Overview</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "50px", marginRight: "8px", fontSize: "1rem" }}
          />
          One attemp allowed for submissions. Proceed with caution.
        </div>
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        {taskData && (
          <div style={styles.taskcontainer}>
            <p style={styles.tasktitle}>{taskData.task_title}</p>{" "}
            {/* Title with custom style */}
            <p style={styles.description}>{taskData.task_description}</p>{" "}
            {/* Description with custom style */}
            <p style={styles.info}>
              <strong>Patient Identification:</strong>{" "}
              <span style={styles.patientId}>
                {"#P" + taskData.patient.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Due Date:</strong>{" "}
              {new Date(taskData.task_date).toLocaleDateString()}
            </p>
            <p style={styles.info}>
              <strong>Due Time:</strong> {taskData.due_time}
            </p>
            <p style={styles.info}>
              <strong>Status:</strong>{" "}
              <span style={styles.statusContainer}>{taskData.status}</span>
            </p>
            {/* Attachment Section */}
            <p style={styles.info}>
              <strong>Attachment:</strong>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={styles.fileinput}
              />
            </p>
            <div style={styles.buttonContainer}>
              <button
                style={{ ...styles.button, ...styles.buttonChange }}
                onClick={handleUpload}
              >
                Submit
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonCancel }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {errorMessage && (
              <div style={styles.errorMessage}>{errorMessage}</div>
            )}
            {successMessage && (
              <div style={styles.successMessage}>{successMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternTaskView;
