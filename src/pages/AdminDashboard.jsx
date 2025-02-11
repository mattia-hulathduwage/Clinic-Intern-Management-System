import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/Sidebar_admin";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import moment from "moment";
import { Bar } from "react-chartjs-2"; // Import Bar chart component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faUserGraduate,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale } from "chart.js"; // UPDATED IMPORT

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, LinearScale, CategoryScale); // UPDATED REGISTRATION

const AdminDashboard = () => {

  const [logs, setLogs] = useState([]);
  const [internlogs, setinternLogs] = useState([]);

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
      marginTop: "10px",
      height: "300px",
      width: "550px", // Set width to 700px
      backgroundColor: "white",
      border: "2px solid rgb(234, 234, 234)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      padding: "10px",
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
  };

  useEffect(() => {
    // Fetch doctor logs from the API
    axios
      .get("http://localhost:5000/api/logs/doctor")
      .then((response) => {
        setLogs(response.data); // Set the data to state
      })
      .catch((error) => {
        console.error("Error fetching doctor logs:", error);
      });
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // Fetch doctor logs from the API
    axios
      .get("http://localhost:5000/api/logs/intern")
      .then((response) => {
        setinternLogs(response.data); // Set the data to state
      })
      .catch((error) => {
        console.error("Error fetching doctor logs:", error);
      });
  }, []); // Empty dependency array ensures this runs once on mount


  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
  const [counts, setCounts] = useState({
    totalDoctors: 0,
    totalInterns: 0,
    totalPatients: 0,
  });
  const [doctorTypeCounts, setDoctorTypeCounts] = useState({});
  const [loginStats, setLoginStats] = useState([]);

  useEffect(() => {
    const adminFname = localStorage.getItem("admin_fname") || "Admin";
    setName(adminFname);

    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      setGreeting("Good morning,");
    } else if (currentHour >= 12 && currentHour <= 15) {
      setGreeting("Good afternoon,");
    } else {
      setGreeting("Good evening,");
    }

    // Fetch the total counts
    axios
      .get("http://localhost:5000/admin/counts")
      .then((response) => {
        setCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });

    // Fetch doctor types for pie chart
    axios
      .get("http://localhost:5000/admin/active-users-count")
      .then((response) => {
        setDoctorTypeCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctor types:", error);
      });

    // Fetch login stats for bar chart
    axios
      .get("http://localhost:5000/login-stats")
      .then((response) => {
        setLoginStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching login stats:", error);
      });
  }, []);

  // Prepare pie chart data for doctor types
  const pieData = {
    labels: Object.keys(doctorTypeCounts),
    datasets: [
      {
        data: Object.values(doctorTypeCounts),
        backgroundColor: [
          "#4C3BCF",
          "#67C6E3",
          "#0A3C6B",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#3A2DB5",
          "#5AB2CD",
          "#08314F",
          "#3BAFA0",
          "#7F4BFF",
          "#FF7D20",
        ],
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
  const barData = {
    labels: loginStats.map((stat) => stat.date), // Dates from login stats
    datasets: [
      {
        label: 'Doctors',
        data: loginStats.map((stat) => stat.doctor_logins),
        backgroundColor: '#4C3BCF',
        borderColor: '#4C3BCF',
        borderWidth: 1,
        borderRadius: 8, // Add rounded corners to the top of the bars
      },
      {
        label: 'Interns',
        data: loginStats.map((stat) => stat.intern_logins),
        backgroundColor: '#67C6E3',
        borderColor: '#67C6E3',
        borderWidth: 1,
        borderRadius: 8, // Add rounded corners to the top of the bars
      },
    ],
  };
  

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false, // Hide grid lines on the x-axis
        },
      },
      y: {
        beginAtZero: true, // Ensure the y-axis starts at 0
        ticks: {
          stepSize: 1, // Ensure the ticks are spaced by 1 (whole numbers)
          callback: function(value) {
            return Number.isInteger(value) ? value : ''; // Only show whole numbers
          },
        },
        grid: {
          display: false, // Hide grid lines on the y-axis
        },
      },
    },
  };
  

  return (
    <div style={styles.container}>
      <SidebarAdmin />
      <div style={styles.content}>
        <h1>Dashboard</h1>
        <h2>
          👋 <span style={styles.greeting}>{greeting} </span>
          <span style={styles.name}>{name}</span>
        </h2>
        <div style={styles.widgetsContainer}>
          <div style={{ ...styles.widget, ...styles.widget1 }}>
            <div
              style={{
                ...styles.iconContainer,
                background: styles.iconContainerColors[0],
              }}
            >
              <FontAwesomeIcon icon={faUserMd} size="2x" color="#4C3BCF" />
            </div>
            <div style={styles.title}>Total Doctors</div>
            <div style={styles.contentText}>{counts.totalDoctors}</div>
          </div>
          <div style={{ ...styles.widget, ...styles.widget2 }}>
            <div
              style={{
                ...styles.iconContainer,
                background: styles.iconContainerColors[1],
              }}
            >
              <FontAwesomeIcon icon={faUserGraduate} size="2x" color="#4C3BCF" />
            </div>
            <div style={styles.title}>Total Interns</div>
            <div style={styles.contentText}>{counts.totalInterns}</div>
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
            <div style={styles.contentText}>{counts.totalPatients}</div>
          </div>
        </div>
        <div style={styles.widgetsContainer}>
          <div style={styles.newContainer}>
            <div style={styles.chartTitle}>Active Users</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
          <div style={styles.barchartContainer}>
            <div style={styles.chartTitle}>User Logins (Last 7 Days)</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        <div style={styles.widgetsContainer}>
        <div style={styles.tableContainer}>
            <div style={styles.tableTitle}>Today's Logins (Doctors)</div>{" "}
            {/* Title for the table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th2}>DoctorId</th>
                  <th style={styles.th2}>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 4).map((log, index) => (
                  <tr key={log.task_id}>
                    <td style={styles.td}>{log.logid}</td>{" "}
                    <td style={styles.td}>{log.userid}</td>
                    <td style={styles.td}>
                      {moment(log.date).format("DD-MM-YY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.tableContainer}>
            <div style={styles.tableTitle}>Today's Logins (Doctors)</div>{" "}
            {/* Title for the table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th2}>TraineeId</th>
                  <th style={styles.th2}>Date</th>
                </tr>
              </thead>
              <tbody>
                {internlogs.slice(0, 4).map((log, index) => (
                  <tr key={log.task_id}>
                    <td style={styles.td}>{log.logid}</td>{" "}
                    <td style={styles.td}>{log.userid}</td>
                    <td style={styles.td}>
                      {moment(log.date).format("DD-MM-YY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
