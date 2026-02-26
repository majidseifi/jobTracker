import axios from "axios";
import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Applications
export const getAllApplications = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return api.get(`/applications?${params}`);
};

export const getApplicationById = (id) => {
  return api.get(`/applications/${id}`);
};

export const createApplication = (data) => {
  return api.post("/applications", data);
};

export const updateApplication = (id, data) => {
  return api.put(`/applications/${id}`, data);
};

export const deleteApplication = (id) => {
  return api.delete(`/applications/${id}`);
};

export const updateStatus = (id, status) => {
  return api.patch(`/applications/${id}/status`, { status });
};

export const patchFields = (id, fields) => {
  return api.patch(`/applications/${id}/fields`, fields);
};

export const addInterview = (id, interview) => {
  return api.post(`/applications/${id}/interviews`, interview);
};

// Bulk Operations
export const bulkUpdateStatus = (ids, status) => {
  return Promise.all(ids.map((id) => updateStatus(id, status)));
};

export const bulkDelete = (ids) => {
  return Promise.all(ids.map((id) => deleteApplication(id)));
};

// Cache
export const refreshCache = () => {
  return api.post("/applications/refresh");
};

// Stats
export const getStats = () => {
  return api.get("/stats");
};

// Config
export const getConfig = () => {
  return api.get("/config");
};

export const updateSpreadsheetId = (spreadsheetId) => {
  return api.put("/config/spreadsheet-id", { spreadsheetId });
};

export default api;
