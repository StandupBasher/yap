import React from "react";

const Sidebar = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={iconStyle}>🏠</div>
      <div style={iconStyle}>💬</div>
      <div style={iconStyle}>⚙️</div>
    </div>
  );
};

const iconStyle = {
  width: "48px",
  height: "48px",
  backgroundColor: "#5865f2",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  color: "white",
  cursor: "pointer",
};

export default Sidebar;
