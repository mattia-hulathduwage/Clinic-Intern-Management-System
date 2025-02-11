const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;
const moment = require("moment"); // For date formatting
const fileUpload = require("express-fileupload");
app.use(fileUpload());


// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "123456", // Replace with your MySQL password
  database: "medaxis", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the medaxis database!");
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE admin_username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username.");
    }

    const admin = results[0];

    // Check password
    if (admin.admin_password === password) {
      res.json({
        message: "Login successful",
        admin_id: admin.admin_id, // Include admin_id in the response
        admin_fname: admin.admin_fname,
        admin_lname: admin.admin_lname,
      });
    } else {
      res.status(401).send("Invalid password.");
    }
  });
});

// Trainee login
app.post("/trainee/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM trainee WHERE trainee_username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password.");
    }

    const trainee = results[0];

    if (trainee.trainee_password === password) {
      // Log the login event
      const logSql = `
        INSERT INTO loginlogs (userid, role, date) 
        VALUES (?, ?, ?)
      `;
      const userId = trainee.trainee_id;
      const role = "Intern"; // Assigning the role as "Trainer"
      const currentDate = moment().format("YYYY-MM-DD"); // Format the date as 'YYYY-MM-DD'

      db.query(logSql, [userId, role, currentDate], (logErr) => {
        if (logErr) {
          return res.status(500).send("Failed to log login event.");
        }

        // Respond with success message
        res.json({
          message: "Login successful",
          trainee_id: trainee.trainee_id,
          trainee_fname: trainee.trainee_fname,
          trainee_lname: trainee.trainee_lname,
        });
      });
    } else {
      res.status(401).send("Invalid password.");
    }
  });
});

  

app.post("/doctor/login", (req, res) => {
  const { username, password } = req.body;

  // Include status = 'active' in the SQL query
  const sql = "SELECT * FROM doctor WHERE doctor_username = ? AND status = 'active'";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password, or the account is inactive.");
    }

    const doctor = results[0];

    if (doctor.doctor_password === password) {
      // Log the login event only if the doctor is active
      const logSql = `
        INSERT INTO loginlogs (userid, role, date) 
        SELECT ?, ?, ? 
        WHERE EXISTS (
          SELECT 1 FROM doctor WHERE doctor_id = ? AND status = 'active'
        )
      `;
      const userId = doctor.doctor_id;
      const role = "Doctor";
      const currentDate = moment().format("YYYY-MM-DD"); // Format the date as 'YYYY-MM-DD'

      db.query(logSql, [userId, role, currentDate, userId], (logErr) => {
        if (logErr) {
          return res.status(500).send("Failed to log login event.");
        }

        // Respond with success message
        res.json({
          message: "Login successful",
          doctor_id: doctor.doctor_id,  // Add this line to send doctor_id
          doctor_fname: doctor.doctor_fname,
          doctor_lname: doctor.doctor_lname,
        });        
      });
    } else {
      res.status(401).send("Invalid password.");
    }
  });
});

  


// Route to fetch all doctors
app.get("/api/doctors", (req, res) => {
  console.log("Fetching doctors data...");
  const sql = "SELECT doctor_id, doctor_fname, doctor_lname, email, telephone, enroll_date, status, type FROM doctor";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }
    
    console.log("Doctors data retrieved:", results);  // Log results
    
    const formattedResults = results.map(doctor => ({
      doctor_id: doctor.doctor_id,
      doctor_fname: doctor.doctor_fname,
      doctor_lname: doctor.doctor_lname,
      email: doctor.email ? doctor.email : "N/A",
      telephone: doctor.telephone ? doctor.telephone : "N/A",
      enroll_date: doctor.enroll_date ? new Date(doctor.enroll_date).toLocaleDateString() : "N/A",
      type: doctor.type ? doctor.type : "N/A",
      status: doctor.status ? doctor.status : "N/A"
    }));
    
    res.json({ doctors: formattedResults, total: formattedResults.length });
  });
});




app.post("/api/doctors", (req, res) => {
  const { doctor_fname, doctor_lname, email, telephone, password, type, status } = req.body;

  // Convert status to 'active' or 'inactive' based on the value
  const statusValue = status ? "active" : "inactive";

  // Construct SQL query
  const sql = "INSERT INTO doctor (doctor_fname, doctor_lname, doctor_username, doctor_password, email, telephone, type, enroll_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)";

  db.query(sql, [doctor_fname, doctor_lname, email, password, email, telephone, type, statusValue], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    // Respond with success
    res.status(201).json({ message: "Doctor added successfully!", doctor_id: results.insertId });
  });
});


app.get("/api/trainees", (req, res) => {
  console.log("Fetching trainees data...");
  const sql = `
    SELECT 
      trainee_id AS id, 
      trainee_fname, 
      trainee_lname, 
      email, 
      telephone AS contact, 
      enroll_date, 
      status,
      assigned_to
    FROM 
      trainee
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    console.log("Trainees data retrieved:", results); // Log results

    const formattedResults = results.map((trainee) => ({
      id: trainee.id,
      fname: trainee.trainee_fname, // Separate first name
      lname: trainee.trainee_lname, // Separate last name
      email: trainee.email,
      contact: trainee.contact,
      enroll_date: trainee.enroll_date.toISOString().split('T')[0], // Format date
      status: trainee.status ? trainee.status : "N/A",
      assigned_to: trainee.assigned_to, // Include assigned_to (doctor_id)
    }));

    res.json({ trainees: formattedResults, total: formattedResults.length });
  });
});






app.post("/api/trainees", (req, res) => {
  const { trainee_fname, trainee_lname, email, telephone, password, status, assigned_to } = req.body;

  // Convert status to 'active' or 'inactive'
  const statusValue = status ? "active" : "inactive";

  // SQL query to insert trainee
  const sql = `
    INSERT INTO trainee 
      (trainee_fname, trainee_lname, trainee_username, trainee_password, email, telephone, enroll_date, status, assigned_to) 
    VALUES 
      (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)
  `;

  db.query(sql, [trainee_fname, trainee_lname, email, password, email, telephone, statusValue, assigned_to], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    // SMS message content
    const message = `Hello ${trainee_fname}, your intern account has been successfully created in MedAxis! You can now log in.`;

    // Send SMS notification
    sendSms(telephone, message);

    // Respond with success message
    res.status(201).json({ message: "Trainee added successfully! SMS sent.", trainee_id: results.insertId });
  });
});
 



app.get("/api/patients", (req, res) => {
  console.log("Fetching patients data...");
  const sql = `
    SELECT 
      patient_id AS id, 
      CONCAT(patient_fname, ' ', patient_lname) AS full_name, 
      gender, 
      dob, 
      blood_type, 
      telephone AS contact, 
      email, 
      address 
    FROM 
      patient
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    console.log("Patients data retrieved:", results); // Log results

    const formattedResults = results.map(patient => ({
      id: patient.id,
      full_name: patient.full_name, // Use full name here
      gender: patient.gender,
      dob: patient.dob ? patient.dob.toISOString().split('T')[0] : "N/A", // Format date
      blood_type: patient.blood_type || "N/A",
      contact: patient.contact,
      email: patient.email,
      address: patient.address,
    }));

    res.json({ patients: formattedResults, total: formattedResults.length });
  });
});


