import React, { useEffect, useState } from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"; // Import Bar chart component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
} from "chart.js"; // UPDATED IMPORT

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale
); // UPDATED REGISTRATION

const DoctorDashboard = () => {
  const [assignedInternsCount, setAssignedInternsCount] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [internStatusCounts, setInternStatusCounts] = useState({
    active: 0,
    inactive: 0,
  });
  const [taskCounts, setTaskCounts] = useState([]);
  const [tasks, setTasks] = useState([]);

  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A"; // Fallback if no value
    const date = new Date(dateTime);
    return date.toLocaleDateString(); // This will display only the date
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
      overflowY: "auto",
    },
    greeting: {
      color: "rgb(185, 185, 185)",
      fontWeight: "bold",
    },
    name: {
      color: "rgb(56, 56, 56)",
      fontWeight: "bold",
    },
    widgetsContainer: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: "20px",
    },
    widget: {
      flex: "1",
      height: "50px",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      margin: "0 10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "left",
      border: "2px solid rgb(234, 234, 234)",
      position: "relative",
    },
    iconContainer: {
      position: "absolute",
      top: "50%",
      right: "10px",
      width: "50px",
      height: "50px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      transform: "translateY(-50%)",
      marginRight: "20px",
      border: "3px solid rgba(185, 185, 185, 0.46)",
    },
    iconContainerColors: [
      "linear-gradient(to right, white, white)", // Yellow Gradient
      "linear-gradient(to right, white, white)", // Green Gradient
      "linear-gradient(to right, white, white)", // Blue Gradient
    ],
    title: {
      marginTop: "10px",
      marginBottom: "0px",
      fontSize: "16px",
    },
    contentText: {
      color: "#333",
      fontSize: "36px",
      fontWeight: "bold",
    },
    widget1: {
      background: "linear-gradient(to right, white, white 60%, white 150%)",
    },
    widget2: {
      background: "linear-gradient(to right, white, white 60%, white 150%)",
    },
    widget3: {
      background: "linear-gradient(to right, white, white 60%, white 150%)",
    },
    newContainer: {
      marginLeft: "10px",
      marginTop: "10px",
      width: "350px",
      height: "300px",
      backgroundColor: "white",
      border: "2px solid rgb(234, 234, 234)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    },
    barchartContainer: {
      marginLeft: "25px",
      marginTop: "10px",
      width: "760px", // Set width to 700px
      height: "300px", // Keep the same height as the newContainer
      backgroundColor: "white",
      border: "2px solid rgb(234, 234, 234)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    },
    chartTitle: {
      fontSize: "16px",
      fontWeight: "normal",
      marginBottom: "0px",
      color: "#333",
      textAlign: "left", // Ensures the title is aligned to the left
      alignSelf: "flex-start", // Keeps the title aligned within the parent container
      padding: "20px",
    },
    tableContainer: {
      marginLeft: "10px",
      marginRight: "20px",
      marginTop: "10px",
      height: "300px",
      width: "550px", // Set width to 700px
      backgroundColor: "white",
      border: "2px solid rgb(234, 234, 234)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      padding: "15px",
    },
    tableTitle: {
      fontSize: "16px",
      fontWeight: "normal",
      marginBottom: "0px",
      color: "#333", // Ensures the title is aligned to the left
      alignSelf: "flex-start", // Keeps the title aligned within the parent container
      marginTop: "0px", // Remove top margin
      padding: "20px", // Add padding to separate from the table
      textAlign: "left", // Align left
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f4f4f4", // Light gray background color for header
      borderTopLeftRadius: "8px", // Apply border radius
      borderBottomLeftRadius: "8px",
      color: "rgb(137, 137, 137)",
      fontSize: "0.8rem",
    },
    th2: {
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f4f4f4", // Light gray background color for header
      color: "rgb(137, 137, 137)",
      fontSize: "0.8rem",
    },
    th3: {
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f4f4f4", // Light gray background color for header
      borderTopRightRadius: "8px", // Apply border radius
      borderBottomRightRadius: "8px",
      color: "rgb(137, 137, 137)",
      fontSize: "0.8rem",
    },
    td: {
      padding: "10px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      fontSize: "0.8rem",
    },
    tableContainer1: {
      marginLeft: "10px",
      marginTop: "10px",
      height: "300px",
      width: "540px", // Set width to 700px
      backgroundColor: "white",
      border: "2px solid rgb(234, 234, 234)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      padding: "15px",
    },
  };

  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/admin/counts`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Admin Counts:", data);
        setTotalPatients(data.totalPatients || 0);
      })
      .catch((error) => {
        console.error("Error fetching total patients:", error);
      });
  }, []);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctor_id from localStorage
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/doctor/task-status/count/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Task counts:", data);
        setTaskCounts(data.task_counts || []);
      })
      .catch((error) => {
        console.error("Error fetching task counts:", error);
      });
  }, []);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctor_id from localStorage
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/intern/assigned-trainees/count/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Assigned Interns Count:", data);
        setAssignedInternsCount(data.assigned_trainee_count || 0);
      })
      .catch((error) => {
        console.error("Error fetching assigned interns count:", error);
      });
  }, []);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctor_id from localStorage
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/doctor/pending-reviews/count/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Pending Task Count:", data);
        setPendingTaskCount(data.pending_task_count || 0);
      })
      .catch((error) => {
        console.error("Error fetching pending task count:", error);
      });
  }, []);

  useEffect(() => {
    const traineeFname = localStorage.getItem("doctor_fname") || "Admin";
    setName(traineeFname);

    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      setGreeting("Good morning,");
    } else if (currentHour >= 12 && currentHour <= 15) {
      setGreeting("Good afternoon,");
    } else {
      setGreeting("Good evening,");
    }

    // Fetch login stats for bar chart
  }, []);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctor_id from localStorage
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/trainee/status/count/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Intern status count:", data);
        const activeCount =
          data.trainee_counts.find((item) => item.status === "active")
            ?.trainee_count || 0;
        const inactiveCount =
          data.trainee_counts.find((item) => item.status === "inactive")
            ?.trainee_count || 0;

        setInternStatusCounts({
          active: activeCount,
          inactive: inactiveCount,
        });
      })
      .catch((error) => {
        console.error("Error fetching intern status count:", error);
      });
  }, []);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id"); // Retrieve doctor_id from localStorage
    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/tasks/today/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Today's tasks:", data);
        setTasks(data || []); // Set the tasks data
      })
      .catch((error) => {
        console.error("Error fetching today's tasks:", error);
      });
  }, []);

  const pieData = {
    labels: ["Active", "Inactive"], // Active and Inactive labels
    datasets: [
      {
        data: [internStatusCounts.active, internStatusCounts.inactive], // Active and Inactive counts
        backgroundColor: ["#4C3BCF", "#67C6E3"], // Green for Active, Red for Inactive
        hoverBackgroundColor: ["#45a049", "#e55347"], // Darker shades for hover effect
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    cutout: "50%", // This makes it a donut chart
  };

  // Prepare bar chart data
  // Prepare bar chart data
  const barData = {
    labels: taskCounts.map(
      (item) => `#T${String(item.trainee).padStart(3, "0")}`
    ), // Trainee labels
    datasets: [
      {
        label: "Pending Tasks",
        data: taskCounts.map((item) => item.pending_task_count), // Pending tasks for each trainee
        backgroundColor: "#67C6E3", // Red for pending tasks
        borderColor: "#67C6E3",
        borderWidth: 1,
        borderRadius: 8, // Rounded corners for the bars
      },
      {
        label: "Completed Tasks",
        data: taskCounts.map((item) => item.completed_task_count), // Completed tasks for each trainee
        backgroundColor: "#4C3BCF", // Blue for completed tasks
        borderColor: "#4C3BCF",
        borderWidth: 1,
        borderRadius: 8, // Rounded corners for the bars
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2, // Adjust step size as needed
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        <h1>Dashboard</h1>
        <h2>
          👋 <span style={styles.greeting}>{greeting} </span>
          <span style={styles.name}>Dr.{name}</span>
        </h2>
        <div style={styles.widgetsContainer}>
          <div style={{ ...styles.widget, ...styles.widget1 }}>
            <div
              style={{
                ...styles.iconContainer,
                background: styles.iconContainerColors[0],
              }}
            >
              <FontAwesomeIcon
                icon={faUserGraduate}
                size="2x"
                color="#4C3BCF"
              />
            </div>
            <div style={styles.title}>Assigned Interns</div>
            <div style={styles.contentText}>{assignedInternsCount}</div>{" "}
            {/* Show task count here */}
          </div>

          <div style={{ ...styles.widget, ...styles.widget2 }}>
            <div
              style={{
                ...styles.iconContainer,
                background: styles.iconContainerColors[1],
              }}
            >
              <FontAwesomeIcon icon={faHourglass} size="2x" color="#4C3BCF" />
            </div>
            <div style={styles.title}>Pending Tasks</div>
            <div style={styles.contentText}>{pendingTaskCount}</div>
          </div>
          <div style={{ ...styles.widget, ...styles.widget3 }}>
            <div
              style={{
                ...styles.iconContainer,
                background: styles.iconContainerColors[2],
              }}
            >
              <FontAwesomeIcon icon={faUser} size="2x" color="#4C3BCF" />
            </div>
            <div style={styles.title}>Total Patients</div>
            <div style={styles.contentText}>{totalPatients}</div>
          </div>
        </div>
        <div style={styles.widgetsContainer}>
          <div style={styles.newContainer}>
            <div style={styles.chartTitle}>Intern Status</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
          <div style={styles.barchartContainer}>
            <div style={styles.chartTitle}>Task Dsitribution</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        <div style={styles.widgetsContainer}>
          <div style={styles.tableContainer}>
            <div style={styles.tableTitle}>Daily Tasks</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th2}>Task</th>
                  <th style={styles.th2}>Trainee</th>
                  <th style={styles.th2}>Date</th>
                  <th style={styles.th3}>Time</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 4).map(
                  (
                    task // Limit to first 4 items
                  ) => (
                    <tr key={task.task_id}>
                      <td style={styles.td}>{`#${String(task.task_id).padStart(
                        3,
                        "0"
                      )}`}</td>
                      <td style={styles.td}>{task.task_title}</td>
                      <td style={styles.td}>{`#T${String(task.trainee).padStart(
                        3,
                        "0"
                      )}`}</td>
                      <td style={styles.td}>
                        {formatDate(task.task_date)}
                      </td>{" "}
                      {/* Displays only date */}
                      <td style={styles.td}>
                        {task.due_time ? task.due_time : task.shift_end}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.tableContainer1}>
            <div style={styles.tableTitle}>Recently Completed</div>
            
          </div>
        </div>
        {/* Table below the Pie chart */}
        {/* Table below the Pie chart */}
      </div>
    </div>
  );
};

export default DoctorDashboard;
