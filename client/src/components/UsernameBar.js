import React from "react";
import theme from "../styles/theme";

const UsernameBar = ({
  username,
  editingName,
  newName,
  setNewName,
  onChange,
  onSave,
}) => {
  return !editingName ? (
    <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
      <span>
        Logged in as <strong>{username}</strong>
      </span>
      <button onClick={onChange} style={buttonStyle}>Change Username</button>
    </div>
  ) : (
    <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New username"
        style={inputStyle}
      />
      <button onClick={onSave} style={buttonStyle}>Save</button>
    </div>
  );
};

const inputStyle = {
  flex: 1,
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #555",
  backgroundColor: theme.colors.input,
  color: theme.colors.text,
};

const buttonStyle = {
  padding: "8px 12px",
  backgroundColor: theme.colors.button,
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default UsernameBar;