app.get("/api/patientbypid/:patient_id", (req, res) => {
  const patientId = req.params.patient_id; // Retrieve the patient_id from the URL parameter

  console.log(`Fetching data for patient_id: ${patientId}`);

  const sql = `
    SELECT 
      patient.patient_id AS id, 
      patient.patient_fname, 
      patient.patient_lname,
      patient.gender, 
      patient.dob, 
      patient.blood_type, 
      patient.telephone AS contact, 
      patient.email, 
      patient.address,
      patient.doctor_id, 
      patient.doctor_fname, 
      patient.doctor_lname
    FROM 
      patient
    WHERE 
      patient.patient_id = ?
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(404).send("Patient not found.");
    }

    console.log("Patient data retrieved:", results); // Log results

    // Directly access the first result as you're expecting only one patient
    const patient = results[0];

    // Format the results to include the necessary fields
    const formattedResult = {
      id: patient.id,
      patient_fname: patient.patient_fname,
      patient_lname: patient.patient_lname,
      gender: patient.gender,
      dob: patient.dob ? patient.dob.toISOString().split('T')[0] : "N/A", // Format date
      blood_type: patient.blood_type || "N/A",
      contact: patient.contact,
      email: patient.email,
      address: patient.address,
      doctor_id: patient.doctor_id,
      doctor_fname: patient.doctor_fname,
      doctor_lname: patient.doctor_lname,
    };

    // Return the formatted patient data
    res.json({ patient: formattedResult });
  });
});


app.get("/api/traineebyid/:trainee_id", (req, res) => {
  const traineeId = req.params.trainee_id; // Retrieve the trainee_id from the URL parameter

  console.log(`Fetching data for trainee_id: ${traineeId}`);

  const sql = `
    SELECT 
      trainee.trainee_id AS id, 
      trainee.trainee_fname, 
      trainee.trainee_lname, 
      trainee.email, 
      trainee.trainee_username, 
      trainee.telephone, 
      trainee.enroll_date, 
      trainee.assigned_to, 
      trainee.status
    FROM 
      trainee
    WHERE 
      trainee.trainee_id = ?
  `;

  db.query(sql, [traineeId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(404).send("Trainee not found.");
    }

    console.log("Trainee data retrieved:", results); // Log results

    // Directly access the first result as you're expecting only one trainee
    const trainee = results[0];

    // Format the results to include the necessary fields
    const formattedResult = {
      id: trainee.id,
      trainee_fname: trainee.trainee_fname,
      trainee_lname: trainee.trainee_lname,
      email: trainee.email,
      trainee_username: trainee.trainee_username,
      telephone: trainee.telephone,
      enroll_date: trainee.enroll_date ? trainee.enroll_date.toISOString().split('T')[0] : "N/A", // Format date
      assigned_to: trainee.assigned_to || "N/A",
      status: trainee.status || "N/A",
    };

    // Return the formatted trainee data
    res.json({ trainee: formattedResult });
  });
});



//doctor id
app.get("/api/patientsbyid", (req, res) => {
  const { doctor_id } = req.query;

  if (!doctor_id) {
    return res.status(400).json({ error: "doctor_id is required" });
  }

  console.log(`Fetching patients data for doctor_id: ${doctor_id}...`);

  const sql = `
    SELECT 
      patient_id AS id, 
      CONCAT(patient_fname, ' ', patient_lname) AS full_name, 
      gender, 
      dob, 
      blood_type, 
      telephone AS contact, 
      email, 
      address,
      doctor_id,
      CONCAT(doctor_fname, ' ', doctor_lname) AS doctor_name
    FROM 
      patient
    WHERE 
      doctor_id = ?;
  `;

  db.query(sql, [doctor_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error." });
    }

    console.log("Patients data retrieved:", results);

    const formattedResults = results.map(patient => ({
      id: patient.id,
      full_name: patient.full_name,
      gender: patient.gender,
      dob: patient.dob ? patient.dob.toISOString().split('T')[0] : "N/A",
      blood_type: patient.blood_type || "N/A",
      contact: patient.contact,
      email: patient.email,
      address: patient.address,
      doctor_id: patient.doctor_id,
      doctor_name: patient.doctor_name
    }));

    res.json({ patients: formattedResults, total: formattedResults.length });
  });
});



// Route to validate the current password
app.post("/api/admin/validate-password", (req, res) => {
  const { admin_id, currentPassword } = req.body;

  if (!admin_id || !currentPassword) {
    return res.status(400).send("Admin ID and current password are required.");
  }

  const sql = "SELECT admin_password FROM admin WHERE admin_id = ?";
  db.query(sql, [admin_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(404).send("Admin not found.");
    }

    const admin = results[0];
    if (admin.admin_password === currentPassword) {
      res.json({ success: true, message: "Password validation successful." });
    } else {
      res.status(401).send("Current password is incorrect.");
    }
  });
});

// Route to update the password
app.post("/api/admin/update-password", (req, res) => {
  const { admin_id, newPassword } = req.body;

  if (!admin_id || !newPassword) {
    return res.status(400).send("Admin ID and new password are required.");
  }

  // Password update query
  const sql = "UPDATE admin SET admin_password = ? WHERE admin_id = ?";
  db.query(sql, [newPassword, admin_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Admin not found.");
    }

    res.json({ success: true, message: "Password updated successfully." });
  });
});

// Admin Routes
app.get("/admin/counts", (req, res) => {
  const query = `
    SELECT 
        (SELECT COUNT(doctor_id) FROM doctor) AS totalDoctors,
        (SELECT COUNT(trainee_id) FROM trainee) AS totalInterns,
        (SELECT COUNT(patient_id) FROM patient) AS totalPatients
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    const { totalDoctors, totalInterns, totalPatients } = results[0];
    res.json({ totalDoctors, totalInterns, totalPatients });
  });
});



