import React from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";

const LabTaskReview = () => {
  const { taskId } = useParams(); // Get task_id from the URL
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [review, setReview] = useState(""); // Add this state
  const [rating, setRating] = useState(0); // 0 means no rating

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/labtask/${taskId}`
        );
        if (!response.ok) {
          throw new Error("Task not found or error fetching task");
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mappedRating = rating * 20; // Map rating to a value between 20 and 100

    try {
      const response = await fetch(
        `http://localhost:5000/api/labtask/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedback: review,
            rating: mappedRating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback and rating");
      }

      alert("Feedback and rating submitted successfully!");
    } catch (err) {
      alert("Error submitting feedback: " + err.message);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
    },
    content: {
      marginLeft: "290px",
      flex: 1,
      padding: "20px",
      backgroundColor: "white",
    },
    reusedPasswordNotice: {
      width: "40%",
      height: "35px",
      backgroundColor: "rgba(0, 0, 0)",
      textAlign: "center",
      lineHeight: "35px",
      fontSize: "0.7rem",
      fontWeight: "500",
      color: "White",
      marginBottom: "25px",
      borderRadius: "4px",
      marginLeft: "10px",
      marginRight: "auto",
      display: "flex",
      alignItems: "center",
    },
    tasktitle: {
      fontSize: "1.8rem", // Larger size for the title
      fontWeight: "bold", // Bold font
      color: "black", // Dark color for the title
      marginBottom: "15px", // Space below the title
      textAlign: "left", // Align title to the left
    },
    description: {
      fontSize: "1.1rem", // Regular size for the description
      fontWeight: "normal", // Regular font weight
      color: "#333", // Lighter color for the description
      marginBottom: "20px", // Space below the description
      textAlign: "left", // Align description to the left
    },
    info: {
      fontSize: "1rem", // Regular size for other info
      fontWeight: "normal",
      color: "#333", // Slightly darker color for better readability
      marginBottom: "10px", // Space between info items
    },
    patientId: {
      padding: "2px 8px",
      color: "black", // White text color
      borderRadius: "4px", // Optional: Rounded corners
      fontSize: "15px",
    },
    TraineetId: {
      padding: "2px 8px",
      color: "black", // White text color
      borderRadius: "4px", // Optional: Rounded corners
      fontSize: "15px",
    },
    DoctorId: {
      padding: "2px 8px",
      color: "black", // White text color
      borderRadius: "4px", // Optional: Rounded corners
      fontSize: "15px",
    },
    reviewContainer: {
      padding: "2px 8px",
      color: "black", // White text color
      borderRadius: "4px", // Optional: Rounded corners
      fontSize: "15px",
    },
    statusContainer: {
      padding: "2px 8px",
      color: "black", // White text color
      borderRadius: "4px", // Optional: Rounded corners
      fontSize: "15px",
    },
    downloadLink: {
      color: "blue", // White text
      textDecoration: "none", // Remove underline
      fontWeight: "normal",
      fontSize: "14px",
      transition: "background-color 0.3s",
    },
    downloadLinkHover: {
      color: "#BA55D3", // Darker blue on hover
    },
    formcontainer: {
      marginTop: "50px",

      backgroundColor: "rgba(0, 0, 0, 0.04)",
      borderRadius: "12px",
      border: "2px solid #e5e5e5" /* Adjust thickness and color */,
    },
    reviewForm: {
      marginTop: "0px",
      display: "flex",
      alignItems: "center", // Aligns label and textarea in the center
      gap: "150px", // Space between label and textarea
      padding: "50px 50px",
    },
    ratingform: {
      marginTop: "0px",
      display: "flex",
      alignItems: "center", // Aligns label and textarea in the center
      gap: "150px", // Space between label and textarea
      padding: "50px 50px",
    },
    reviewLabel: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.67)",
      minWidth: "80px", // Ensures label has a consistent width
      marginTop: "-150px",
    },
    reviewTextarea: {
      flex: 1, // Allows textarea to take remaining space
      minHeight: "150px",
      padding: "10px",
      fontSize: "0.9rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      resize: "vertical",
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#fff",
    },
    ratingLabel: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.67)",
      minWidth: "80px", // Ensures label has a consistent width
      marginTop: "0px",
    },
    reviewButton: {
      marginTop: "15px",
      padding: "10px 15px",
      background: "linear-gradient(to right, #4a0fbf, rgb(120, 69, 223))",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      alignItems: "centre",
      marginRight: "20px",
      fontSize: "1.2rem",
      fontFamily: "Poppins, sans-serif",
    },
    formtitle: {
      fontSize: "1.8rem", // Larger size for the title
      fontWeight: "normal", // Bold font
      color: "rgba(0, 0, 0, 0.67)", // Dark color for the title
      marginBottom: "15px", // Space below the title
      textAlign: "left",
      marginLeft: "20px",
    },
    hrLine: {
      border: "0",
      borderTop: "2px solid #e5e5e5", // Light gray color
      margin: "20px 0", // Space above and below the line
      width: "100%", // Full width of the container
    },
    buttonWrapper: {
      display: "flex" /* Enable flexbox for centering */,
      justifyContent: "center" /* Center the button horizontally */,
      width: "100%" /* Make sure the buttonWrapper takes full width */,
      marginTop: "0",
      marginBottom: "30px",
    },
  };

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        {/*<h1>Lab Task</h1>*/}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {task ? (
          <div>
            <p style={styles.tasktitle}>{task.task_title}</p>
            <p style={styles.description}>
              {" "}
              <strong>Task description:</strong> <br></br>{" "}
              {task.task_description}
            </p>
            <p style={styles.info}>
              <strong>Assignee:</strong>{" "}
              <span style={styles.DoctorId}>
                {"#D" + task.doctor.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Assigned to:</strong>{" "}
              <span style={styles.TraineetId}>
                {"#T" + task.trainee.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Patient Identification:</strong>{" "}
              <span style={styles.patientId}>
                {"#P" + task.patient.toString().padStart(3, "0")}
              </span>
            </p>
            <p style={styles.info}>
              <strong>Status:</strong>{" "}
              <span style={styles.statusContainer}>{task.status}</span>
            </p>
            <p style={styles.info}>
              <strong>Review Status:</strong>{" "}
              <span style={styles.reviewContainer}>{task.review_status}</span>
            </p>
            {task.task_pdf && (
              <p style={styles.info}>
                <strong>Submitted Document:</strong>{" "}
                <a
                  href={`http://localhost:5000/api/labtask/${taskId}/pdf`}
                  download
                  style={styles.downloadLink}
                  onMouseEnter={(e) =>
                    (e.target.style.color = styles.downloadLinkHover.color)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = styles.downloadLink.color)
                  }
                >
                  Download
                </a>
              </p>
            )}
          </div>
        ) : (
          <p>Loading task details...</p>
        )}
        <form onSubmit={handleSubmit}>
          <div style={styles.formcontainer}>
            <p style={styles.formtitle}>Task Feedback and Rating</p>
            <div style={styles.reviewForm}>
              <label htmlFor="review" style={styles.reviewLabel}>
                Feedback
              </label>
              <textarea
                id="review"
                style={styles.reviewTextarea}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </div>
            <hr style={styles.hrLine} />
            {/* Rating section */}
            <div style={styles.ratingform}>
              <label style={styles.ratingLabel}>Rating</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingChange(star)} // Handle click event
                  style={{
                    fontSize: "40px",
                    cursor: "pointer",
                    color: star <= rating ? "#FFD700" : "#ccc", // Gold for selected stars
                  }}
                >
                  &#9733; {/* Star symbol */}
                </span>
              ))}
            </div>

            <div style={styles.buttonWrapper}>
              <button
                type="submit"
                style={styles.reviewButton}
                disabled={task && task.review_status === "Completed"} // Disable if review_status is 'Completed'
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTaskReview;
