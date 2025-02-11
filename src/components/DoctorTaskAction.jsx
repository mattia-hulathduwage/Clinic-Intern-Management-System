import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const DoctorTaskAction = ({ onClose }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [taskType, setTaskType] = useState(""); // Track the selected task type
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null); // Store doctorId in state
  const [patients, setPatients] = useState([]); // Store patients list

  useEffect(() => {
    const doctorIdFromStorage = localStorage.getItem("doctor_id");
    if (doctorIdFromStorage) {
      setDoctorId(doctorIdFromStorage); // Set doctorId from localStorage
      setTimeout(() => {
        setIsPopupVisible(true);
        fetchTrainees(doctorIdFromStorage); // Fetch trainees only after setting doctorId
        fetchPatients(); // Fetch patients data
      }, 0);
    }
  }, []);

  const fetchTrainees = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainees/assigned?doctorId=${doctorId}`
      );
      const data = await response.json();
      setTrainees(data.trainees); // Populate trainees from API response
    } catch (error) {
      console.error("Error fetching trainees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const doctorId = localStorage.getItem("doctor_id");
  
      if (!doctorId) {
        console.error("Doctor ID not found in localStorage.");
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/patientsbyid?doctor_id=${doctorId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch patients.");
      }
  
      const data = await response.json();
      setPatients(data.patients); // Populate patients from API response
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleTaskTypeChange = (e) => {
    setTaskType(e.target.value); // Update task type when changed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload to send to the backend, including the doctorId
    const taskData = {
      taskType,
      taskTitle: e.target.title.value,
      taskDescription: e.target.description.value,
      traineeId: e.target.trainee.value,
      patientId: e.target.patient.value,
      taskDate: e.target.date.value,
      dueTime: e.target.time.value,
      doctorId: doctorId, // Add doctorId to the payload
    };

    try {
      // Make the API request to save the task
      const response = await fetch(
        "http://localhost:5000/api/tasks/labreport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      if (response.ok) {
        alert("Task added successfully");
        onClose(); // Close the popup after successful submission
      } else {
        alert("Error adding task");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };


  const handleWardVisitSubmit = async (e) => {
    e.preventDefault();
  
    // Create the payload for Ward Visit tasks
    const taskData = {
      taskType: "Ward Visit", // Set task type
      taskTitle: e.target.title.value,
      traineeId: e.target.trainee.value,
      ward: e.target.ward.value,
      taskDate: e.target.date.value,
      shiftStart: e.target.start.value,
      shiftEnd: e.target.end.value,
      doctorId: doctorId, // Include doctorId
    };
  
    try {
      // Make the API request to save the Ward Visit task
      const response = await fetch("http://localhost:5000/api/tasks/wardvisit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
  
      if (response.ok) {
        alert("Ward Visit task added successfully");
        onClose(); // Close the popup after successful submission
      } else {
        alert("Error adding Ward Visit task");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };
  

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: "0",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    popup: {
      width: "500px",
      height: "680px",
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 10px 8px rgba(0, 0, 0, 0.2)",
      fontFamily: "Poppins, sans-serif",
      marginLeft: "970px",
      transform: isPopupVisible
        ? isClosing
          ? "translateX(100%)"
          : "translateX(0)"
        : "translateX(100%)",
      transition: "transform 0.5s ease-in-out",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "left",
      padding: "10px",
      marginTop: "-5px",
    },
    reusedPasswordNotice: {
      width: "92%",
      height: "35px",
      backgroundColor: "rgba(0, 0, 0)",
      textAlign: "center",
      lineHeight: "35px",
      fontSize: "0.7rem",
      fontWeight: "500",
      color: "White",
      marginBottom: "25px",
      borderRadius: "4px",
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "90%",
      height: "10px",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "0.9rem",
      marginBottom: "10px",
      marginLeft: "15px",
    },
    formRow: {
      display: "flex",
      gap: "50px",
      marginBottom: "0px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
    },
    button: {
      padding: "10px",
      width: "120px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "Poppins, sans-serif",
      marginTop: "20px",
    },
    buttonChange: {
      backgroundColor: "#5e17eb",
      color: "#fff",
    },
    buttonCancel: {
      backgroundColor: "#e0e0e0",
      color: "#333",
    },
    buttonDelete: {
      backgroundColor: "red",
      color: "#fff",
    },
    label: {
      fontWeight: "505",
      color: "#333",
      marginLeft: "15px",
      fontSize: "12px",
    },
    dropdownContainer: {
      display: "flex",
      gap: "45px", // Add gap between the dropdowns
      marginBottom: "10px", // Space after the dropdowns
    },
    input1: {
      padding: "10px",
      margin: "10px 0",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "0.9rem",
      marginBottom: "10px",
      marginLeft: "15px",
    },
    dropdownContainer2: {
      display: "flex",
      gap: "30px", // Add gap between the dropdowns
      marginBottom: "10px", // Space after the dropdowns
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Add Tasks</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "70px", marginRight: "8px", fontSize: "1rem" }}
          />
          You are about to add a task. Proceed with caution.
        </div>
        <form
  onSubmit={(e) => {
    e.preventDefault(); // Prevent default form submission
    if (taskType === "Lab Report") {
      handleSubmit(e); // Pass event
    } else if (taskType === "Ward Visit") {
      handleWardVisitSubmit(e); // Pass event
    }
  }}
>

          <label htmlFor="type" style={styles.label}>
            Task Type
          </label>
          <select
            id="type"
            style={{
              ...styles.input,
              height: "40px",
              width: "95%",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
            value={taskType} // Bind selected value
            onChange={handleTaskTypeChange} // Handle change
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Lab Report">Research Report</option>
            <option value="Ward Visit">Ward Visit</option>
          </select>

          {/* Render input fields for 'Lab Report Request' only */}
          {taskType === "Lab Report" && (
            <>
              <label htmlFor="title" style={styles.label}>
                Title
              </label>
              <input id="title" style={styles.input} type="text" required />

              <label htmlFor="description" style={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                style={{
                  ...styles.input,
                  height: "50px", // Increase height to make it a proper text area
                  resize: "vertical", // Allow resizing vertically
                }}
                required
              ></textarea>

              <div style={styles.dropdownContainer}>
                <div>
                  <label htmlFor="trainee" style={styles.label}>
                    Trainee
                  </label>
                  <select
                    id="trainee"
                    style={{
                      ...styles.input1,
                      height: "40px",
                      width: "105%",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Trainee
                    </option>
                    {!loading ? (
                      trainees.map((trainee) => (
                        <option key={trainee.id} value={trainee.id}>
                          {`#T${trainee.id.toString().padStart(3, "0")}`}
                        </option>
                      ))
                    ) : (
                      <option>Loading...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="patient" style={styles.label}>
                    Patient
                  </label>
                  <select
                    id="patient"
                    style={{
                      ...styles.input1,
                      height: "40px",
                      width: "105%",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Patient
                    </option>
                    {!loading ? (
                      patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {`#P${patient.id.toString().padStart(3, "0")}`}
                        </option>
                      ))
                    ) : (
                      <option>Loading...</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={styles.dropdownContainer2}>
                <div>
                  <label htmlFor="date" style={styles.label}>
                    Due Date
                  </label>
                  <input
                    id="date"
                    style={{
                      ...styles.input1,
                      width: "90%",
                      height: "20px",
                    }}
                    type="date"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" style={styles.label}>
                    Due Time
                  </label>
                  <input
                    id="time"
                    style={{
                      ...styles.input1,
                      width: "106%",
                      height: "20px",
                    }}
                    type="time"
                    required
                  />
                </div>
              </div>

              <div style={styles.buttonContainer}>
                <button
                  style={{ ...styles.button, ...styles.buttonChange }}
                  type="submit"
                >
                  Add
                </button>
                <button
                  style={{ ...styles.button, ...styles.buttonCancel }}
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {taskType === "Ward Visit" && (
            <>
              <label htmlFor="title" style={styles.label}>
                Title
              </label>
              <input id="title" style={styles.input} type="text" required />

              <div style={styles.dropdownContainer}>
                <div>
                  <label htmlFor="trainee" style={styles.label}>
                    Trainee
                  </label>
                  <select
                    id="trainee"
                    style={{
                      ...styles.input1,
                      height: "40px",
                      width: "105%",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Trainee
                    </option>
                    {!loading ? (
                      trainees.map((trainee) => (
                        <option key={trainee.id} value={trainee.id}>
                          {`#T${trainee.id.toString().padStart(3, "0")}`}
                        </option>
                      ))
                    ) : (
                      <option>Loading...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="ward" style={styles.label}>
                    Ward
                  </label>
                  <select
                    id="ward"
                    style={{
                      ...styles.input1,
                      height: "40px",
                      width: "111%",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Patient
                    </option>
                    <option value="Ward A">Ward A</option>
                    <option value="Ward B">Ward B</option>
                    <option value="Ward C">Ward C</option>
                    <option value="Ward D">Ward D</option>
                    <option value="Ward E">Ward E</option>
                    <option value="Ward F">Ward F</option>
                  </select>
                </div>
              </div>

              <div style={styles.dropdownContainer}>
                <div>
                  <label htmlFor="date" style={styles.label}>
                    Due Date
                  </label>
                  <input
                    id="date"
                    style={{
                      ...styles.input,
                      width: "200%", // Ensure full width
                      height: "20px",
                    }}
                    type="date"
                    required
                  />
                </div>
              </div>

              <div style={styles.dropdownContainer2}>
                <div>
                  <label htmlFor="start" style={styles.label}>
                    Visit Start
                  </label>
                  <input
                    id="start"
                    style={{
                      ...styles.input1,
                      width: "110%", // Ensure full width
                      height: "20px",
                    }}
                    type="time"
                    required
                  />
                </div>

                <div style={{ marginLeft: "45px" }}>
                  <label htmlFor="end" style={styles.label}>
                    Visit End
                  </label>
                  <input
                    id="end"
                    style={{
                      ...styles.input1,
                      width: "110%", // Ensure full width
                      height: "20px",
                    }}
                    type="time"
                    required
                  />
                </div>
              </div>
              <div style={{ ...styles.buttonContainer, marginTop: "36px" }}>
                <button
                  style={{ ...styles.button, ...styles.buttonChange }}
                  type="submit"
                >
                  Add
                </button>
                <button
                  style={{ ...styles.button, ...styles.buttonCancel }}
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default DoctorTaskAction;
