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

export const addInterview = (id, interview) => {
  return api.post(`/applications/${id}/interviews`, interview);
};

// Stats
export const getStats = () => {
  return api.get("/stats");
};

export default api;
