import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaTasks,
  FaCheckSquare,
  FaChevronDown,
  FaFileMedical,
  FaClock,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidebarDoctor = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tasksDropdownOpen, setTasksDropdownOpen] = useState(false); // Manage tasks dropdown state
  const [reviewDropdownOpen, setReviewDropdownOpen] = useState(false); // Manage review dropdown state
  const location = useLocation();
  const navigate = useNavigate();

  const handleMouseEnter = (index) => setHoverIndex(index);
  const handleMouseLeave = () => setHoverIndex(null);

  const toggleTasksDropdown = () => setTasksDropdownOpen(!tasksDropdownOpen); // Toggle tasks dropdown
  const toggleReviewDropdown = () => setReviewDropdownOpen(!reviewDropdownOpen); // Toggle review dropdown

  const handleLogout = () => {
    localStorage.removeItem("doctor_id");
    localStorage.removeItem("doctor_fname");
    localStorage.removeItem("doctor_lname");
    localStorage.removeItem("doctor_username");
    localStorage.removeItem("doctor_password");
    navigate("/");
  };

  const navItems = [
    { path: "/doctor-dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
    { path: "/doctor/intern", icon: <FaUserGraduate />, text: "Interns" },
    { path: "/doctor/patient", icon: <FaClipboardList />, text: "Patients" },
    {
      text: "Tasks",
      icon: <FaTasks />,
      isDropdown: true,
      subItems: [
        {
          path: "/doctor/task",
          icon: <FaCheckSquare />,
          text: "Overview",
        },
        {
          path: "/doctor/task/manage",
          icon: <FaClipboardList />,
          text: "Manage",
        },
      ],
    },
    {
      text: "Review",
      icon: <FaCheckSquare />,
      isDropdown: true,
      subItems: [
        {
          path: "/doctor/labreview",
          icon: <FaFileMedical />,
          text: "Lab Reports",
        },
        { path: "/doctor/shiftview", icon: <FaClock />, text: "Shifts" },
      ],
    },
    { path: "/doctor/settings", icon: <FaCog />, text: "Settings" },
    { icon: <FaSignOutAlt />, text: "Logout", onClick: handleLogout },
  ];

  // Check if the current path matches the Task or Review pages
  const isTasksPage =
    location.pathname.startsWith("/doctor/task/manage") ||
    location.pathname.startsWith("/doctor/task");
  const isReviewPage =
    location.pathname.startsWith("/doctor/labreview") ||
    location.pathname.startsWith("/doctor/shiftview");

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <img src="/Nexus.png" alt="Logo" style={styles.logo} />
        <div style={styles.separatorLine}></div>
      </div>

      <ul style={styles.sidebarNav}>
        {navItems.map((item, index) => {
          const isActive =
            item.path && location.pathname.startsWith(item.path);

          return item.isDropdown ? (
            <li
              key={index}
              style={{
                ...styles.navItem,
                position: "relative",
                backgroundColor:
                  (isTasksPage && item.text === "Tasks") ||
                  (isReviewPage && item.text === "Review") ||
                  hoverIndex === index
                    ? "rgb(28, 28, 28)"
                    : "transparent",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                style={{
                  ...styles.dropdownToggle,
                  color:
                    (isTasksPage && item.text === "Tasks") ||
                    (isReviewPage && item.text === "Review") ||
                    hoverIndex === index
                      ? "white"
                      : "rgba(64, 64, 64, 0.97)",
                }}
                onClick={item.text === "Tasks" ? toggleTasksDropdown : toggleReviewDropdown} // Determine which dropdown to toggle
              >
                <div
                  style={{
                    ...styles.navIcon,
                    color:
                      (isTasksPage && item.text === "Tasks") ||
                      (isReviewPage && item.text === "Review") ||
                      hoverIndex === index
                        ? "white"
                        : "rgba(64, 64, 64, 0.97)",
                  }}
                >
                  {item.icon}
                </div>

                <span style={styles.navText}>{item.text}</span>
                <FaChevronDown
                  style={{
                    marginLeft: "90px",
                    transition: "transform 0.3s, color 0.3s",
                    transform:
                      (item.text === "Tasks" ? tasksDropdownOpen : reviewDropdownOpen)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    color:
                      hoverIndex === index ||
                      (isTasksPage && item.text === "Tasks") ||
                      (isReviewPage && item.text === "Review")
                        ? "white"
                        : "rgba(64, 64, 64, 0.97)",
                  }}
                />
              </div>

              {(item.text === "Tasks" ? tasksDropdownOpen : reviewDropdownOpen) && (
                <ul style={styles.dropdownMenu}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} style={styles.dropdownItem}>
                      <Link to={subItem.path} style={styles.dropdownLink}>
                        <div style={{ ...styles.navIcon, color: "white" }}>
                          {subItem.icon}
                        </div>
                        {subItem.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li
              key={index}
              style={{
                ...styles.navItem,
                backgroundColor:
                  isActive || hoverIndex === index
                    ? "rgb(28, 28, 28)"
                    : "transparent",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {item.onClick ? (
                <button onClick={item.onClick} style={styles.navButton}>
                  <div
                    style={{
                      ...styles.navIcon,
                      color:
                        hoverIndex === index
                          ? "white"
                          : "rgba(64, 64, 64, 0.97)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={styles.navText}>{item.text}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    color:
                      isActive || hoverIndex === index
                        ? "white"
                        : "rgba(64, 64, 64, 0.97)",
                  }}
                >
                  <div
                    style={{
                      ...styles.navIcon,
                      color:
                        isActive || hoverIndex === index
                          ? "white"
                          : "rgba(64, 64, 64, 0.97)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={styles.navText}>{item.text}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "black",
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    position: "fixed",
    top: 0,
    left: 0,
    borderRight: "2px solid #dcdcdc",
  },
  sidebarHeader: {
    marginTop: "-45px",
    marginBottom: "0px",
    textAlign: "center",
  },
  logo: {
    width: "100%",
    maxWidth: "200px",
    height: "auto",
  },
  separatorLine: {
    width: "116%",
    height: "2px",
    backgroundColor: "black",
    marginTop: "-40px",
    marginBottom: "20px",
    marginLeft: "-20px",
  },
  sidebarNav: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0px",
    marginBottom: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out, border 0.3s ease-in-out",
  },
  navLink: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    transition: "color 0.3s ease-in-out",
    fontWeight: "bold",
  },
  navButton: {
    background: "none",
    border: "none",
    padding: 0,
    color: "rgba(64, 64, 64, 0.97)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  navIcon: {
    marginRight: "15px",
    fontSize: "1.2rem",
    transition: "color 0.3s ease-in-out",
    marginLeft: "30px",
  },
  navText: {
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Poppins, sans-serif",
  },
  dropdownToggle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "px 0px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
  dropdownToggleHover: {
    backgroundColor: "rgb(28, 28, 28)",
    color: "white",
  },

  dropdownMenu: {
    listStyleType: "none",
    padding: "5px 0",
    margin: "0",
    backgroundColor: "#222",
    borderRadius: "8px",
    position: "absolute",
    left: "0",
    top: "100%", // Ensures dropdown appears below "Review"
    width: "100%",
    zIndex: 1000, // Keeps it above other elements
  },

  dropdownItem: {
    padding: "10px 20px",
    transition: "background-color 0.3s ease-in-out",
  },

  dropdownLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "white",
    fontSize: "14px",
  },
};

export default SidebarDoctor;
