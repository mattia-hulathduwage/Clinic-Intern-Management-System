import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const LabTaskAction = ({ onClose, selectedTaskId }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    taskTitle: "",
    taskDescription: "",
    traineeId: "",
    patientId: "",
    taskDate: "",
    dueTime: "",
  });

  console.log("Selected Task ID:", selectedTaskId);

  useEffect(() => {
    console.log("Selected Task ID inside useEffect:", selectedTaskId);
    const fetchTaskData = async () => {
      if (selectedTaskId) {
        // Fetch task logic
      }
    };
    fetchTaskData();
  }, [selectedTaskId]);

  useEffect(() => {
    if (!selectedTaskId) {
      console.error("Selected Task ID is undefined or null");
      return; // Early return if task ID is not defined
    }
  
    console.log("Selected Task ID inside useEffect:", selectedTaskId);
  
    const fetchTaskData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/labtasks/getTaskById/${selectedTaskId}`
        );
        if (!response.ok) throw new Error("Task fetch failed");
  
        const data = await response.json();
  
        if (data && data.task) {
          const taskDate = new Date(data.task.task_date).toISOString().split('T')[0]; // Extract only the date part
          setTaskDetails({
            taskTitle: data.task.task_title,
            taskDescription: data.task.task_description,
            traineeId: data.task.trainee,
            patientId: data.task.patient,
            taskDate: taskDate, // Set the formatted date here
            dueTime: data.task.due_time,
          });
        } else {
          console.error("Task not found");
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };
  
    fetchTaskData();
  }, [selectedTaskId]);
  

  useEffect(() => {
    const doctorIdFromStorage = localStorage.getItem("doctor_id");
    if (doctorIdFromStorage) {
      setDoctorId(doctorIdFromStorage);
      setIsPopupVisible(true);
      fetchTrainees(doctorIdFromStorage);
      fetchPatients(doctorIdFromStorage);
    }
  }, []);

  const fetchTrainees = async (doctorId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainees/assigned?doctorId=${doctorId}`
      );
      if (!response.ok) throw new Error("Failed to fetch trainees");

      const data = await response.json();
      setTrainees(data.trainees);
    } catch (error) {
      console.error("Error fetching trainees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async (doctorId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/patientsbyid?doctor_id=${doctorId}`
      );
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      setPatients(data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated task data
    const updatedTask = {
      task_title: taskDetails.taskTitle,
      task_description: taskDetails.taskDescription,
      trainee: taskDetails.traineeId,
      patient: taskDetails.patientId,
      task_date: taskDetails.taskDate,
      due_time: taskDetails.dueTime,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/updatelabtasks/${selectedTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (response.ok) {
        console.log("Task updated successfully!");
        onClose(); // Close the popup after successful update
      } else {
        console.error("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
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
      gap: "45px",
      marginBottom: "10px",
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
      gap: "30px",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Edit Task</h2>
        <div style={styles.reusedPasswordNotice}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ marginLeft: "70px", marginRight: "8px", fontSize: "1rem" }}
          />
          You are about to edit a task. Proceed with caution.
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" style={styles.label}>
            Title
          </label>
          <input
            id="title"
            style={styles.input}
            type="text"
            required
            value={taskDetails.taskTitle}
            onChange={(e) =>
              setTaskDetails((prevState) => ({
                ...prevState,
                taskTitle: e.target.value,
              }))
            }
          />

          <label htmlFor="description" style={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            style={{ ...styles.input, height: "120px", resize: "vertical" }}
            required
            value={taskDetails.taskDescription}
            onChange={(e) =>
              setTaskDetails((prevState) => ({
                ...prevState,
                taskDescription: e.target.value,
              }))
            }
          />

          <div style={styles.dropdownContainer}>
            <div>
              <label htmlFor="trainee" style={styles.label}>
                Trainee
              </label>
              <select
                id="trainee"
                style={{ ...styles.input1, height: "40px", width: "105%" }}
                required
                value={taskDetails.traineeId}
                onChange={(e) =>
                  setTaskDetails((prevState) => ({
                    ...prevState,
                    traineeId: e.target.value,
                  }))
                }
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
                style={{ ...styles.input1, height: "40px", width: "105%" }}
                required
                value={taskDetails.patientId}
                onChange={(e) =>
                  setTaskDetails((prevState) => ({
                    ...prevState,
                    patientId: e.target.value,
                  }))
                }
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
              <br></br>
              <input
                id="date"
                style={{ ...styles.input1, width: "200px" }}
                type="date"
                required
                value={taskDetails.taskDate}
                onChange={(e) =>
                  setTaskDetails((prevState) => ({
                    ...prevState,
                    taskDate: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label
                htmlFor="time"
                style={{ ...styles.label, marginLeft: "5px" }}
              >
                Due Time
              </label>
              <br></br>
              <input
                id="time"
                style={{ ...styles.input1, marginLeft: "0px", width: "200px" }}
                type="time"
                required
                value={taskDetails.dueTime}
                onChange={(e) =>
                  setTaskDetails((prevState) => ({
                    ...prevState,
                    dueTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.buttonChange }}
              type="submit"
            >
              Update
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonDelete }}
              type="button"
            >
              Delete
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonCancel }}
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTaskAction;
