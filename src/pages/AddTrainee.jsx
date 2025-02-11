import React, { useState, useEffect } from "react";
import SidebarAdmin from "../components/Sidebar_admin";

const AddTrainee = () => {
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [trainee, setTrainee] = useState({
    trainee_fname: "",
    trainee_lname: "",
    email: "",
    telephone: "",
    password: generatePassword(), // Automatically generate password
    status: false, // Default status is inactive
  });
  
  const [doctors, setDoctors] = useState([]); // Store doctors list
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors.");
        }
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setTrainee({
      ...trainee,
      [name]: name === "status" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/trainees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trainee),
      });

      if (!response.ok) {
        throw new Error("Failed to add trainee.");
      }

      const result = await response.json();
      setMessage(`Trainee added successfully! ID: ${result.trainee_id}`);
      setTrainee({
        trainee_fname: "",
        trainee_lname: "",
        email: "",
        telephone: "",
        password: generatePassword(),
        status: false,
        assigned_to: "",
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const fieldLabels = {
    trainee_fname: "First Name",
    trainee_lname: "Last Name",
    email: "Email Address",
    telephone: "Phone Number",
    password: "Password",
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
          <h1 style={{ fontSize: "1.8rem", fontWeight: "600" }}>Add New Trainee</h1>
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
          {["status", "trainee_fname", "trainee_lname", "email", "telephone", "password"].map(
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
                  {field === "status" ? (
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
                          checked={trainee[field]}
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
                        borderRadius: "5px",
                        flex: 1,
                        marginLeft: "140px",
                        marginRight: "300px",
                      }}
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      value={trainee[field]}
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
          
          

          {/* Doctor Selection Dropdown */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexDirection: "row",
              }}
            >
              <span style={{ width: "150px" }}>Assign to Doctor</span>
              <select
                style={{
                  padding: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  flex: 1,
                  marginLeft: "140px",
                  marginRight: "300px",
                }}
                name="assigned_to"
                value={trainee.assigned_to}
                onChange={handleChange}
                required
              >
                <option value="">Select a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.doctor_fname} {doctor.doctor_lname}
                  </option>
                ))}
              </select>
            </label>
            <hr style={{ border: "none", borderTop: "2px solid #ddd", marginTop: "20px" }} />
          </div>




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
            Add Trainee
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
          background-color: #ccc;
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
          background-color: #5e17eb;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
};

export default AddTrainee;
