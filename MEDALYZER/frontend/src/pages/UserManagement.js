import React, { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

function UserManagement() {
  const [users, setUsers] = useState([
    { name: "John Doe", email: "john@example.com", role: "Administrator" },
    { name: "Jane Smith", email: "jane@example.com", role: "Assistant" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Assistant" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);

  const roles = ["Administrator", "Assistant"];

  const addUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setUsers([...users, newUser]);
      setNewUser({ name: "", email: "", role: "Assistant" });
    } else {
      alert("Please fill out all fields.");
    }
  };

  const deleteUser = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const editUser = (index) => {
    setIsEditing(true);
    setCurrentUserIndex(index);
    setNewUser(users[index]);
  };

  const updateUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const updatedUsers = users.map((user, index) =>
        index === currentUserIndex ? newUser : user
      );
      setUsers(updatedUsers);
      setNewUser({ name: "", email: "", role: "Assistant" });
      setIsEditing(false);
      setCurrentUserIndex(null);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const exportUsersCSV = () => {
    const csvContent = [
      ["Name", "Email", "Role"],
      ...users.map((user) => [user.name, user.email, user.role]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "users.csv");
  };

  const exportUsersPDF = () => {
    const doc = new jsPDF();
    doc.text("User Management Report", 14, 10);
    doc.autoTable({
      head: [["Name", "Email", "Role"]],
      body: users.map((user) => [user.name, user.email, user.role]),
    });
    doc.save("users.pdf");
  };

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      <div className="add-user-form">
        <h2>{isEditing ? "Edit User" : "Add New User"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
        {isEditing ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>
      <div className="user-list">
        <h2>Current Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>{user.name}</strong> - {user.email} ({user.role})
              <button onClick={() => deleteUser(index)}>Delete</button>
              <button onClick={() => editUser(index)}>Edit</button>
            </li>
          ))}
        </ul>
        <h3>Total Users: {users.length}</h3>
      </div>
      <div className="export-buttons">
        <h2>Export Users</h2>
        <button onClick={exportUsersCSV}>Export CSV</button>
        <button onClick={exportUsersPDF}>Export PDF</button>
      </div>
    </div>
  );
}

export default UserManagement;
