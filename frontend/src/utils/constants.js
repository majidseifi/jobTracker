export const STATUS_OPTIONS = [
  { value: "To-Do", label: "To-Do", color: "#F59E0B", cssColor: "warning" },
  { value: "Applied", label: "Applied", color: "#3B82F6", cssColor: "primary" },
  { value: "Already Applied", label: "Already Applied", color: "#06B6D4", cssColor: "info" },
  { value: "Interviewed", label: "Interviewed", color: "#8B5CF6", cssColor: "info" },
  { value: "Rejected", label: "Rejected", color: "#EF4444", cssColor: "danger" },
  { value: "Not Relevant", label: "Not Relevant", color: "#6B7280", cssColor: "secondary" },
];

export const INTERVIEW_TYPES = [
  "Phone Screen",
  "Technical Screen",
  "Behavioral Interview",
  "System Design",
  "Take-home Assignment",
  "On-site Interview",
  "Final Round",
  "HR Round",
];

export const API_BASE_URL = "http://localhost:5050/api";
