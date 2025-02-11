import React, { useEffect, useState } from "react";
import { FaUpload, FaSearch, FaUser } from "react-icons/fa";
import SidebarAdmin from "../components/Sidebar_admin";

const AdminPatient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // For filtered list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientsCount, setPatientsCount] = useState(0); // New state for patient count
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

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
      backgroundColor: "#5e17eb",
      color: "#fff",
      padding: "8px 12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.8rem",
      transition: "background-color 0.3s ease",
      fontFamily: "Poppins, sans-serif",
    },
    buttonHover: {
      backgroundColor: "#444444",
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
      genderMale: {
        display: "inline-block", // Allow the size to adjust to content
        backgroundColor: "rgba(57, 153, 24, 0.2)",
        color: "#399918",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap", // Prevent breaking to multiple lines
      },
      genderFemale: {
        display: "inline-block", // Allow the size to adjust to content
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        color: "#B80000",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap", // Prevent breaking to multiple lines
      },
      bloodTypeAPositive: {
        display: "inline-block",
        backgroundColor: "rgba(255, 165, 0, 0.2)", // Light orange
        color: "#FF9500",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeANegative: {
        display: "inline-block",
        backgroundColor: "rgba(255, 140, 0, 0.2)", // Slightly darker orange
        color: "#FF8C00",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeBPositive: {
        display: "inline-block",
        backgroundColor: "rgba(0, 191, 255, 0.2)", // Light sky blue
        color: "#00BFFF",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeBNegative: {
        display: "inline-block",
        backgroundColor: "rgba(30, 144, 255, 0.2)", // Dodger blue
        color: "#1E90FF",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeABPositive: {
        display: "inline-block",
        backgroundColor: "rgba(186, 85, 211, 0.2)", // Light purple
        color: "#BA55D3",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeABNegative: {
        display: "inline-block",
        backgroundColor: "rgba(148, 0, 211, 0.2)", // Darker purple
        color: "#9400D3",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeOPositive: {
        display: "inline-block",
        backgroundColor: "rgba(220, 20, 60, 0.2)", // Light crimson
        color: "#DC143C",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
      bloodTypeONegative: {
        display: "inline-block",
        backgroundColor: "rgba(178, 34, 34, 0.2)", // Firebrick red
        color: "#B22222",
        padding: "4px 8px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      },
    
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/patients");
        if (!response.ok) {
          throw new Error("Failed to fetch patients.");
        }
        const data = await response.json();
        setPatients(data.patients);
        setFilteredPatients(data.patients);
        setPatientsCount(data.patients.length);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = patients.filter((patient) =>
      patient.full_name.toLowerCase().includes(query)
    );

    setFilteredPatients(filtered);
  };

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <SidebarAdmin />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Manage Patients</h1>
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
                <FaUser style={styles.countIcon} />
              </div>
              <span style={{ fontWeight: 550 }}>{patientsCount} Patients</span>
            </div>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search Patients..."
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
                <th style={styles.tableHeaderCell}>DOB</th>
                <th style={styles.tableHeaderCell}>Gender</th>
                <th style={styles.tableHeaderCell}>Blood Type</th>
                <th style={styles.tableHeaderCell}>Contact</th>
                <th style={styles.tableHeaderCell}>Email</th>
                <th style={styles.tableHeaderCell}>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  style={styles.tableRow}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.tableRowHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={styles.tableCell}>{`#P${String(
                    patient.id
                  ).padStart(3, "0")}`}</td>
                  <td style={styles.tableCell}>{patient.full_name}</td>
                  <td style={styles.tableCell}>{patient.dob}</td>
                  <td style={styles.tableCell}>
                    <div
                      style={
                        patient.gender === "Male"
                          ? styles.genderMale
                          : styles.genderFemale
                      }
                    >
                      {patient.gender}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
  <div
    style={
      patient.blood_type === "A+"
        ? styles.bloodTypeAPositive
        : patient.blood_type === "A-"
        ? styles.bloodTypeANegative
        : patient.blood_type === "B+"
        ? styles.bloodTypeBPositive
        : patient.blood_type === "B-"
        ? styles.bloodTypeBNegative
        : patient.blood_type === "AB+"
        ? styles.bloodTypeABPositive
        : patient.blood_type === "AB-"
        ? styles.bloodTypeABNegative
        : patient.blood_type === "O+"
        ? styles.bloodTypeOPositive
        : styles.bloodTypeONegative // Default to O−
    }
  >
    {patient.blood_type}
  </div>
</td>

                  <td style={styles.tableCell}>{patient.contact}</td>
                  <td style={styles.tableCell}>{patient.email}</td>
                  <td style={styles.tableCell}>{patient.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPatient;
