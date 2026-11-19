
import React, { useEffect, useState } from "react";
import { getEmployee, updateEmployee } from "../services/api";

function Edit({ id, onSuccess, onCancel }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchEmployee = async () => {

      if (!id) return;

      setLoading(true);
      setMessage("");

      try {
        const res = await getEmployee(id);

        console.log("Employee Data:", res.data);

        setForm({
          name: String(res.data.name ?? ""),
          email: String(res.data.email ?? ""),
          role: String(res.data.role ?? "")
        });

      } catch (error) {

        console.error(error);
        setMessage("Unable to load employee details");

      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();

  }, [id]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateEmployee(id, form);

      onSuccess();

    } catch (error) {

      setMessage(
        error.response?.data?.message || "Update failed"
      );

    }

  };

  if (loading) {
    return <div className="card">Loading employee...</div>;
  }

  return (

    <div className="card">

      <h2>Edit Employee</h2>

      {message && (
        <p className="message">{message}</p>
      )}

      <form onSubmit={handleSubmit}>

        <label>Full Name</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />

        <label>Email Address</label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />

        <label>Employee Role</label>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >

          <option value="" disabled>
            Select Role
          </option>

          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>

        </select>

        <button type="submit" className="add-btn">
          Update Employee
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

      </form>

    </div>

  );

}

export default Edit;
