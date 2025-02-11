import React from "react";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import SidebarAdmin from "./components/Sidebar_admin";
import SidebarDoctor from "./components/SidebarDoctor";
import SidebarIntern from "./components/SidebarIntern";
import Login from "./pages/Login";
import AdminLogin from "./pages/Admin_login";
import TraineeLogin from "./pages/Trainee_login";
import DoctorLogin from "./pages/Doctor_login";
import ResetPassword from "./pages/Reset_password";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctor from "./pages/AdminDoctor";
import AddDoctors from "./pages/AddDoctors";
import AdminTrainee from "./pages/AdminTrainee";
import AddTrainee from "./pages/AddTrainee";
import AdminPatient from "./pages/AdminPatient";
import AdminSettings from "./pages/AdminSettings";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorIntern from "./pages/DoctorIntern";
import DoctorTask from "./pages/DoctorTask";
import DoctorPatient from "./pages/DoctorPatient";
import DoctorSettings from "./pages/DoctorSettings";
import InternDashboard from "./pages/InternDashboard";
import InternTask from "./pages/InternTask";
import DoctorReview from "./pages/DoctorReview";
import LabTaskReview from "./pages/LabTaskReview";
import ShiftView from "./pages/DoctorShiftView";
import InternPatient from "./pages/InternPatient";
import InternSetting from "./pages/InternSetting";
import DoctorPatientProfile from "./pages/DoctorPatientProfile";
import InternCalendar from "./pages/InternCalendar";
import InternPatientProfile from "./pages/InternPatientProfile";
import DoctorInternProfile from "./pages/DoctorInternProfile";
import DoctorTaskManage from "./pages/DoctorTaskManage";

// Simulate user role and authentication
const isAuthenticated = true;

function ProtectedRoute({ element: Element }) {
  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
}

function Layout({ children, sidebar }) {
  return (
    <div style={{ display: "flex", height: "100vh", margin: 0, padding: 0 }}>
      {sidebar}
      <div style={{ flex: 1, overflowY: "auto", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/trainee-login" element={<TraineeLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes with Sidebar */}
          <Route
            path="/admin-dashboard"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AdminDashboard} />
              </Layout>
            }
          />
          <Route
            path="/admin/doctor"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AdminDoctor} />
              </Layout>
            }
          />
          <Route
            path="/admin/add-doctor"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AddDoctors} />
              </Layout>
            }
          />
          <Route
            path="/admin/trainee"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AdminTrainee} />
              </Layout>
            }
          />
          <Route
            path="/admin/add-trainee"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AddTrainee} />
              </Layout>
            }
          />
          <Route
            path="/admin/patient"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AdminPatient} />
              </Layout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <Layout sidebar={<SidebarAdmin />}>
                <ProtectedRoute element={AdminSettings} />
              </Layout>
            }
          />

          {/* Doctor Routes with Sidebar */}
          <Route
            path="/doctor-dashboard"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorDashboard} />
              </Layout>
            }
          />
          <Route
            path="/doctor/intern"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorIntern} />
              </Layout>
            }
          />
          <Route
            path="/doctor/task"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorTask} />
              </Layout>
            }
          />
          <Route
            path="/doctor/labreview"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorReview} />
              </Layout>
            }
          />
          <Route
            path="/doctor/patient"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorPatient} />
              </Layout>
            }
          />
          <Route
            path="/doctor/settings"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorSettings} />
              </Layout>
            }
          />
          <Route
            path="/doctor/labreportview/:taskId"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={LabTaskReview} />
              </Layout>
            }
          />
          <Route
            path="/doctor/shiftview"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={ShiftView} />
              </Layout>
            }
          />
          <Route
            path="/doctor/patientprofile/:patient_id"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorPatientProfile} />
              </Layout>
            }
          />
          <Route
            path="/doctor/internprofile/:trainee_id"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorInternProfile} />
              </Layout>
            }
          />
          <Route
            path="/doctor/task/manage"
            element={
              <Layout sidebar={<SidebarDoctor />}>
                <ProtectedRoute element={DoctorTaskManage} />
              </Layout>
            }
          />

          <Route
            path="/intern-dashboard"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternDashboard} />
              </Layout>
            }
          />
          <Route
            path="/intern/task"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternTask} />
              </Layout>
            }
          />
          <Route
            path="/intern/patient"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternPatient} />
              </Layout>
            }
          />
          <Route
            path="/intern/settings"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternSetting} />
              </Layout>
            }
          />
          <Route
            path="/intern/calendar"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternCalendar} />
              </Layout>
            }
          />
          <Route
            path="/intern/patientprofile/:patient_id"
            element={
              <Layout sidebar={<SidebarIntern />}>
                <ProtectedRoute element={InternPatientProfile} />
              </Layout>
            }
          />

          {/* Redirect to Admin Dashboard if no matching route */}
          <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
