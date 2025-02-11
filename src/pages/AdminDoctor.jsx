import React, { useEffect, useState } from "react";
import { FaUpload, FaUserMd, FaSearch } from "react-icons/fa"; // Added the ellipsis icon
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/Sidebar_admin";
import AdminDoctorAction from "../components/AdminDoctorAction";

const AdminDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const navigate = useNavigate();

  const handlePopupToggle = (doctor) => {
    setSelectedDoctor(doctor);
    setIsPopupVisible((prev) => !prev);
  };

  // This is the correct place to define reloadDoctors
  const reloadDoctors = (shouldReload) => {
    if (shouldReload) {
      fetchDoctors(); // Call fetchDoctors to reload the doctor list
    }
  };

  // Define fetchDoctors function
  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/doctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors.");
      }
      const data = await response.json();
      setDoctors(data.doctors);
      setFilteredDoctors(data.doctors);
      setDoctorsCount(data.doctors.length);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
    },
    content: {
      marginLeft: "290px",
      flex: 1,
      padding: "20px",
      backgroundColor: "white",
      fontFamily: "Poppins, sans-serif",
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
    button: {
      background: isButtonHovered
        ? "linear-gradient(to right,rgb(46, 21, 86),rgb(80, 27, 213))"
        : "linear-gradient(to right, #4a0fbf, rgb(120, 69, 223))",
      color: "#fff",
      padding: "8px 12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.8rem",
      transition: "background 0.3s ease",
      fontFamily: "Poppins, sans-serif",
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
    exportButtonHover: {
      backgroundColor: "rgba(94, 23, 235, 0.1)",
      color: "#5e17eb",
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
    dotsButton: {
      background: "transparent",
      border: "none",
      fontSize: "1.2rem", // Make the dots large enough
      cursor: "pointer",
      color: "#888", // Set a color for the dots
      padding: "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    popupStyles: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: isPopupVisible ? "translateX(0)" : "translateX(100%)", // Slide from the right
      transition: "transform 0.5s ease-in-out", // Transition effect
      zIndex: 10, // Ensure the popup appears above other elements
    },
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors.");
        }
        const data = await response.json();
        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors);
        setDoctorsCount(data.doctors.length);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = doctors.filter((doctor) =>
      `${doctor.doctor_fname} ${doctor.doctor_lname}`
        .toLowerCase()
        .includes(query)
    );

    setFilteredDoctors(filtered);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <SidebarAdmin />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Manage Doctors</h1>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              style={styles.exportButton}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  styles.exportButtonHover.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor =
                  styles.exportButton.backgroundColor)
              }
            >
              <FaUpload /> Export
            </button>
            <button
              style={styles.button}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={() => navigate("/admin/add-doctor")}
            >
              + Add Doctor
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
              <span style={{ fontWeight: 550 }}>{doctorsCount} Doctors</span>
            </div>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search Doctors..."
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
                <th style={styles.tableHeaderCell}>Type</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Actions</th>{" "}
                {/* New column */}
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.doctor_id}
                  style={styles.tableRow}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.tableRowHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{`#D${String(
                    doctor.doctor_id
                  ).padStart(3, "0")}`}</td>
                  <td
                    style={styles.tableCell}
                  >{`${doctor.doctor_fname} ${doctor.doctor_lname}`}</td>
                  <td style={styles.tableCell}>{doctor.email}</td>
                  <td style={styles.tableCell}>{doctor.telephone}</td>
                  <td style={styles.tableCell}>{doctor.enroll_date}</td>
                  <td style={styles.tableCell}>{doctor.type}</td>
                  <td style={styles.tableCell}>
                    <div
                      style={{
                        ...styles.statusContainer,
                        ...(doctor.status === "active"
                          ? styles.activeStatus
                          : styles.notActiveStatus),
                      }}
                    >
                      {doctor.status}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.dotsButton}
                      onClick={() => handlePopupToggle(doctor)} // Pass doctor to the popup
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#5e17eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#888")
                      }
                    >
                      &#x2022;&#x2022;&#x2022;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isPopupVisible && selectedDoctor && (
            <AdminDoctorAction
              onClose={(shouldReload) => {
                setIsPopupVisible(false);
                reloadDoctors(shouldReload);
              }}
              selectedDoctor={selectedDoctor} // Pass the selected doctor to the popup
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctor;