// Add this route in your backend server file
app.get('/admin/doctor-types-count', (req, res) => {
  const query = `
      SELECT type, COUNT(*) AS count 
      FROM doctor 
      GROUP BY type
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching doctor types:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }
      
      const doctorTypeCounts = results.reduce((acc, row) => {
          acc[row.type] = row.count;
          return acc;
      }, {});

      res.json(doctorTypeCounts);
  });
});


// Add this route in your backend server file
app.get('/admin/active-users-count', (req, res) => {
  const query = `
      SELECT 'doctor' AS user_type, COUNT(*) AS count 
      FROM doctor 
      WHERE status = 'active'
      UNION
      SELECT 'trainee' AS user_type, COUNT(*) AS count 
      FROM trainee 
      WHERE status = 'active'
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching active users count:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }

      const activeUsersCount = results.reduce((acc, row) => {
          acc[row.user_type] = row.count;
          return acc;
      }, {});

      res.json(activeUsersCount);
  });
});


// GET route to fetch login counts for doctors and interns
app.get('/login-stats', (req, res) => {
  const query = `
    SELECT 
      date,
      SUM(CASE WHEN role = 'Doctor' THEN 1 ELSE 0 END) AS doctor_logins,
      SUM(CASE WHEN role = 'Intern' THEN 1 ELSE 0 END) AS intern_logins
    FROM 
      loginlogs
    WHERE 
      date >= CURDATE() - INTERVAL 6 DAY
    GROUP BY 
      date
    ORDER BY 
      date DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Server Error');
    }

    // Format the dates inside the route
    const formattedResults = results.map(row => {
      const d = new Date(row.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      return {
        date: formattedDate,
        doctor_logins: row.doctor_logins,
        intern_logins: row.intern_logins
      };
    });

    res.json(formattedResults);
  });
});



// Add this route in your backend server file
app.put('/api/doctors/:id', (req, res) => {
  const doctorId = req.params.id;
  const { doctor_fname, doctor_lname, email, telephone, type, status } = req.body;

  // SQL query to update doctor information
  const query = `
    UPDATE doctor
    SET doctor_fname = ?, doctor_lname = ?, email = ?, telephone = ?, type = ?, status = ?
    WHERE doctor_id = ?
  `;

  // Execute the query
  db.query(query, [doctor_fname, doctor_lname, email, telephone, type, status, doctorId], (err, results) => {
    if (err) {
      console.error('Error updating doctor information:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if any rows were affected (doctor exists and was updated)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Send a success response
    res.json({ message: 'Doctor information updated successfully!' });
  });
});



app.delete('/api/doctors/:doctor_id', (req, res) => {
  const { doctor_id } = req.params;

  // SQL query to delete the doctor
  const query = 'DELETE FROM doctor WHERE doctor_id = ?';

  db.query(query, [doctor_id], (err, result) => {
    if (err) {
      console.error('Error deleting doctor:', err);
      return res.status(500).json({ error: 'Failed to delete doctor from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  });
});


app.put("/api/trainees/:id", (req, res) => {
  console.log("Updating trainee...");

  const traineeId = req.params.id;
  const { fname, lname, email, telephone, status } = req.body;

  if (!fname || !lname || !email || !telephone || !status) {
    return res.status(400).send("All fields are required.");
  }

  const sql = `
    UPDATE trainee
    SET 
      trainee_fname = ?, 
      trainee_lname = ?, 
      email = ?, 
      telephone = ?, 
      status = ?
    WHERE trainee_id = ?
  `;

  const values = [fname, lname, email, telephone, status, traineeId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating trainee:", err);
      return res.status(500).send("Error updating trainee.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Trainee not found.");
    }

    console.log("Trainee updated successfully:", result);
    res.send("Trainee updated successfully.");
  });
});


//doctorintern page table
app.delete("/api/trainees/:id", (req, res) => {
  console.log("Deleting trainee...");

  const traineeId = req.params.id;

  if (!traineeId) {
    return res.status(400).send("Trainee ID is required.");
  }

  const sql = "DELETE FROM trainee WHERE trainee_id = ?";

  db.query(sql, [traineeId], (err, result) => {
    if (err) {
      console.error("Error deleting trainee:", err);
      return res.status(500).send("Error deleting trainee.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Trainee not found.");
    }

    console.log("Trainee deleted successfully:", result);
    res.send("Trainee deleted successfully.");
  });
});



app.get("/api/trainees/assigned", (req, res) => {
  console.log("Fetching trainees data...");
  const doctorId = req.query.doctorId || null;

  if (!doctorId) {
    return res.status(400).send("Doctor ID is required.");
  }

  const sql = `
    SELECT 
      trainee_id AS id, 
      trainee_fname, 
      trainee_lname, 
      email, 
      telephone AS contact, 
      enroll_date, 
      status,
      assigned_to
    FROM 
      trainee
    WHERE assigned_to = ?
  `;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    console.log("Trainees data retrieved:", results);

    const formattedResults = results.map((trainee) => ({
      id: trainee.id,
      fname: trainee.trainee_fname,
      lname: trainee.trainee_lname,
      email: trainee.email,
      contact: trainee.contact,
      enroll_date: trainee.enroll_date.toISOString().split('T')[0],
      status: trainee.status ? trainee.status : "N/A",
      assigned_to: trainee.assigned_to,
    }));

    res.json({ trainees: formattedResults, total: formattedResults.length });
  });
});

  
// Route to validate the current password for the doctor
app.post("/api/doctor/validate-password", (req, res) => {
  const { doctor_id, currentPassword } = req.body;

  if (!doctor_id || !currentPassword) {
    return res.status(400).send("Doctor ID and current password are required.");
  }

  const sql = "SELECT doctor_password FROM doctor WHERE doctor_id = ?";
  db.query(sql, [doctor_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(404).send("Doctor not found.");
    }

    const doctor = results[0];
    if (doctor.doctor_password === currentPassword) {
      res.json({ success: true, message: "Password validation successful." });
    } else {
      res.status(401).send("Current password is incorrect.");
    }
  });
});

// Route to update the password for the doctor
app.post("/api/doctor/update-password", (req, res) => {
  const { doctor_id, newPassword } = req.body;

  if (!doctor_id || !newPassword) {
    return res.status(400).send("Doctor ID and new password are required.");
  }

  // Password update query
  const sql = "UPDATE doctor SET doctor_password = ? WHERE doctor_id = ?";
  db.query(sql, [newPassword, doctor_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Doctor not found.");
    }

    res.json({ success: true, message: "Password updated successfully." });
  });
});

  


app.post('/api/tasks/labreport', (req, res) => {
  const {
    taskType,
    taskTitle,
    taskDescription,
    traineeId,
    patientId,
    taskDate,
    dueTime,
    doctorId, // Retrieve doctorId from the request body
  } = req.body;

  // SQL query to insert the new task into the task table, including doctorId
  const query = `
    INSERT INTO task (task_type, task_title, task_description, trainee, patient, task_date, due_time, doctor, created_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'Pending')
  `;

  // Execute the query with the data from the frontend form
  db.query(
    query,
    [
      taskType,
      taskTitle,
      taskDescription,
      traineeId,
      patientId,
      taskDate,
      dueTime,
      doctorId, // Insert doctorId into the database
    ],
    (err, result) => {
      if (err) {
        console.error('Error saving task:', err);
        return res.status(500).send('Error saving task');
      }
      res.status(200).json({ message: 'Task saved successfully', taskId: result.insertId });
    }
  );
});







app.get("/api/labtasks", (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters
  
  if (!doctorId) {
    return res.status(400).send("Doctor ID is required.");
  }

  console.log("Fetching tasks data for doctor_id:", doctorId);
  
  // SQL query to fetch task data with a WHERE condition based on the 'doctor' column
  const sql = "SELECT task_id, task_type, task_title, task_description, trainee, patient, task_date, due_time FROM task WHERE doctor = ? AND status = 'Pending'";

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }
    
    console.log("Tasks data retrieved:", results);  // Log results
    
    // Format the task data
    const formattedResults = results.map(task => ({
      task_id: task.task_id,
      task_type: task.task_type ? task.task_type : "N/A",
      task_title: task.task_title ? task.task_title : "N/A",
      task_description: task.task_description ? task.task_description : "N/A",
      trainee: task.trainee ? task.trainee : "N/A",
      patient: task.patient ? task.patient : "N/A",
      task_date: task.task_date ? new Date(task.task_date).toLocaleDateString() : "N/A",
      due_time: task.due_time ? task.due_time : "N/A"
    }));
    
    // Return the formatted task data in the response
    res.json({ tasks: formattedResults, total: formattedResults.length });
  });
});

app.get("/api/completelabtasks", (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters
  
  if (!doctorId) {
    return res.status(400).send("Doctor ID is required.");
  }

  console.log("Fetching tasks data for doctor_id:", doctorId);
  
  // SQL query to fetch task data with a WHERE condition based on the 'doctor' column
  const sql = "SELECT task_id, task_type, task_title, task_description, trainee, patient, task_date, due_time FROM task WHERE doctor = ? AND status = 'Completed'";

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }
    
    console.log("Tasks data retrieved:", results);  // Log results
    
    // Format the task data
    const formattedResults = results.map(task => ({
      task_id: task.task_id,
      task_type: task.task_type ? task.task_type : "N/A",
      task_title: task.task_title ? task.task_title : "N/A",
      task_description: task.task_description ? task.task_description : "N/A",
      trainee: task.trainee ? task.trainee : "N/A",
      patient: task.patient ? task.patient : "N/A",
      task_date: task.task_date ? new Date(task.task_date).toLocaleDateString() : "N/A",
      due_time: task.due_time ? task.due_time : "N/A"
    }));
    
    // Return the formatted task data in the response
    res.json({ tasks: formattedResults, total: formattedResults.length });
  });
});




app.post('/api/tasks/wardvisit', (req, res) => {
  const {
    taskType,
    taskTitle,
    traineeId,
    ward,
    taskDate,
    shiftStart,
    shiftEnd,
    doctorId, // Retrieve doctorId from the request body
  } = req.body;

  // SQL query to insert the new Ward Visit task into the task table, including doctorId
  const query = `
    INSERT INTO task (task_type, task_title, trainee, ward, task_date, shift_start, shift_end, doctor, created_date, review_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'Pending')
  `;


  // Execute the query with the data from the frontend form
  db.query(
    query,
    [
      taskType,
      taskTitle,
      traineeId,
      ward,
      taskDate,
      shiftStart,
      shiftEnd,
      doctorId, // Insert doctorId into the database
    ],
    (err, result) => {
      if (err) {
        console.error('Error saving Ward Visit task:', err);
        return res.status(500).send('Error saving Ward Visit task');
      }
      res.status(200).json({ message: 'Ward Visit task saved successfully', taskId: result.insertId });
    }
  );
});


app.get('/api/tasks/wardvisit', (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!doctorId) {
    return res.status(400).send('Doctor ID is required');
  }

  const query = `
    SELECT task_title, trainee, ward, task_date, shift_start, shift_end
    FROM task
    WHERE task_type = 'Ward Visit' AND doctor = ? AND review_status = 'Pending'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching Ward Visit tasks:', err);
      return res.status(500).send('Error fetching Ward Visit tasks');
    }
    res.status(200).json({ tasks: results });
  });
});

