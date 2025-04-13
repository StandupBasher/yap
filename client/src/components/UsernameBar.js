// client/src/components/UsernameBar.js

import React from "react";

const UsernameBar = ({ username, editingName, newName, setNewName, onChange, onSave }) => {
  return (
    <div>
      {!editingName ? (
        <div>
          Logged in as <strong>{username}</strong>{" "}
          <button onClick={onChange}>Change Username</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New username"
          />
          <button onClick={onSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default UsernameBar;