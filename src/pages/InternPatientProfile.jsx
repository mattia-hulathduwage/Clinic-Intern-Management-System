import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarIntern from "../components/SidebarIntern";
import { LuPhoneCall } from "react-icons/lu";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";

const InternPatientProfile = () => {
  const { patient_id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("details");

  // Fetch patient data when the component mounts or patient_id changes
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/patientbypid/${patient_id}`
        );
        if (!response.ok) {
          throw new Error("Patient not found.");
        }
        const data = await response.json();
        setPatientData(data.patient);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient_id]);

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
      zindex : "1000",
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
      }
    };
    
    const renderDetailsSection = () => {
      return (
        <div style={styles.detailsSection}>
          <h2 style = {styles.detailtitle}>Personal Details</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>First Name</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Last Name</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Gender</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{patientData.patient_fname}</td>
                <td style={styles.tableCell}>{patientData.patient_lname}</td>
                <td style={styles.tableCell}>{patientData.gender}</td>
              </tr>
            </tbody>
          </table>
    
          <table style={{ ...styles.table, marginTop: "20px"}}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Phone Number</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Email</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>+94 {patientData.contact}</td>
                <td style={styles.tableCell}>{patientData.email}</td>
                <td style={styles.tableCell}>{patientData.address}</td>
              </tr>
            </tbody>
          </table>

          <table style={{ ...styles.table, marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Date of Birth</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Blood Group</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>{patientData.dob}</td>
                <td style={styles.tableCell}>{patientData.blood_type}</td>
                <td style={styles.tableCell}></td>
              </tr>
            </tbody>
          </table>
          <h2 style = {styles.detailmedicaltitle}>Personal Details</h2>
          <table style={{ ...styles.table, marginBottom: "30px" }}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Primary Physician</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}>Current Ward</th>
                <th style={{ ...styles.tableHeader, ...styles.tableColumn }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableCell}>Dr.{patientData.doctor_fname} {patientData.doctor_lname}</td>
                <td style={styles.tableCell}></td>
                <td style={styles.tableCell}></td>
              </tr>
            </tbody>
          </table>
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
        return renderDetailsSection();
    }
  };

  return (
    <div style={styles.container}>
      <SidebarIntern />
      <div style={styles.content}>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {patientData && (
          <div>
            <p style={styles.nametitle}>
              <strong>
                {patientData.patient_fname} {patientData.patient_lname}
              </strong>
            </p>
            <p style={styles.idtitle}>
              <strong>
                ID: #{`P${patientData.id.toString().padStart(3, "0")}`}
              </strong>
              <strong style={styles.contacttitle}>
                <LuPhoneCall style={styles.phoneIcon} />
                +94 {patientData.contact}
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
                  color: selectedSection === "details" ? "black" : "rgba(0, 0, 0, 0.20)", // Set color based on selection
                  borderBottom: selectedSection === "details" ? "2px solid black" : "none", // Set color based on selection
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
                  color: selectedSection === "wardHistory" ? "black" : "rgba(0, 0, 0, 0.20)", // Set color based on selection
                  borderBottom: selectedSection === "wardHistory" ? "2px solid black" : "none", // Set color based on selection
                }}
                onClick={() => setSelectedSection("wardHistory")}
              >
                <MdOutlineHistory size={18} />
                Ward History
              </button>
              <button
                style={{
                  ...styles.optionbutton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 12px",
                  color: selectedSection === "attachment" ? "black" : "rgba(0, 0, 0, 0.20)", // Set color based on selection
                  borderBottom: selectedSection === "attachment" ? "2px solid black" : "none", // Set color based on selection
                }}
                onClick={() => setSelectedSection("attachment")}
              >
                <RiAttachment2 size={18} />
                Attachment
              </button>
            </div>
            <hr style={styles.horizontalline} />

            {renderSection()} {/* Render the content based on the selected section */}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternPatientProfile;