app.get('/api/tasks/completewardvisit', (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!doctorId) {
    return res.status(400).send('Doctor ID is required');
  }

  const query = `
    SELECT task_title, trainee, ward, task_date, shift_start, shift_end
    FROM task
    WHERE task_type = 'Ward Visit' AND doctor = ? AND review_status = 'Completed'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching Ward Visit tasks:', err);
      return res.status(500).send('Error fetching Ward Visit tasks');
    }
    res.status(200).json({ tasks: results });
  });
});



app.get('/api/tasks/labreports', (req, res) => {
  const { trainee_id } = req.query; // Get trainee_id from query parameters

  if (!trainee_id) {
    return res.status(400).send('Missing trainee_id parameter');
  }

  const query = `
    SELECT task_id, task_title, task_description, task_date, due_time 
    FROM task 
    WHERE task_type = 'Lab Report' AND status = 'Pending' AND trainee = ?
  `;

  db.query(query, [trainee_id], (err, results) => {
    if (err) {
      console.error('Error fetching Lab Report tasks:', err);
      return res.status(500).send('Error fetching Lab Report tasks');
    }
    res.status(200).json({ tasks: results });
  });
});


app.get('/api/tasks/completelabreports', (req, res) => {
  const { trainee_id } = req.query; // Get trainee_id from query parameters

  if (!trainee_id) {
    return res.status(400).send('Missing trainee_id parameter');
  }

  const query = `
    SELECT task_id, task_title, task_description, task_date, due_time 
    FROM task 
    WHERE task_type = 'Lab Report' AND status = 'Completed' AND trainee = ?
  `;

  db.query(query, [trainee_id], (err, results) => {
    if (err) {
      console.error('Error fetching Lab Report tasks:', err);
      return res.status(500).send('Error fetching Lab Report tasks');
    }
    res.status(200).json({ tasks: results });
  });
});


app.get("/api/tasks/getTaskById", (req, res) => {
  const { task_id } = req.query; // Get task_id from query parameters

  if (!task_id) {
    return res.status(400).send("Missing task_id parameter");
  }

  const query = `
    SELECT task_id, task_type, task_title, task_description, trainee, doctor, patient, task_date, due_time, status
FROM task
WHERE task_id = ? AND status = 'Pending';

  `;

  db.query(query, [task_id], (err, results) => {
    if (err) {
      console.error("Error fetching task:", err);
      return res.status(500).send("Error fetching task details");
    }

    if (results.length === 0) {
      return res.status(404).send("Task not found");
    }

    res.status(200).json({ task: results[0] });
  });
});



app.put("/api/tasks/uploadTaskPdf", (req, res) => {
  const { task_id } = req.body;
  const file = req.files?.task_pdf;

  if (!file || !task_id) {
    return res.status(400).json({ error: "Missing task_id or file" });
  }

  // Get the file buffer
  const fileBuffer = file.data;

  // MySQL query to update task_pdf and status
  const query = `
    UPDATE task 
    SET 
      task_pdf = ?, 
      review_status = 'Pending',
      status = 'Completed', 
      submit_date = CURDATE(), 
      submit_time = CURTIME() 
    WHERE task_id = ?`;

  db.query(query, [fileBuffer, task_id], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Error updating task" });
    }

    // Send a success message
    res.status(200).json({ message: "PDF uploaded and task marked as completed successfully." });
  });
});




app.get("/api/reviewtasks/getTasksByDoctor", (req, res) => {
  const { doctor_id } = req.query; // Get doctor_id from query parameters

  if (!doctor_id) {
    return res.status(400).send("Missing doctor_id parameter");
  }

  const query = `
    SELECT task_id, task_type, task_title, task_description, trainee, doctor, patient, task_date, due_time, status, review_status , submit_date , submit_time
    FROM task
    WHERE doctor = ? 
    AND task_type = 'Lab Report' 
    AND review_status = 'Pending' 
    AND status = 'Completed';
  `;

  db.query(query, [doctor_id], (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).send("Error fetching tasks");
    }

    if (results.length === 0) {
      return res.status(404).send("No tasks found for this doctor");
    }

    res.status(200).json({ tasks: results });
  });
});






app.get("/api/labtask/:task_id", (req, res) => {
  const taskId = req.params.task_id;

  const query = `
    SELECT 
      task_id, task_type, task_title, task_description, trainee, doctor, patient, 
      created_date, task_date, due_time, shift_start, shift_end, task_pdf, 
      status, review_status, submit_date, submit_time 
    FROM task 
    WHERE task_id = ? AND task_type = 'Lab Report'
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error fetching task:", err);
      return res.status(500).json({ error: "Error fetching task" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Task not found or not a Lab Report" });
    }

    const task = results[0];
    res.json(task); // ✅ Return only JSON data, not PDF
  });
});

