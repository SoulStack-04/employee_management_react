
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost/employee-api"
  baseURL: "http://localhost:8000/employee-api"
});

export const getEmployees = () => API.get("/employees");

export const addEmployee = (data) =>
  API.post("/employees", data);

export const getEmployee = (id) =>
  API.get(`/employees/${id}`);

export const updateEmployee = (id, data) =>
  API.put(`/employees/${id}`, data);

export const deleteEmployee = (id) =>
  API.delete(`/employees/${id}`);

export default API;
