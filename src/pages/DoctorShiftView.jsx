import React, { useState, useEffect } from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import { HiDotsVertical } from "react-icons/hi";
import { PiStudentBold } from "react-icons/pi";
import { TbBed } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { BiTask } from "react-icons/bi";
import { MdPendingActions, MdCheckCircle } from "react-icons/md";
import ShiftRate from "../components/ShiftRate";

const ShiftView = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedTaskId, setSelectedTaskId] = useState(null); 

  const fetchTasks = async (type) => {
    const doctor_id = localStorage.getItem("doctor_id");
    const url =
      type === "pending"
        ? `http://localhost:5000/api/wardreviewtasks/doctor?doctor_id=${doctor_id}`
        : `http://localhost:5000/api/completedwardtask/doctor?doctor_id=${doctor_id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data.tasks);
      setActiveTab(type);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleButtonClick = (taskId) => {
    setSelectedTaskId(taskId); // Set the selected task_id
  };  

  useEffect(() => {
    fetchTasks("pending");
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
    table: {
      width: "100%",
      marginTop: "20px",
      borderSpacing: "0 10px",
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      fontWeight: "490",
    },
    tableCell: {
      padding: "12px",
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    tableRow: {
      textAlign: "left",
      fontWeight: "500",
      color: "rgba(0, 0, 0, 0.67)",
      fontFamily: "Poppins, sans-serif",
    },
    statusContainer: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
    },
    PendingStatus: {
      backgroundColor: "rgba(255, 165, 0, 0.2)",
      color: "#FF9500",
    },
    CompleteStatus: {
      backgroundColor: "rgba(57, 153, 24, 0.2)",
      color: "#399918",
    },
    traineeContainer: {
      padding: "2px 8px",
      borderRadius: "4px",
      backgroundColor: "rgba(30, 144, 255, 0.2)",
      color: "#1E90FF",
      width: "fit-content",
      fontWeight: "bold",
    },
    wardContainer: {
      padding: "2px 8px",
      borderRadius: "4px",
      backgroundColor: "rgba(186, 85, 211, 0.2)",
      color: "#BA55D3",
      width: "fit-content",
      fontWeight: "bold",
    },
    optionbuttoncontainer: {
      display: "flex",
      gap: "3px",
      padding: "3px 3px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      flex: "1",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
      width: "fit-content",
    },

    optionbutton: {
      backgroundColor: "white",
      borderRadius: "5px",
      color: "#5e17eb",
      fontSize: "0.9rem",
      fontFamily: "Poppins, sans-serif",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        <h1>Task Evaluation</h1>
        <div style={styles.optionbuttoncontainer}>
          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              backgroundColor: activeTab === "pending" ? "white" : "#ddd",
            }}
            onClick={() => fetchTasks("pending")}
          >
            <MdPendingActions size={18} />
            Pending
          </button>

          <button
            style={{
              ...styles.optionbutton,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 12px",
              backgroundColor: activeTab === "approved" ? "white" : "#ddd",
            }}
            onClick={() => fetchTasks("approved")}
          >
            <MdCheckCircle size={18} />
            Approved
          </button>
        </div>

        <div>
          <table style={styles.table}>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.task_id} style={styles.tableRow}>
                  <td
                    style={{
                      ...styles.tableCell,
                      borderTopLeftRadius: "5px",
                      borderBottomLeftRadius: "5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BiTask size={20} style={{ marginRight: "8px" }} />
                      {task.task_title}
                    </div>
                  </td>

                  <td style={styles.tableCell}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TbBed size={20} style={{ marginRight: "8px" }} />
                      <div style={styles.wardContainer}>{task.ward}</div>
                    </div>
                  </td>

                  <td style={styles.tableCell}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PiStudentBold size={20} style={{ marginRight: "8px" }} />
                      <div style={styles.traineeContainer}>
                        #T{task.trainee.toString().padStart(3, "0")}
                      </div>
                    </div>
                  </td>

                  <td style={styles.tableCell}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <IoMdTime size={20} style={{ marginRight: "8px" }} />
                      {formatDate(task.task_date)}
                    </div>
                  </td>

                  <td style={styles.tableCell}>
                    <div
                      style={{
                        ...styles.statusContainer,
                        ...(task.review_status === "Pending"
                          ? styles.PendingStatus
                          : styles.CompleteStatus),
                      }}
                    >
                      {task.review_status}
                    </div>
                  </td>

                  {activeTab === "pending" && (
                    <td
                      style={{
                        ...styles.tableCell,
                        borderTopRightRadius: "5px",
                        borderBottomRightRadius: "5px",
                      }}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handleButtonClick(task.task_id)}
                      >
                        <HiDotsVertical size={20} color="#888" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedTaskId && <ShiftRate taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
      </div>
    </div>
  );
};

export default ShiftView;