// 🆕 Add a separate endpoint to serve the PDF
app.get("/api/labtask/:task_id/pdf", (req, res) => {
  const taskId = req.params.task_id;

  const query = "SELECT task_pdf FROM task WHERE task_id = ?";
  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error fetching PDF:", err);
      return res.status(500).send("Error fetching PDF");
    }

    if (results.length === 0 || !results[0].task_pdf) {
      return res.status(404).send("No PDF found for this task");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=task_${taskId}.pdf`);
    res.send(results[0].task_pdf);
  });
});



app.put("/api/labtask/:task_id", (req, res) => {
  const taskId = req.params.task_id; // Get task_id from URL parameter
  const { feedback, rating } = req.body; // Get feedback and rating from request body

  // Validate feedback and rating are provided
  if (!feedback || !rating) {
    return res.status(400).json({ error: "Feedback and rating are required" });
  }

  const query = `
    UPDATE task
    SET feedback = ?, rating = ? , review_status = 'Completed'
    WHERE task_id = ? 
  `;

  // Execute the query
  db.query(query, [feedback, rating, taskId], (err, results) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Error updating task" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found or not a Lab Report" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  });
});







app.get("/api/approvedreviewtasks/getTasksByDoctor", (req, res) => {
  const { doctor_id } = req.query; // Get doctor_id from query parameters

  if (!doctor_id) {
    return res.status(400).send("Missing doctor_id parameter");
  }

  const query = `
    SELECT task_id, task_type, task_title, task_description, trainee, doctor, patient, task_date, due_time, status, review_status , submit_date , submit_time , rating , feedback
    FROM task
    WHERE doctor = ? 
    AND task_type = 'Lab Report' 
    AND review_status = 'Completed' 
    AND status = 'Completed';
  `;

  db.query(query, [doctor_id], (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).send("Error fetching tasks");
    }

    if (results.length === 0) {
      return res.status(404).send("No tasks found for this doctor");
    }

    res.status(200).json({ tasks: results });
  });
});




//DoctorShiftView
app.get('/api/wardreviewtasks/doctor', (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!doctorId) {
    return res.status(400).send('Doctor ID is required');
  }

  const query = `
    SELECT task_id, task_type, task_title, trainee, ward, doctor, task_date, 
           shift_start, shift_end, review_status, rating
    FROM task
    WHERE doctor = ? 
    AND task_type = 'Ward Visit'
    AND review_status = 'Pending'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching ward review tasks for doctor:', err);
      return res.status(500).send('Error fetching ward review tasks for doctor');
    }
    res.status(200).json({ tasks: results });
  });
});



