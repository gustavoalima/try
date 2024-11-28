import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "250px",
        backgroundColor: "#2c3e50",
        color: "white",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "18px", textAlign: "center" }}>
        Menu
      </h2>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        <li onClick={() => navigate("/dashboard")} style={menuItemStyle}>
          Dashboard
        </li>
        <li onClick={() => navigate("/dashboard/alunos")} style={menuItemStyle}>
          Alunos
        </li>
        <li onClick={() => navigate("/dashboard/avaliacoes")} style={menuItemStyle}>
          Avaliações
        </li>
        <li onClick={() => navigate("/dashboard/backup")} style={menuItemStyle}>
          Backup
        </li>
        <li onClick={handleLogout} style={menuItemStyle}>
          Logout
        </li>
      </ul>
    </div>
  );
};

const menuItemStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  borderRadius: "5px",
  marginBottom: "10px",
  backgroundColor: "transparent",
  color: "white",
  transition: "background-color 0.3s",
  textAlign: "center",
};

menuItemStyle[":hover"] = {
  backgroundColor: "#34495e",
};

export default Menu;
