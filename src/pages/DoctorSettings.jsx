import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarDoctor";
import DoctorPassword from "../components/DoctorPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const DoctorSettings = () => {
  const [doctorUsername, setDoctorUsername] = useState("");
  const [doctorFullName, setDoctorFullName] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const doctorFName = localStorage.getItem("doctor_fname");
    const doctorLName = localStorage.getItem("doctor_lname");
    const username = localStorage.getItem("doctor_username");
    const password = localStorage.getItem("doctor_password");

    if (doctorFName && doctorLName) {
      setDoctorFullName(`  ${doctorFName} ${doctorLName}`);
    }
    if (username) {
      setDoctorUsername(`  ${username}`);
    }
    if (password) {
      setDoctorPassword(`  ${password}`);
    }
  }, []);

  const handlePopupToggle = () => {
    setIsPopupVisible((prev) => !prev);
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
      fontSize: "1.8rem",
      fontWeight: "600",
    },
    adminName: {
      fontSize: "1.2rem",
      color: "#808080",
      marginTop: "10px",
    },
    adminTitle: {
      fontSize: "1rem",
      color: "#A9A9A9",
      marginTop: "-15px",
    },
    infoContainer: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "white",
      border: "0px solid #F0F0F0",
      borderRadius: "20px",
    },
    formGroup: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
    },
    label: {
      fontSize: "1rem",
      fontWeight: "505",
      color: "#333",
      marginRight: "10px",
      flex: "0 0 120px",
    },
    input: {
      width: "400px",
      height: "25px",
      padding: "8px 40px 8px 8px",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      position: "relative",
    },
    lockIcon: {
      color: "#A9A9A9",
      position: "absolute",
      right: "40px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    button: {
      marginLeft: "40px",
      padding: "8px 12px",
      backgroundColor: "#5e17eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "background-color 0.3s ease",
      fontFamily: "Poppins, sans-serif",
    },
    buttonHover: {
      backgroundColor: "#8B5DFF",
    },
    divider: {
      margin: "40px 0",
      border: "none",
      borderTop: "2px solid #F0F0F0",
    },
    actionButton: {
      margin: "20px 50px",
      padding: "10px 20px",
      backgroundColor: "#B8001F",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontFamily: "Poppins, sans-serif",
      transition: "background-color 0.3s ease",
    },
    saveButton: {
      backgroundColor: "#5e17eb",
      color: "#fff",
      width: "150px",
      height: "42px",
      fontFamily: "Poppins, sans-serif",
      fontSize: "1rem",
    },
    discardButton: {
      backgroundColor: "#E8E8E8",
      color: "#B8001F",
      fontWeight: "500",
      width: "150px",
      height: "42px",
      marginLeft: "60px",
      fontFamily: "Poppins, sans-serif",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <SidebarAdmin />
      <div style={styles.content}>
        <h1 style={styles.header}>Settings</h1>
        <p style={styles.adminName}>{doctorFullName}</p>
        <p style={styles.adminTitle}>Doctor</p>
        <div style={styles.infoContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type="text"
                id="username"
                value={doctorUsername}
                readOnly
              />
              <FontAwesomeIcon icon={faLock} style={styles.lockIcon} />
            </div>
          </div>
          <hr style={styles.divider} />
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fullname">
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={styles.input}
                type="text"
                id="fullname"
                value={doctorFullName}
                readOnly
              />
              <FontAwesomeIcon icon={faLock} style={styles.lockIcon} />
            </div>
          </div>
          <hr style={styles.divider} />
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                style={styles.input}
                type="password"
                id="password"
                value={doctorPassword}
                readOnly
              />
              <button
                style={styles.button}
                onClick={handlePopupToggle} // Toggle popup visibility
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.buttonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.button.backgroundColor)
                }
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {isPopupVisible && (
          <DoctorPassword onClose={() => setIsPopupVisible(false)} />
        )}

        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <button
            style={{ ...styles.button, ...styles.saveButton }}
            onClick={() => alert("Save changes")}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#8B5DFF")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.saveButton.backgroundColor)
            }
          >
            Save
          </button>
          <button
            style={{ ...styles.button, ...styles.discardButton }}
            onClick={() => alert("Discard changes")}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#D3D3D3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.discardButton.backgroundColor)
            }
          >
            Discard
          </button>
          <button
            style={{ ...styles.actionButton }}
            onClick={() => alert("Account deleted")}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#FF2D4D")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.actionButton.backgroundColor)
            }
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
