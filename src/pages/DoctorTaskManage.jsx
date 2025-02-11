import React, { useState } from "react";
import { useEffect } from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import LabTaskAction from "../components/LabTaskAction";

const DoctorTaskManage = () => {
  const [selectedSection, setSelectedSection] = useState("details");
  const [labTasks, setLabTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctorId from localStorage

  useEffect(() => {
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/doctor/lab-tasksmanage/${doctorId}`)
      .then((response) => response.json())
      .then((data) => setLabTasks(data.lab_tasks))
      .catch((error) => console.error("Error fetching lab tasks:", error));
  }, [doctorId]);

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
    title: {
      fontSize: "1.8rem",
      fontWeight: "600",
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
    optionbutton: {
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.20)",
      fontSize: "0.9rem",
      fontFamily: "Poppins, sans-serif",
      border: "none",
      cursor: "pointer",
    },
    horizontalline: {
      marginTop: "-2px",
      height: "2px",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
      border: "none",
    },
    tableWrapper: {
      maxHeight: "495px",
      overflowY: "auto",
      borderRadius: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#EEEDEB",
      color: "#424242",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    tableHeaderCell: {
      padding: "10px",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.9rem",
      backgroundColor: "#f8f9fa",
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
      height: "40px",
    },
    tableRowHover: {
      backgroundColor: "#f1f1f1",
    },
    tableCell: {
      padding: "8px",
      textAlign: "left",
      color: "#2c3e50",
      fontWeight: "505",
      fontSize: "0.8rem",
    },
    statusCompleted: {
      display: "inline-block",
      backgroundColor: "rgba(57, 153, 24, 0.2)", // Light green
      color: "#399918",
      padding: "4px 8px",
      borderRadius: "4px",
      textAlign: "center",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
    statusPending: {
      display: "inline-block",
      backgroundColor: "rgba(255, 165, 0, 0.2)", // Light orange
      color: "#FF9500",
      padding: "4px 8px",
      borderRadius: "4px",
      textAlign: "center",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
  };

  const renderDetailsSection = () => {
    return (
      <div>
        <h2>Lab Tasks</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>Title</th>
                <th style={styles.tableHeaderCell}>Trainee</th>
                <th style={styles.tableHeaderCell}>Patient</th>
                <th style={styles.tableHeaderCell}>Date</th>
                <th style={styles.tableHeaderCell}>Due Time</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Review Status</th>
                <th style={styles.tableHeaderCell}>Rating</th>
                <th style={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody>
              {labTasks.map((task) => (
                <tr
                  key={task.task_id}
                  style={styles.tableRow}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f1f1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{task.task_title}</td>
                  <td style={styles.tableCell}>
                    #T{String(task.trainee).padStart(3, "0")}
                  </td>
                  <td style={styles.tableCell}>
                    #P{String(task.patient).padStart(3, "0")}
                  </td>
                  <td style={styles.tableCell}>
                    {new Date(task.task_date).toISOString().split("T")[0]}
                  </td>

                  <td style={styles.tableCell}>{task.due_time}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={
                        task.status === "Completed"
                          ? styles.statusCompleted
                          : styles.statusPending
                      }
                    >
                      {task.status ?? "Pending"}{" "}
                      {/* Display "Pending" if status is null */}
                    </span>
                  </td>

                  <td style={styles.tableCell}>
                    <span
                      style={
                        task.review_status === "Completed"
                          ? styles.statusCompleted
                          : styles.statusPending
                      }
                    >
                      {task.review_status ?? "Pending"}{" "}
                      {/* Display "Pending" if status is null */}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{task.rating ?? "-"}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.firstChild.style.color = "#5e17eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.firstChild.style.color = "#888")
                      }
                      onClick={() => {
                        console.log("Selected Task ID:", task.task_id); // Log the task ID to see if it's being set
                        setSelectedTaskId(task.task_id);
                        setIsPopupOpen(true);
                      }}
                      
                    >
                      <FaArrowRight
                        style={{
                          fontSize: "1.0rem",
                          color: "#888", // default color
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "details":
        return renderDetailsSection();
      case "wardHistory":
        return <div>Ward History Section</div>;
      case "attachment":
        return <div>Attachment Section</div>;
      default:
        return <div>Details Section</div>;
    }
  };

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        <h1 style={styles.title}>Task Management</h1>
        <div style={styles.optionbuttoncontainer}>
          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              color:
                selectedSection === "details" ? "black" : "rgba(0, 0, 0, 0.20)", // Set color based on selection
              borderBottom:
                selectedSection === "details" ? "2px solid black" : "none", // Set color based on selection
            }}
            onClick={() => setSelectedSection("details")}
          >
            <BiMessageSquareDetail size={18} />
            Details
          </button>

          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              color:
                selectedSection === "wardHistory"
                  ? "black"
                  : "rgba(0, 0, 0, 0.20)", // Set color based on selection
              borderBottom:
                selectedSection === "wardHistory" ? "2px solid black" : "none", // Set color based on selection
            }}
            onClick={() => setSelectedSection("wardHistory")}
          >
            <MdOutlineHistory size={18} />
            Ward History
          </button>
        </div>
        <hr style={styles.horizontalline} />
        {renderSection()}{" "}
        {/* Render the content based on the selected section */}
      </div>
      {isPopupOpen && selectedTaskId && (
  <LabTaskAction
    selectedTaskId={selectedTaskId} // Pass the selected task id with the correct name
    onClose={() => setIsPopupOpen(false)} // Close the popup
  />
)}

    </div>
  );
};

export default DoctorTaskManage;
