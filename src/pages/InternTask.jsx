import React, { useEffect, useState } from "react";
import SidebarIntern from "../components/SidebarIntern";
import { IoEyeSharp } from "react-icons/io5"; // Add this import
import InternTaskView from "../components/InternTaskView";
import { MdOutlinePending } from "react-icons/md";
import { TbFileUpload } from "react-icons/tb";
import InternCompleteTask from "../components/InternCompleteTask";

const InternTask = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Store selected task
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [showInternCompleteTask, setShowInternCompleteTask] = useState(false); // Track whether to open InternCompleteTask

  useEffect(() => {
    const trainee_id = localStorage.getItem("trainee_id"); // Retrieve trainee_id from localStorage

    if (!trainee_id) {
      console.error("Trainee ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/api/tasks/labreports?trainee_id=${trainee_id}`)
      .then((response) => response.json())
      .then((data) => setTasks(data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  useEffect(() => {
    const trainee_id = localStorage.getItem("trainee_id");
    if (!trainee_id) {
      console.error("Trainee ID not found in localStorage");
      return;
    }

    const endpoint = showSubmitted ? "completelabreports" : "labreports"; // Use appropriate API endpoint

    fetch(
      `http://localhost:5000/api/tasks/${endpoint}?trainee_id=${trainee_id}`
    )
      .then((response) => response.json())
      .then((data) => setTasks(data.tasks))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [showSubmitted]); // Re-run effect when task type changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long", // 'Monday'
      year: "numeric", // '2025'
      month: "long", // 'January'
      day: "numeric", // '31'
    });
  };

  const formatTime = (timeString, dateString) => {
    const taskDate = new Date(dateString);
    const [hours, minutes] = timeString.split(":");
    taskDate.setHours(hours);
    taskDate.setMinutes(minutes);

    // Convert task time to IST
    return taskDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 12-hour format (AM/PM)
      timeZone: "Asia/Kolkata", // Force IST for the time
    });
  };

  const isPastDue = (taskDate, taskTime) => {
    // Get the current time in IST
    const currentIST = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const currentTime = new Date(currentIST);

    // Extract the date part and properly format the task's due time
    const [hours, minutes, seconds] = taskTime.split(":").map(Number);

    // Create a new Date object for the task's due date
    const taskDueDate = new Date(taskDate);
    taskDueDate.setHours(hours, minutes, seconds || 0); // Set task time

    // Convert task due date to IST
    const taskDateTimeIST = new Date(
      taskDueDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    console.log(`Current IST Time: ${currentTime}`);
    console.log(`Task Due IST Time: ${taskDateTimeIST}`);

    // Return true if current IST time is past the due date & time
    return currentTime > taskDateTimeIST;
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
    heading: {
      marginBottom: "50px",
    },
    cardContainer: {
      display: "flex",
      flexWrap: "wrap", // This will allow cards to wrap to the next line
      gap: "30px", // Space between the cards
      marginLeft: "35px",
    },
    card: {
      position: "relative", // Add relative positioning to enable absolute child positioning
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "15px",
      width: "350px",
      height: "200px",
      boxSizing: "border-box",
      border: "2px solid rgba(0, 0, 0, 0.1)",
      display: "flex", // Flexbox layout
      flexDirection: "column", // Arrange items in a column
      justifyContent: "space-between",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    description: {
      fontSize: "12px",
      color: "rgba(0, 0, 0, 0.4)",
      overflow: "hidden", // Hide overflow text
      textOverflow: "ellipsis", // Add ellipsis at the end
      display: "-webkit-box", // Required for multiline truncation
      WebkitBoxOrient: "vertical", // Limit the number of lines
      WebkitLineClamp: 3, // Allow 2 lines before truncating
      marginTop: "5px",
      marginBottom: "5px",
    },
    dateTime: {
      fontSize: "12px",
      color: "#777",
      marginTop: "5px",
    },
    dueDateContainer: (isPastDueDate) => ({
      padding: "5px 0px",
      borderRadius: "0px",
      color: showSubmitted ? "black" : isPastDueDate ? "#B80000" : "#399918", 
      fontSize: "12px",
      textAlign: "left",
      width: "93%",
      marginTop: "5px",
      borderTop: "2px solid rgba(0, 0, 0, 0.1)",
    }),    
    StatusContainer: {
      backgroundColor: "rgba(255, 165, 0, 0.2)",
      padding: "5px 10px",
      borderRadius: "15px",
      color: "#FF9500",
      fontSize: "12px",
      textAlign: "left",
      width: "fit-content",
      marginBottom: "10px", // Moves it away from the title
      fontWeight: "bold",
      border: "2px solid rgba(255, 165, 0, 0.2)",
    },
    iconButton: (isHovered) => ({
      position: "absolute", // Absolute positioning to place it in the top-right corner
      top: "15px", // Adjust according to your design
      right: "15px", // Align to the right of the card
      fontSize: "20px", // Adjust size
      color: isHovered ? "#5e17eb" : "#888", // Change color on hover
      cursor: "pointer", // Pointer cursor to indicate it's clickable
      transition: "color 0.3s", // Smooth transition for color change
    }),
    optionbutton: {
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.20)",
      fontSize: "0.9rem",
      fontFamily: "Poppins, sans-serif",
      border: "none",
      cursor: "pointer",
    },
    optionbuttoncontainer: {
      display: "flex",
      gap: "3px",
      padding: "3px 3px",
      border: "none",
      cursor: "pointer",
      flex: "1",
      backgroundColor: "tranparent",
      width: "fit-content",
      marginBottom: "-5px",
      zindex: "1000",
    },
    horizontalline: {
      marginTop: "-2px",
      height: "2px",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
      border: "none",
      marginBottom: "30px",
    },
  };

  const getStatusStyle = (status) => ({
    backgroundColor:
      status === "Completed"
        ? "rgba(57, 153, 24, 0.2)"
        : "rgba(255, 165, 0, 0.2)", // Green for Completed, Orange for Pending
    padding: "5px 10px",
    borderRadius: "15px",
    color: status === "Completed" ? "#399918" : "#FF9500", // Green text for Completed, Orange for Pending
    fontSize: "12px",
    textAlign: "left",
    width: "fit-content",
    marginBottom: "10px",
    fontWeight: "bold",
    border: `2px solid ${
      status === "Completed"
        ? "rgba(57, 153, 24, 0.2)"
        : "rgba(255, 165, 0, 0.2)"
    }`,
  });

  return (
    <div style={styles.container}>
      <SidebarIntern />
      <div style={styles.content}>
        <div style={styles.heading}>
          <h1>Tasks</h1>
        </div>
        <div style={styles.optionbuttoncontainer}>
          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              color: !showSubmitted ? "black" : "rgba(0, 0, 0, 0.4)", // Highlight active tab
              borderBottom: !showSubmitted ? "2px solid black" : "none", // Highlight active tab
            }}
            onClick={() => setShowSubmitted(false)} // Switch to pending tasks
          >
            <MdOutlinePending size={18} />
            Pending
          </button>

          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              color: showSubmitted ? "black" : "rgba(0, 0, 0, 0.4)", // Highlight active tab
              borderBottom: showSubmitted ? "2px solid black" : "none", // Highlight active tab
            }}
            onClick={() => setShowSubmitted(true)} // Switch to submitted tasks
          >
            <TbFileUpload size={18} />
            Submitted
          </button>
        </div>
        <hr style={styles.horizontalline} />
        {tasks.length > 0 ? (
          <div style={styles.cardContainer}>
            {tasks.map((task) => (
              <div key={task.task_id} style={styles.card}>
                <div
                  style={getStatusStyle(
                    showSubmitted ? "Completed" : "Pending"
                  )}
                >
                  {showSubmitted ? "Completed" : "Pending"}
                </div>

                <div style={styles.title}>{task.task_title}</div>
                <div style={styles.description}>{task.task_description}</div>
                <div
                  style={styles.dueDateContainer(
                    isPastDue(task.task_date, task.due_time)
                  )}
                >
                  {formatDate(task.task_date)} at{" "}
                  {formatTime(task.due_time, task.task_date)}
                </div>

                <div
  style={styles.iconButton(hoveredTaskId === task.task_id)}
  onClick={() => {
    setSelectedTask(task);
    setShowInternCompleteTask(showSubmitted); // Open InternCompleteTask only for submitted tasks
  }}
  onMouseEnter={() => setHoveredTaskId(task.task_id)}
  onMouseLeave={() => setHoveredTaskId(null)}
>
  <IoEyeSharp />
</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending Lab Report tasks.</p>
        )}
      </div>
      {selectedTask && (
  showInternCompleteTask ? (
    <InternCompleteTask
      taskId={selectedTask.task_id}
      onClose={() => {
        setSelectedTask(null);
        setShowInternCompleteTask(false);
      }}
    />
  ) : (
    <InternTaskView
      taskId={selectedTask.task_id}
      onClose={() => setSelectedTask(null)}
    />
  )
)}
    </div>
  );
};

export default InternTask;
