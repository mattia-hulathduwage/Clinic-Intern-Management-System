import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarDoctor from "../components/SidebarDoctor";
import { LuPhoneCall } from "react-icons/lu";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { CgPerformance } from "react-icons/cg";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoctorInternProfile = () => {
  const { trainee_id } = useParams();
  const [TraineeData, setTraineeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("details");
  const [doctorData, setDoctorData] = useState(null); // Store doctor details

  // Fetch patient data when the component mounts or patient_id changes
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/traineebyid/${trainee_id}`
        );
        if (!response.ok) {
          throw new Error("Patient not found.");
        }
        const data = await response.json();
        setTraineeData(data.trainee); // Set the correct data here
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [trainee_id]);
  useEffect(() => {
    const fetchDoctorByTrainee = async () => {
      if (TraineeData && TraineeData.assigned_to) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/doctornamebyid/${TraineeData.assigned_to}`
          );
          if (!response.ok) {
            throw new Error("Doctor not found.");
          }
          const data = await response.json();
          setDoctorData(data.doctor);
        } catch (err) {
          console.error("Error fetching doctor:", err.message);
        }
      }
    };

    fetchDoctorByTrainee();
  }, [TraineeData]);

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
    nametitle: {
      fontSize: "1.4rem",
      fontWeight: "bold",
      marginBottom: "15px",
      textAlign: "left",
      padding: "4px 8px",
      backgroundColor: "rgba(30, 144, 255, 0.2)",
      color: "#1E90FF",
      borderRadius: "8px",
      width: "fit-content",
    },
    idtitle: {
      fontSize: "1.0rem",
      fontWeight: "bold",
      color: "#8C8C8C",
      marginBottom: "15px",
      textAlign: "left",
    },
    contacttitle: {
      fontSize: "1.0rem",
      fontWeight: "bold",
      color: "#6D6D6D",
      marginLeft: "40px",
    },
    phoneIcon: {
      marginRight: "8px",
      marginBottom: "-2px",
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
    tableHeader: {
      textAlign: "left",
      padding: "10px",
      fontFamily: "Poppins, sans-serif",
      color: "#8C8C8C",
      fontWeight: "normal",
    },
    tableCell: {
      padding: "8px",
      textAlign: "left",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "normal",
    },
    detailsSection: {
      marginTop: "20px",
    },
    assigntitle: {
      fontSize: "1.2rem",
      marginTop: "30px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableColumn: {
      width: "33%", // Each column takes up 1/3 of the table width
    },
    detailtitle: {
      fontSize: "1.2rem",
      marginTop: "20px",
    },
    detailmedicaltitle: {
      fontSize: "1.2rem",
      marginTop: "30px",
    },
    charttitle: {
      fontSize: "1.2rem",
      marginTop: "20px",
    },
  };

  const PerformanceSection = ({ trainee_id }) => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPerformanceData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/traineeperformance/${trainee_id}`
          );
          const data = await response.json();
          setPerformanceData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching performance data:", error);
          setLoading(false);
        }
      };
      fetchPerformanceData();
    }, [trainee_id]);

    if (loading) {
      return <p>Loading performance data...</p>;
    }

    const { data, average_rating } = performanceData;

    // Define task type colors
    const taskTypeColors = {
      "Lab Report": "#4C3BCF", // Purple for Lab Report
      "Ward Visit": "#67C6E3", // Orange-yellow for Ward Visit
    };

    // Preparing data for the bar chart
    const chartData = {
      // Change this line from task_type to task_date
      labels: data.map((item) => new Date(item.task_date).toLocaleDateString()), // Format date as needed

      datasets: [
        {
          label: "Task Ratings",
          data: data.map((item) => item.rating), // Ratings for each task
          backgroundColor: data.map(
            (item) => taskTypeColors[item.task_type] || "#67C6E3"
          ), // Use task type colors
          borderColor: data.map(
            (item) => taskTypeColors[item.task_type] || "#67C6E3"
          ), // Use task type border colors
          borderWidth: 1,
          borderRadius: 8, // Add rounded corners to the top of the bars
          maxBarThickness: 70,
        },
      ],
    };

    // Custom legend items for unique task types
    const legendItems = [
      {
        text: "Lab Report",
        fillStyle: taskTypeColors["Lab Report"],
        strokeStyle: taskTypeColors["Lab Report"],
      },
      {
        text: "Ward Visit",
        fillStyle: taskTypeColors["Ward Visit"],
        strokeStyle: taskTypeColors["Ward Visit"],
      },
    ];

    // Chart options
const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        grid: {
          display: false, // Hide grid lines on the x-axis
        },
      },
      y: {
        beginAtZero: true, // Ensure the y-axis starts at 0
        ticks: {
          stepSize: 20, // Set gap between ticks to 20
          callback: function (value) {
            return value % 20 === 0 ? value : ""; // Show ticks that are multiples of 20
          },
        },
        grid: {
          display: false, // Hide grid lines on the y-axis
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "",
        font: { size: 20 },
        align: "start", // Align title to the left
      },
      legend: {
        labels: {
          generateLabels: function () {
            return legendItems; // Use the custom legend items
          },
        },
      },
    },
  };
  

    return (
      <div
        style={{
          position: "relative",
          height: "480px",
          width: "94%",
          margin: "0 auto",
        }}
      >
        {/* Average rating display */}
        <div
  style={{
    position: "absolute",
    top: 10,
    right: 20,
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "rgba(57, 153, 24, 0.2)",
    color: "#399918",
    padding: "5px 10px",  // Adjust padding for better appearance
    borderRadius: "5px",  // Optional: Add rounded corners to the container
  }}
>
  Avg: {average_rating.toFixed(2)}
</div>


        {/* Bar chart */}
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  const renderDetailsSection = () => {
    return (
      <div style={styles.detailsSection}>
        <h2 style={styles.detailtitle}>Personal Details</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                First Name
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Last Name
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Gender
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>{TraineeData.trainee_fname}</td>
              <td style={styles.tableCell}>{TraineeData.trainee_lname}</td>
              <td style={styles.tableCell}>N/A</td>{" "}
              {/* Gender field not present in the data */}
            </tr>
          </tbody>
        </table>

        <table style={{ ...styles.table, marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Phone Number
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Email
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Username
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>+94 {TraineeData.telephone}</td>
              <td style={styles.tableCell}>{TraineeData.email}</td>
              <td style={styles.tableCell}>{TraineeData.trainee_username}</td>
            </tr>
          </tbody>
        </table>

        <h2 style={styles.assigntitle}>Assigned Details</h2>
        <table style={{ ...styles.table, marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Assigned Physician
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Enroll Date
              </th>
              <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>
                Duty
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>
                Dr.
                {doctorData
                  ? `${doctorData.f_name} ${doctorData.l_name}`
                  : "Loading..."}
              </td>
              <td style={styles.tableCell}>{TraineeData.enroll_date}</td>{" "}
              {/* Blood Group not present in the data */}
              <td style={styles.tableCell}>{TraineeData.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderPerformanceSection = () => {
    return (
      <div>
        {/* Add your <p> text here */}
        <p style={styles.charttitle}><strong>Performance Evaluation</strong></p>
  
        {/* Performance Section component */}
        <PerformanceSection trainee_id={trainee_id} />
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
      case "performance":
        return renderPerformanceSection();
      default:
        return renderDetailsSection();
    }
  };

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {TraineeData && (
          <div>
            <p style={styles.nametitle}>
              <strong>
                {TraineeData.trainee_fname} {TraineeData.trainee_lname}
              </strong>
            </p>
            <p style={styles.idtitle}>
              <strong>
                ID: #{`T${TraineeData.id.toString().padStart(3, "0")}`}
              </strong>
              <strong style={styles.contacttitle}>
                <LuPhoneCall style={styles.phoneIcon} />
                +94 {TraineeData.telephone}
              </strong>
            </p>
            <div style={styles.optionbuttoncontainer}>
              <button
                style={{
                  ...styles.optionbutton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 12px",
                  color:
                    selectedSection === "details"
                      ? "black"
                      : "rgba(0, 0, 0, 0.20)", // Set color based on selection
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
                    selectedSection === "wardHistory"
                      ? "2px solid black"
                      : "none", // Set color based on selection
                }}
                onClick={() => setSelectedSection("wardHistory")}
              >
                <MdOutlineHistory size={18} />
                Task History
              </button>
              <button
                style={{
                  ...styles.optionbutton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 12px",
                  color:
                    selectedSection === "attachment"
                      ? "black"
                      : "rgba(0, 0, 0, 0.20)", // Set color based on selection
                  borderBottom:
                    selectedSection === "attachment"
                      ? "2px solid black"
                      : "none", // Set color based on selection
                }}
                onClick={() => setSelectedSection("attachment")}
              >
                <RiAttachment2 size={18} />
                Shifts
              </button>
              <button
                style={{
                  ...styles.optionbutton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 12px",
                  color:
                    selectedSection === "performance"
                      ? "black"
                      : "rgba(0, 0, 0, 0.20)", // Set color based on selection
                  borderBottom:
                    selectedSection === "performance"
                      ? "2px solid black"
                      : "none", // Set color based on selection
                }}
                onClick={() => setSelectedSection("performance")}
              >
                <CgPerformance size={18} />
                Performance
              </button>
            </div>
            <hr style={styles.horizontalline} />
            {renderSection()}{" "}
            {/* Render the content based on the selected section */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorInternProfile;
