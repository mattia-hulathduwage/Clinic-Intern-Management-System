import React, { useState } from 'react';
import { FaTachometerAlt, FaUserMd, FaUserGraduate, FaProcedures, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate  } from 'react-router-dom';

const SidebarAdmin = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const location = useLocation();
    const navigate = useNavigate(); // Use navigate hook for redirecting

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    const handleLogout = () => {
        // Logic for clearing authentication state or other cleanup
        localStorage.removeItem('admin_id'); // Example for removing token
        localStorage.removeItem('admin_fname');
        localStorage.removeItem('admin_lname');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_password');
        navigate('/'); // Redirect to login page
      };

      const navItems = [
        { path: "/admin-dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
        { path: "/admin/doctor", icon: <FaUserMd />, text: "Doctors" },
        { path: "/admin/trainee", icon: <FaUserGraduate />, text: "Interns" },
        { path: "/admin/patient", icon: <FaProcedures />, text: "Patients" },
        { path: "/admin/settings", icon: <FaCog />, text: "Settings" },
        { icon: <FaSignOutAlt />, text: "Logout", onClick: handleLogout }, // Logout item
      ];

    return (
        <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
                <img src="/Nexus.png" alt="Logo" style={styles.logo} />
                <div style={styles.separatorLine}></div> {/* Separator line element */}
            </div>

            <ul style={styles.sidebarNav}>
            {navItems.map((item, index) => {
    const isActive = location.pathname === item.path;
    return (
        <li
            key={index}
            style={{
                ...styles.navItem,
                backgroundColor: isActive || hoverIndex === index ? 'rgb(28, 28, 28)' : 'transparent',
                border: isActive || hoverIndex === index ? '0px solid rgba(0, 0, 0, 0.09)' : 'none',
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
        >
            {item.onClick ? (
                <button
                    onClick={item.onClick}
                    style={{
                        ...styles.navLink,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: hoverIndex === index ? 'white' : 'rgba(64, 64, 64, 0.97)',
                        cursor: 'pointer',
                    }}
                >
                    <div
                        style={{
                            ...styles.navIcon,
                            color: hoverIndex === index ? 'white' : 'rgba(64, 64, 64, 0.97)',
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
                        color: isActive || hoverIndex === index ? 'white' : 'rgba(64, 64, 64, 0.97)',
                    }}
                >
                    <div
                        style={{
                            ...styles.navIcon,
                            color: isActive || hoverIndex === index ? 'white' : 'rgba(64, 64, 64, 0.97)',
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
        width: '250px',
        height: '100vh',
        backgroundColor: 'black',
        color: '#ecf0f1',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        fontFamily: 'Poppins, sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        borderRight: '2px solid #dcdcdc',
    },
    sidebarHeader: {
        marginTop: '-45px',
        marginBottom: '0px',
        textAlign: 'center',
    },
    logo: {
        width: '100%',
        maxWidth: '200px',
        height: 'auto',
    },
    separatorLine: {
        width: '116%',
        height: '2px',
        backgroundColor: 'black',
        marginTop: '-40px',
        marginBottom: '20px',
        marginLeft: '-20px',
    },
    sidebarNav: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0px',
        marginBottom: '10px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out, border 0.3s ease-in-out',
    },
    navLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.3s ease-in-out',
        fontWeight: 'bold',
    },
    navIcon: {
        marginRight: '15px',
        fontSize: '1.2rem',
        transition: 'color 0.3s ease-in-out',
        marginLeft: '30px',
    },
    navText: {
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
    },
};

export default SidebarAdmin;
