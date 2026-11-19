
import React, { useState } from "react";
import Create from "./components/create";
import List from "./components/list";
import Edit from "./components/edit";
import "./App.css";

function App() {
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setEditId(null);
    setShowForm(false);
    setRefresh((prev) => prev + 1);
  };

  const handleAdd = () => {
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
  };

  return (
    <div className="app-container">

      {/* Header */}
      <div className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your team, employee details and records.</p>
        </div>

        {!showForm && (
          <button className="add-btn" onClick={handleAdd}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm ? (
        <div className="form-card">

          <div className="form-header">
            <h2>
              {editId ? "Edit Employee" : "Add New Employee"}
            </h2>

            <button
              className="close-btn"
              onClick={handleCancel}
            >
              ✕
            </button>
          </div>

          {editId ? (
            <Edit
              id={editId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <Create
              onSuccess={handleSuccess}
            />
          )}

        </div>
      ) : (

        /* Employee List */
        <div className="list-card">
          <div className="list-header">
            <div>
              <h2>Employee List</h2>
              <p>View and manage all employees</p>
            </div>
          </div>

          <List
            onEdit={handleEdit}
            refresh={refresh}
          />
        </div>

      )}

    </div>
  );
}

export default App;
