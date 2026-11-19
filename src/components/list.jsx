
import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../services/api";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function List({ onEdit, refresh }) {
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    email: "",
    role: ""
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refresh]);

  const handleFilter = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        await fetchEmployees();
      } catch (error) {
        alert("Failed to delete employee");
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      String(emp.id).toLowerCase().includes(filters.id.toLowerCase()) &&
      (emp.name || "").toLowerCase().includes(filters.name.toLowerCase()) &&
      (emp.email || "").toLowerCase().includes(filters.email.toLowerCase()) &&
      (emp.role || "").toLowerCase().includes(filters.role.toLowerCase())
    );
  });

  // Pagination calculations
  const totalEmployees = filteredEmployees.length;

  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const clearFilters = () => {
    setFilters({
      id: "",
      name: "",
      email: "",
      role: ""
    });

    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Keep current page valid after deletion/filtering
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="employee-list-container">

      <div className="table-wrapper">
        <table className="employee-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th className="action-heading">Actions</th>
            </tr>

            {/* Column Search */}
            <tr className="filter-row">
              <th>
                <input
                  type="text"
                  name="id"
                  placeholder="Search ID..."
                  value={filters.id}
                  onChange={handleFilter}
                />
              </th>

              <th>
                <input
                  type="text"
                  name="name"
                  placeholder="Search name..."
                  value={filters.name}
                  onChange={handleFilter}
                />
              </th>

              <th>
                <input
                  type="text"
                  name="email"
                  placeholder="Search email..."
                  value={filters.email}
                  onChange={handleFilter}
                />
              </th>

              <th>
                <input
                  type="text"
                  name="role"
                  placeholder="Search role..."
                  value={filters.role}
                  onChange={handleFilter}
                />
              </th>

              <th className="action-heading">
                <button
                  className="clear-filter-btn"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty">
                  Loading employees...
                </td>
              </tr>
            ) : currentEmployees.length > 0 ? (
              currentEmployees.map((emp) => (
                <tr key={emp.id}>

                  <td className="employee-id">#{emp.id}</td>

                  <td className="employee-name">{emp.name}</td>

                  <td className="employee-email">{emp.email}</td>

                  <td>
                    <span className={`role role-${(emp.role || "").toLowerCase()}`}>
                      {emp.role}
                    </span>
                  </td>

                  <td>
                    <div className="actions">

                      <button
                        className="edit-btn"
                        title="Edit Employee"
                        onClick={() => onEdit(emp.id)}
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        className="delete-btn"
                        title="Delete Employee"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-container">

        <div className="pagination-info">
          Showing{" "}
          <strong>
            {totalEmployees === 0 ? 0 : startIndex + 1}
          </strong>
          {" "}to{" "}
          <strong>
            {Math.min(startIndex + itemsPerPage, totalEmployees)}
          </strong>
          {" "}of{" "}
          <strong>{totalEmployees}</strong> employees
        </div>

        <div className="pagination-controls">

          <div className="page-size">
            <label>Rows:</label>

            <select
              value={itemsPerPage}
              onChange={handleItemsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            className="page-btn"
            disabled={currentPage === 1 || totalPages === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={17} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active-page" : ""
                  }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

          <button
            className="page-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={17} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default List;
