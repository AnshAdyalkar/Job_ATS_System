import axios from "axios";

const BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export const signup = async (email, password) => {
  const res = await api.post("/auth/signup", { email, password });
  return res.data;
};


export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify/${token}`);
  return res.data;
};

export const requestReset = async (email) => {
  const res = await api.post("/auth/request-reset", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await api.post(`/auth/reset/${token}`, { password });
  return res.data;
};

export const uploadResume = async (formData) => {
  const res = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const analyzeResume = async (email) => {
  const res = await api.post("/analysis/analyze", { email });
  return res.data;
};

export const generateCareerPlan = async (email, targetJob) => {
  const res = await api.post("/analysis/career-plan", {
    email,
    targetJob,
  });

  return res.data;
};

export const getAnalysis = async (email) => {
  const res = await api.get(`/analysis/${email}`);
  return res.data;
};

export const getAnalysisHistory = async (email) => {
  const res = await api.get(`/analysis/history/${email}`);
  return res.data;
};

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put("/profile/me", payload);
  return res.data;
};

export default api;