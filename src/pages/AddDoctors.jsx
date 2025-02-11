import React, { useState } from "react";
import SidebarAdmin from "../components/Sidebar_admin";

const AddDoctors = () => {
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [doctor, setDoctor] = useState({
    doctor_fname: "",
    doctor_lname: "",
    email: "",
    telephone: "",
    password: generatePassword(), // Automatically generate password
    type: "",
    status: false, // Default status is inactive
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setDoctor({
      ...doctor,
      [name]: name === "status" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor.");
      }

      const result = await response.json();
      setMessage(`Doctor added successfully! ID: ${result.doctor_id}`);
      setDoctor({
        doctor_fname: "",
        doctor_lname: "",
        email: "",
        telephone: "",
        password: generatePassword(), // Reset with new generated password
        type: "",
        status: false, // Reset status to false
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const fieldLabels = {
    doctor_fname: "First Name",
    doctor_lname: "Last Name",
    email: "Email Address",
    telephone: "Phone Number",
    password: "Password",
    type: "Doctor Type",
    status: "Status",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarAdmin />
      <div
        style={{
          marginLeft: "290px",
          flex: 1,
          padding: "20px",
          backgroundColor: "white",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "600" }}>Add New Doctor Staff</h1>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "1400px",
            padding: "20px",
            backgroundColor: "transparent",
            borderRadius: "10px",
            boxShadow: "none",
          }}
          onSubmit={handleSubmit}
        >
          {["status", "doctor_fname", "doctor_lname", "email", "telephone", "password", "type"].map(
            (field, index) => (
              <div key={field}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  <span style={{ width: "150px" }}>{fieldLabels[field]}</span>
                  {field === "type" ? (
                    <select
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        flex: 1,
                        marginLeft: "140px",
                        marginRight: "300px",
                      }}
                      name={field}
                      value={doctor[field]}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select {fieldLabels[field]}</option>
                      <option value="Attending">Attending</option>
                      <option value="Visiting">Visiting</option>
                      <option value="Resident">Resident</option>
                    </select>
                  ) : field === "status" ? (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "100px",
                      }}
                    >
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          name={field}
                          checked={doctor[field]}
                          onChange={handleChange}
                          style={{ marginLeft: "100px", cursor: "pointer" }}
                        />
                        <span className="slider"></span>
                      </div>
                      <span style={{ marginLeft: "10px" }}>Active</span>
                    </label>
                  ) : (
                    <input
                      style={{
                        padding: "10px",
                        fontSize: "1rem",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        flex: 1,
                        marginLeft: "140px",
                        marginRight: "300px",
                      }}
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      value={doctor[field]}
                      onChange={handleChange}
                      required
                      readOnly={field === "password"} // Make the password field read-only
                    />
                  )}
                </label>
                {index < 6 && (
                  <hr
                    style={{
                      border: "none",
                      borderTop: "2px solid #ddd",
                      marginTop: "20px",
                    }}
                  />
                )}
              </div>
            )
          )}
          <button
            style={{
              marginTop: "30px",
              marginLeft: "300px",
              marginRight: "300px",
              backgroundColor: "white",
              color: "#5e17eb",
              padding: "10px 15px",
              border: "2px solid #5e17eb",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s ease",
              fontFamily: "Poppins, sans-serif",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5E17EB1A")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
          >
            Add Doctor
          </button>
        </form>
        {message && (
          <p style={{ marginTop: "15px", fontSize: "1rem", color: "#27ae60" }}>{message}</p>
        )}
      </div>

      <style>{`
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 54px;
          height: 30px;
          margin-left: 137px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #FF4C4C;
          transition: 0.4s;
          border-radius: 30px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 5px;
          bottom: 5px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #4CAF50;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
};

export default AddDoctors;
