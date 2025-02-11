import React, { useEffect, useState } from "react";
import { FaUpload, FaSearch, FaUserMd, FaArrowRight } from "react-icons/fa";
import SidebarDoctor from "../components/SidebarDoctor";
import { useNavigate } from "react-router-dom";

const DoctorIntern = () => {
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [traineeCount, setTraineeCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");

    const fetchTrainees = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trainees/assigned?doctorId=${doctorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trainees.");
        }
        const data = await response.json();
        setTrainees(data.trainees);
        setFilteredTrainees(data.trainees);
        setTraineeCount(data.trainees.length);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrainees();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = trainees.filter((trainee) =>
      `${trainee.fname} ${trainee.lname}`.toLowerCase().includes(query)
    );

    setFilteredTrainees(filtered);
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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "600",
    },
    exportButton: {
      backgroundColor: "transparent",
      border: "2px solid #5e17eb",
      color: "#5e17eb",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.8rem",
      fontWeight: "550",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontFamily: "Poppins, sans-serif",
      transition: "all 0.3s ease",
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    searchInput: {
      width: "250px",
      padding: "10px 12px",
      paddingLeft: "35px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "0.8rem",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
    },
    searchIcon: {
      position: "absolute",
      left: "10px",
      fontSize: "1rem",
      color: "#888",
    },
    tableWrapper: {
      maxHeight: "530px",
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
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      backgroundColor: "#E5E4E2",
      borderRadius: "6px",
      border: "1px solid #e0e0e0",
    },
    countIcon: {
      fontSize: "1.2rem",
      color: "#708090",
    },
    statusContainer: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
    },
    activeStatus: {
      backgroundColor: "rgba(57, 153, 24, 0.2)",
      color: "#399918",
    },
    notActiveStatus: {
      backgroundColor: "rgba(184, 0, 0, 0.2)",
      color: "#B80000",
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <SidebarDoctor />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Assigned Interns</h1>
          <div style={{ display: "flex", gap: "15px" }}>
            <button style={styles.exportButton}>
              <FaUpload /> Export
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.iconContainer}>
                <FaUserMd style={styles.countIcon} />
              </div>
              <span style={{ fontWeight: 550 }}>{traineeCount} Interns</span>
            </div>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search Interns..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>ID</th>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Email</th>
                <th style={styles.tableHeaderCell}>Contact</th>
                <th style={styles.tableHeaderCell}>Enrollment Date</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainees.map((trainee) => (
                <tr
                  key={trainee.id}
                  style={styles.tableRow}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.tableRowHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{`#T${String(
                    trainee.id
                  ).padStart(3, "0")}`}</td>
                  <td
                    style={styles.tableCell}
                  >{`${trainee.fname} ${trainee.lname}`}</td>
                  <td style={styles.tableCell}>{trainee.email}</td>
                  <td style={styles.tableCell}>{trainee.contact}</td>
                  <td style={styles.tableCell}>{trainee.enroll_date}</td>
                  <td style={styles.tableCell}>
                    <div
                      style={{
                        ...styles.statusContainer,
                        ...(trainee.status === "active"
                          ? styles.activeStatus
                          : styles.notActiveStatus),
                      }}
                    >
                      {trainee.status}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/doctor/internprofile/${trainee.id}`)
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.firstChild.style.color = "#5e17eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.firstChild.style.color = "#888")
                      }
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
    </div>
  );
};

export default DoctorIntern;
