
import React, { useState } from "react";
import { addEmployee } from "../services/api";

function Create({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addEmployee(form);

      setMessage("Employee added successfully!");

      setForm({
        name: "",
        email: "",
        role: ""
      });

      onSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">

      <div className="create-title">
        <h2>Add New Employee</h2>
        <p>Enter employee information below.</p>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="employee-form">

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter employee full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Employee Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select employee role
            </option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default Create;