//DoctorShiftView
app.get('/api/completedwardtask/doctor', (req, res) => {
  const doctorId = req.query.doctor_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!doctorId) {
    return res.status(400).send('Doctor ID is required');
  }

  const query = `
    SELECT task_id, task_type, task_title, trainee, ward, doctor, task_date, 
           shift_start, shift_end, review_status, rating
    FROM task
    WHERE doctor = ? 
    AND task_type = 'Ward Visit'
    AND review_status = 'Completed'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching ward review tasks for doctor:', err);
      return res.status(500).send('Error fetching ward review tasks for doctor');
    }
    res.status(200).json({ tasks: results });
  });
});


// ShiftRate
app.get('/api/shiftrate/:task_id', (req, res) => {
  const taskId = req.params.task_id; // Get task_id from route parameters

  // Query to fetch the task data based on task_id
  const query = `
    SELECT task_id, task_type, task_title, trainee, ward, doctor, task_date, 
           shift_start, shift_end, review_status, rating
    FROM task
    WHERE task_id = ?`;

  // Execute the query
  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).send('Error fetching task data');
    }

    // Check if the task was found
    if (results.length === 0) {
      return res.status(404).send('Task not found');
    }

    // Send the task data as a response
    res.status(200).json({ task: results[0] });
  });
});



app.put("/api/shiftrate/updateRating", (req, res) => {
  const { task_id, rating } = req.body;

  if (!task_id || !rating) {
    return res.status(400).json({ error: "Missing task_id or rating" });
  }

  // MySQL query to update rating and review_status
  const query = `
    UPDATE task
    SET 
      rating = ?, 
      review_status = 'Completed'
    WHERE task_id = ?`;

  db.query(query, [rating, task_id], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Error updating task" });
    }

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Send a success message
    res.status(200).json({ message: "Task rating and review status updated successfully." });
  });
});


// Route to validate the current password for the doctor
app.post("/api/intern/validate-password", (req, res) => {
  const { trainee_id, currentPassword } = req.body;

  if (!trainee_id || !currentPassword) {
    return res.status(400).send("Trainee ID and current password are required.");
  }

  const sql = "SELECT trainee_password FROM trainee WHERE trainee_id = ?";
  db.query(sql, [trainee_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.length === 0) {
      return res.status(404).send("Trainee not found.");
    }

    const trainee = results[0];
    if (trainee.trainee_password === currentPassword) {
      res.json({ success: true, message: "Password validation successful." });
    } else {
      res.status(401).send("Current password is incorrect.");
    }
  });
});


// Route to update the password for the doctor
app.post("/api/intern/update-password", (req, res) => {
  const { trainee_id, newPassword } = req.body;

  if (!trainee_id || !newPassword) {
    return res.status(400).send("Trainee ID and new password are required.");
  }

  // Password update query
  const sql = "UPDATE trainee SET trainee_password = ? WHERE trainee_id = ?";
  db.query(sql, [newPassword, trainee_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Trainee not found.");
    }

    res.json({ success: true, message: "Password updated successfully." });
  });
});



app.get("/api/internlabtasks", (req, res) => {
  const traineeId = req.query.trainee_id; // Get trainee_id from query parameters
  
  if (!traineeId) {  // ✅ Corrected check
    return res.status(400).send("Trainee ID is required.");
  }

  console.log("Fetching tasks data for trainee_id:", traineeId);
  
  // SQL query to fetch task data with a WHERE condition based on the 'trainee' column
  const sql = "SELECT task_id, task_type, task_title, task_description, trainee, patient, task_date, due_time FROM task WHERE trainee = ? AND status = 'Pending'";

  db.query(sql, [traineeId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }
    
    console.log("Tasks data retrieved:", results);  // Log results
    
    // Format the task data
    const formattedResults = results.map(task => ({
      task_id: task.task_id,
      task_type: task.task_type || "N/A",
      task_title: task.task_title || "N/A",
      task_description: task.task_description || "N/A",
      trainee: task.trainee || "N/A",
      patient: task.patient || "N/A",
      task_date: task.task_date ? new Date(task.task_date).toLocaleDateString() : "N/A",
      due_time: task.due_time || "N/A"
    }));
    
    // Return the formatted task data in the response
    res.json({ tasks: formattedResults, total: formattedResults.length });
  });
});

app.get("/api/completeinternlabtasks", (req, res) => {
  const traineeId = req.query.trainee_id; // Get trainee_id from query parameters
  
  if (!traineeId) {  // ✅ Corrected check
    return res.status(400).send("Trainee ID is required.");
  }

  console.log("Fetching tasks data for trainee_id:", traineeId);
  
  // SQL query to fetch task data with a WHERE condition based on the 'trainee' column
  const sql = "SELECT task_id, task_type, task_title, task_description, trainee, patient, task_date, due_time FROM task WHERE trainee = ? AND status = 'Completed'";

  db.query(sql, [traineeId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Database query error.");
    }
    
    console.log("Tasks data retrieved:", results);  // Log results
    
    // Format the task data
    const formattedResults = results.map(task => ({
      task_id: task.task_id,
      task_type: task.task_type || "N/A",
      task_title: task.task_title || "N/A",
      task_description: task.task_description || "N/A",
      trainee: task.trainee || "N/A",
      patient: task.patient || "N/A",
      task_date: task.task_date ? new Date(task.task_date).toLocaleDateString() : "N/A",
      due_time: task.due_time || "N/A"
    }));
    
    // Return the formatted task data in the response
    res.json({ tasks: formattedResults, total: formattedResults.length });
  });
});





app.get('/api/tasks/internwardvisit', (req, res) => {
  const traineeId = req.query.trainee_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!traineeId) {
    return res.status(400).send('Trainee ID is required');
  }

  const query = `
    SELECT task_title, trainee, ward, task_date, shift_start, shift_end
    FROM task
    WHERE task_type = 'Ward Visit' AND trainee = ? AND review_status = 'Pending'
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      console.error('Error fetching Ward Visit tasks:', err);
      return res.status(500).send('Error fetching Ward Visit tasks');
    }
    res.status(200).json({ tasks: results });
  });
});

