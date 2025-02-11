import React, { useEffect, useState } from "react";
import SidebarIntern from "../components/SidebarIntern";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"; // Import Bar chart component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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

const InternDashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [pendingTasksList, setPendingTasksList] = useState([]);
  const [pendingWardVisitTasks, setPendingWardVisitTasks] = useState([]);

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
      marginTop: "30px",
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

  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
  const [counts, setCounts] = useState({
    totalDoctors: 0,
    totalInterns: 0,
    totalPatients: 0,
    totalTasks: 0, // Add totalTasks field to counts
  });
  const [taskcount, setTaskCount] = useState({
    totalTasks: 0,
  });
  const [pendingcount, setPendingCount] = useState({
    pendingTasks: 0,
  });
  const [doctorTypeCounts, setDoctorTypeCounts] = useState({});

  useEffect(() => {
    const traineeId = localStorage.getItem("trainee_id") || "defaultTraineeId";
    const traineeFname = localStorage.getItem("trainee_fname") || "Admin";
    setName(traineeFname);

    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      setGreeting("Good morning,");
    } else if (currentHour >= 12 && currentHour <= 15) {
      setGreeting("Good afternoon,");
    } else {
      setGreeting("Good evening,");
    }

    // Fetch task count for the specific trainee using fetch
    fetch(`http://localhost:5000/intern/task-count/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Task count response:", data); // Check the response
        setTaskCount((prevCounts) => ({
          ...prevCounts,
          totalTasks: data.totalTasks, // Update totalTasks
        }));
      })
      .catch((error) => {
        console.error("Error fetching task count:", error);
      });

    // Fetch task count for the specific trainee using fetch
    fetch(`http://localhost:5000/intern/pendingtask-count/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Task count response:", data); // Check the response
        setPendingCount((prevCounts) => ({
          ...prevCounts,
          pendingTasks: data.pendingTasks, // Update totalTasks
        }));
      })
      .catch((error) => {
        console.error("Error fetching task count:", error);
      });

    // Fetch the total counts
    fetch("http://localhost:5000/admin/counts")
      .then((response) => response.json())
      .then((data) => {
        setCounts(data);
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });
    // Fetch login stats for bar chart
  }, []);

  useEffect(() => {
    const traineeId = localStorage.getItem("trainee_id") || "defaultTraineeId";

    // Fetch the performance data
    fetch(`http://localhost:5000/api/traineeperformance/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Performance data:", data); // Check the response

        // Process the data to extract dates, ratings, and task types
        const dates = data.data.map((item) => item.task_date);
        const ratings = data.data.map((item) => item.rating);
        const taskTypes = data.data.map((item) => item.task_type); // Add task type

        // Store processed data in state
        setPerformanceData({
          dates: dates,
          ratings: ratings,
          taskTypes: taskTypes, // Store task types
        });
      })
      .catch((error) => {
        console.error("Error fetching performance data:", error);
      });
  }, []);

  useEffect(() => {
    const traineeId = localStorage.getItem("trainee_id") || "defaultTraineeId";

    // Fetch task status count for the specific trainee
    fetch(`http://localhost:5000/intern/task-status-count/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Task status count response:", data); // Debugging
        setDoctorTypeCounts({
          Pending: data.pending,
          Submitted: data.submitted,
          Reviewed: data.reviewed,
        });
      })
      .catch((error) => {
        console.error("Error fetching task status count:", error);
      });
  }, []);

  useEffect(() => {
    const traineeId = localStorage.getItem("trainee_id") || "defaultTraineeId";

    // Fetch pending tasks list for the specific trainee
    fetch(`http://localhost:5000/intern/pending-taskslist/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Pending tasks list:", data); // Check the response
        setPendingTasksList(data.pendingTasks); // Store the pending tasks in the state
      })
      .catch((error) => {
        console.error("Error fetching pending tasks list:", error);
      });
  }, []);

  useEffect(() => {
    const traineeId = localStorage.getItem("trainee_id") || "defaultTraineeId";

    // Fetch pending ward visit tasks
    fetch(`http://localhost:5000/intern/pending-wardvisit-tasks/${traineeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Pending ward visit tasks:", data);
        setPendingWardVisitTasks(data.pendingWardVisitTasks);
      })
      .catch((error) => {
        console.error("Error fetching pending ward visit tasks:", error);
      });
  }, []);

  const pieData = {
    labels: ["Pending", "Submitted", "Reviewed"], // Updated Labels
    datasets: [
      {
        data: [
          doctorTypeCounts.Pending || 0,
          doctorTypeCounts.Submitted || 0,
          doctorTypeCounts.Reviewed || 0,
        ], // Task Status Counts
        backgroundColor: [
          "#67C6E3", // Orange for Pending
          "#4C3BCF", // Blue for Submitted
          "#3A8DFF", // Green for Reviewed
        ],
        hoverBackgroundColor: [
          "#FF8C00", // Darker Orange
          "#187BCD", // Darker Blue
          "#228B22", // Darker Green
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
  // Prepare bar chart data
  const barData = {
    labels: Array.isArray(performanceData.dates)
      ? performanceData.dates.map((date) => moment(date).format("DD-MM-YY")) // Format the date as Day-Month-Year
      : [],
    datasets: [
      {
        label: "Performance Ratings",
        data: Array.isArray(performanceData.ratings)
          ? performanceData.ratings
          : [], // Ratings for each task
        backgroundColor: Array.isArray(performanceData.taskTypes)
          ? performanceData.taskTypes.map(
              (taskType) => (taskType === "Lab Report" ? "#4C3BCF" : "#67C6E3") // Light blue for Lab Report, dark blue for Ward Visit
            )
          : [], // Color based on task type
        borderColor: Array.isArray(performanceData.taskTypes)
          ? performanceData.taskTypes.map(
              (taskType) => (taskType === "Lab Report" ? "#4C3BCF" : "#67C6E3") // Same color for borders
            )
          : [],
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
        max: 100, // Enforcing the Y-axis to end at 100
        ticks: {
          stepSize: 20, // Adjust step size to fit your needs
          callback: function (value) {
            return value + "%"; // Append '%' symbol to the Y-axis values
          },
          grid: {
            display: false,
          },
        },
      },
    },
  };
  

  return (
    <div style={styles.container}>
      <SidebarIntern />
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
              <FontAwesomeIcon icon={faTasks} size="2x" color="#4C3BCF" />
            </div>
            <div style={styles.title}>Total Tasks</div>
            <div style={styles.contentText}>{taskcount.totalTasks}</div>{" "}
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
            <div style={styles.contentText}>{pendingcount.pendingTasks}</div>
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
            <div style={styles.chartTitle}>Task Overview</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
          <div style={styles.barchartContainer}>
            <div style={styles.chartTitle}>Analytics</div>
            <div style={{ width: "90%", height: "80%", marginTop: "-15px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        {/* Table below the Pie chart */}
        {/* Table below the Pie chart */}
        <div style={{ display: "flex", gap: "20px", marginTop: "00px" }}>
          <div style={styles.tableContainer}>
            <div style={styles.tableTitle}>Pending Lab Tasks</div>{" "}
            {/* Title for the table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th2}>Task Title</th>
                  <th style={styles.th2}>Patient</th>
                  <th style={styles.th2}>Task Date</th>
                  <th style={styles.th3}>Due Time</th>
                </tr>
              </thead>
              <tbody>
                {pendingTasksList.slice(0, 4).map((task, index) => (
                  <tr key={task.task_id}>
                    <td style={styles.td}>{task.task_id}</td>{" "}
                    {/* Display task_id here */}
                    <td style={styles.td}>{task.task_title}</td>
                    <td style={styles.td}>{task.patient}</td>
                    <td style={styles.td}>
                      {moment(task.task_date).format("DD-MM-YY")}
                    </td>
                    <td style={styles.td}>{task.due_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.tableContainer}>
            <div style={styles.tableTitle}>Pending Ward Tasks</div>{" "}
            {/* Title for the table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th2}>Ward</th>
                  <th style={styles.th2}>Date</th>
                  <th style={styles.th2}>Start</th>
                  <th style={styles.th3}>End</th>
                </tr>
              </thead>
              <tbody>
                {pendingWardVisitTasks.slice(0, 4).map((task, index) => (
                  <tr key={task.task_id}>
                    <td style={styles.td}>{task.task_id}</td>{" "}
                    {/* Display task_id here */}
                    <td style={styles.td}>{task.ward}</td>
                    <td style={styles.td}>
                      {moment(task.task_date).format("DD-MM-YY")}
                    </td>
                    <td style={styles.td}>{task.shift_start}</td>
                    <td style={styles.td}>{task.shift_end}</td>
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

export default InternDashboard;