app.get('/api/tasks/completeinternwardvisit', (req, res) => {
  const traineeId = req.query.trainee_id; // Get doctor_id from query parameters

  // Check if doctor_id is provided
  if (!traineeId) {
    return res.status(400).send('Trainee ID is required');
  }

  const query = `
    SELECT task_title, trainee, ward, task_date, shift_start, shift_end
    FROM task
    WHERE task_type = 'Ward Visit' AND trainee = ? AND review_status = 'Completed'
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      console.error('Error fetching Ward Visit tasks:', err);
      return res.status(500).send('Error fetching Ward Visit tasks');
    }
    res.status(200).json({ tasks: results });
  });
});




app.get("/api/doctornamebyid/:doctor_id", (req, res) => {
  const { doctor_id } = req.params; // Fetch doctor_id from URL parameter

  if (!doctor_id) {
    return res.status(400).json({ error: "doctor_id is required" });
  }

  console.log(`Fetching doctor data for doctor_id: ${doctor_id}...`);

  const sql = `
    SELECT 
      doctor_id AS id, 
      doctor_fname, 
      doctor_lname 
    FROM 
      doctor
    WHERE 
      doctor_id = ?;
  `;

  db.query(sql, [doctor_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    console.log("Doctor data retrieved:", results[0]);

    const doctorData = {
      id: results[0].id,
      f_name: results[0].doctor_fname,
      l_name: results[0].doctor_lname
    };

    res.json({ doctor: doctorData });
  });
});



// API to get tasks and average rating for a specific trainee
app.get('/api/traineeperformance/:trainee_id', (req, res) => {
  const traineeId = req.params.trainee_id;

  const query = `
    SELECT
      task_type,
      DATE(task_date) AS task_date,
      rating
    FROM task
    WHERE trainee = ? AND review_status = 'Completed'
    ORDER BY task_date;
  `;

  const avgQuery = `
    SELECT
      AVG(rating) AS average_rating
    FROM task
    WHERE trainee = ? AND review_status = 'Completed';
  `;

  // Fetch task details for the trainee
  db.query(query, [traineeId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Fetch the average rating for the trainee
    db.query(avgQuery, [traineeId], (err, avgResults) => {
      if (err) {
        console.error('Error executing average rating query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const averageRating = avgResults[0]?.average_rating || 0;  // Default to 0 if no tasks found

      res.json({
        data: results,
        average_rating: averageRating
      });
    });
  });
});




// ✅ Get Lab Task Details (Includes Feedback & Rating)
app.get("/api/internlabtask/details/:task_id", (req, res) => {
  const taskId = req.params.task_id;

  const query = `
    SELECT 
      task_id, task_type, task_description, trainee, patient, doctor, 
      status, review_status, feedback, rating
    FROM task 
    WHERE task_id = ? AND task_type = 'Lab Report'
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error fetching lab task:", err);
      return res.status(500).json({ error: "Error fetching lab task" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Task not found or not a Lab Report" });
    }

    res.json(results[0]);
  });
});

// ✅ Download Lab Task PDF
app.get("/api/internlabtask/pdf/:task_id", (req, res) => {
  const taskId = req.params.task_id;

  const query = "SELECT task_pdf FROM task WHERE task_id = ?";
  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error fetching PDF:", err);
      return res.status(500).send("Error fetching PDF");
    }

    if (results.length === 0 || !results[0].task_pdf) {
      return res.status(404).send("No PDF found for this task");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=task_${taskId}.pdf`);
    res.send(results[0].task_pdf);
  });
});


app.get("/intern/task-count/:traineeId", (req, res) => {
  const { traineeId } = req.params;

  const query = `
    SELECT COUNT(task_id) AS totalTasks 
    FROM task 
    WHERE trainee = ? 
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    const { totalTasks } = results[0];
    res.json({ traineeId, totalTasks });
  });
});


app.get("/intern/pendingtask-count/:traineeId", (req, res) => {
  const { traineeId } = req.params;

  const query = `
    SELECT COUNT(task_id) AS pendingTasks
    FROM task
    WHERE trainee = ?
    AND (
      (status = 'Pending' AND review_status IS NULL)
      OR 
      (status IS NULL AND review_status = 'Pending')
    )
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    const { pendingTasks } = results[0];
    res.json({ traineeId, pendingTasks });
  });
});



app.get("/intern/task-status-count/:traineeId", (req, res) => {
  const { traineeId } = req.params;

  // Query for Pending tasks
  const pendingQuery = `
    SELECT COUNT(task_id) AS pendingTaskCount
FROM task
WHERE trainee = ?
  AND (
    (status = 'Pending' AND review_status IS NULL)
    OR 
    (status IS NULL AND review_status = 'Pending')
  )
  `;

  // Query for Submitted tasks (Completed and Pending review)
  const submittedQuery = `
    SELECT COUNT(task_id) AS submittedTaskCount
    FROM task
    WHERE (status = 'Completed' OR status IS NULL)
      AND review_status = 'Pending'
      AND trainee = ?
  `;

  // Query for Reviewed tasks (Completed and Reviewed)
  const reviewedQuery = `
    SELECT COUNT(task_id) AS reviewedTaskCount
    FROM task
    WHERE (status = 'Completed' OR status IS NULL)
      AND review_status = 'Completed'
      AND trainee = ?
  `;

  // Run the three queries in parallel using Promises
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(pendingQuery, [traineeId], (err, results) => {
        if (err) reject(err);
        resolve(results[0].pendingTaskCount);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(submittedQuery, [traineeId], (err, results) => {
        if (err) reject(err);
        resolve(results[0].submittedTaskCount);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(reviewedQuery, [traineeId], (err, results) => {
        if (err) reject(err);
        resolve(results[0].reviewedTaskCount);
      });
    })
  ])
    .then(([pendingCount, submittedCount, reviewedCount]) => {
      res.json({
        pending: pendingCount,
        submitted: submittedCount,
        reviewed: reviewedCount
      });
    })
    .catch((error) => {
      console.error("Error fetching task counts:", error);
      res.status(500).json({ error: "Database query error" });
    });
});



app.get("/intern/pending-taskslist/:traineeId", (req, res) => {
  const { traineeId } = req.params;

  const query = `
    SELECT task_id, task_title, patient, task_date, due_time
    FROM task
    WHERE trainee = ?
      AND task_type = 'Lab Report'
      AND (
        (status = 'Pending' AND review_status IS NULL)
        OR 
        (status IS NULL AND review_status = 'Pending')
      )
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    res.json({ traineeId, pendingTasks: results });
  });
});


app.get("/intern/pending-wardvisit-tasks/:traineeId", (req, res) => {
  const { traineeId } = req.params;

  const query = `
    SELECT task_id, task_title, ward, task_date, shift_start, shift_end 
    FROM task
    WHERE trainee = ?
      AND task_type = 'Ward Visit'
      AND (status IS NULL AND review_status = 'Pending')
  `;

  db.query(query, [traineeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    res.json({ traineeId, pendingWardVisitTasks: results });
  });
});




app.get("/intern/assigned-trainees/count/:assignedTo", (req, res) => {
  const { assignedTo } = req.params;  // Get the assigned_to value from the URL parameter

  const query = `
    SELECT COUNT(trainee_id) AS assigned_trainee_count
    FROM trainee
    WHERE assigned_to = ?
  `;

  db.query(query, [assignedTo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // Send the count result in the response
    res.json({
      assignedTo,
      assigned_trainee_count: results[0].assigned_trainee_count
    });
  });
});



app.get("/doctor/pending-reviews/count/:doctorId", (req, res) => {
  const { doctorId } = req.params; // Get doctor_id from URL parameter

  const query = `
    SELECT COUNT(task_id) AS pending_task_count
    FROM task
    WHERE review_status = 'Pending' AND doctor = ?;
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // Send the count result in the response
    res.json({
      doctorId,
      pending_task_count: results[0].pending_task_count
    });
  });
});



app.get("/trainee/status/count/:assignedTo", (req, res) => {
  const { assignedTo } = req.params; // Get the assigned_to value from the URL parameter

  const query = `
    SELECT 
      status, 
      COUNT(trainee_id) AS trainee_count
    FROM trainee
    WHERE assigned_to = ?
    AND status IN ('active', 'inactive')
    GROUP BY status;
  `;

  db.query(query, [assignedTo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // Send the result in the response
    res.json({
      assignedTo,
      trainee_counts: results
    });
  });
});


app.get("/doctor/task-status/count/:doctorId", (req, res) => {
  const { doctorId } = req.params;  // Get the doctor ID from the URL parameter

  const query = `
    SELECT 
      trainee, 
      SUM(CASE WHEN review_status = 'Pending' THEN 1 ELSE 0 END) AS pending_task_count,
      SUM(CASE WHEN review_status = 'Completed' THEN 1 ELSE 0 END) AS completed_task_count
    FROM task
    WHERE doctor = ?
    GROUP BY trainee;
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // Send the results in the response
    res.json({
      doctorId,
      task_counts: results
    });
  });
});



app.get('/tasks/today/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;

  // SQL query to fetch tasks for the current date and a specific doctor
  const query = `
    SELECT 
      task_id, 
      task_title, 
      trainee, 
      task_date, 
      due_time, 
      shift_end
    FROM 
      task
    WHERE 
      task_date = CURDATE()
      AND doctor = ?;
  `;

  // Execute query
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).json({ error: 'Database error' });
    }

    // Send the results back as JSON
    res.json(results);
  });
});



app.get("/doctor/lab-tasksmanage/:doctorId", (req, res) => {
  const { doctorId } = req.params; // Get the doctor ID from the URL parameter

  const query = `
    SELECT 
      task_id, 
      task_title, 
      task_description, 
      trainee, 
      patient, 
      task_date, 
      due_time, 
      status, 
      review_status, 
      rating
    FROM task
    WHERE task_type = 'Lab Report' AND doctor = ?;
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // Send the results in the response
    res.json({
      doctorId,
      lab_tasks: results,
    });
  });
});



app.get('/api/labtasks/getTaskById/:task_id', (req, res) => {
  const { task_id } = req.params; // Get the task ID from the URL parameter

  const query = `
    SELECT task_title, task_description, trainee, patient, task_date, due_time
    FROM task
    WHERE task_id = ?;
  `;

  db.query(query, [task_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Send the task details in the response
    res.json({
      task: results[0], // Return the task details
    });
  });
});



app.put('/api/updatelabtasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { task_title, task_description, trainee, patient, task_date, due_time } = req.body;

  // SQL query to update task information
  const query = `
    UPDATE task
    SET task_title = ?, task_description = ?, trainee = ?, patient = ?, task_date = ?, due_time = ?
    WHERE task_id = ?
  `;

  // Execute the query
  db.query(query, [task_title, task_description, trainee, patient, task_date, due_time, taskId], (err, results) => {
    if (err) {
      console.error('Error updating task information:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if any rows were affected (task exists and was updated)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Send a success response
    res.json({ message: 'Task updated successfully!' });
  });
});



// API endpoint to fetch logs for doctors ordered by date
app.get('/api/logs/doctor', (req, res) => {
  const query = `
    SELECT logid, userid, date
    FROM loginlogs
    WHERE role = 'doctor' AND DATE(date) = CURDATE();
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    res.json(results);
  });
});


// API endpoint to fetch logs for doctors ordered by date
app.get('/api/logs/intern', (req, res) => {
  const query = `
    SELECT logid, userid, date
    FROM loginlogs
    WHERE role = 'Intern' AND DATE(date) = CURDATE();
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    res.json(results);
  });
});


// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
